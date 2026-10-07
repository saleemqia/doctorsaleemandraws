// Patient cards built from the calendar: every visit is grouped by a normalised name (lib/clinic.ts patientKey).
// GET  /clinic/api/patients?q=&offset=       → patient list (newest visit first), search by name, phone or card number
// GET  /clinic/api/patients?no=10023         → one card: patient + all visits
// POST /clinic/api/patients?action=rebuild   → fills patient_key for rows that lack it (≤1500 per call; repeat until left=0)
// POST /clinic/api/patients?action=automerge → same phone + nearly the same name → one card (at most every 6 h)
// GET  /clinic/api/patients?all=1           → every card's summary (no, key, name, phones, visits, last) + "not the same" pairs,
//                                              for finding likely duplicates in the browser (one read per card)
// POST /clinic/api/patients?action=merge {to, from: no | no[], name?}  → the "from" cards join "to" (name = name to keep)
// POST ?action=unmerge {no} | nomerge {a, b} ("not the same person") | note {no, notes, card_no}
// POST ?action=save {no, name, phones, card_no, notes, rows:[{ref, day, work, paid_iqd, paid_usd, due_iqd, due_usd, hidden}], add:[…]}
//      Edits are stored in card_rows / patients.display_name, apart from the calendar and Excel data, so they survive re-syncs.
//
// D1's free plan counts every row a query reads (5 million a day), so the list reads a summary kept on the
// patients table (visits, first/last day, name, phones). It is rebuilt at most every 2 hours, only when visits changed.
// merged_into: NULL = own card, '' = owner un-merged it (never auto-merged again), text = shown on that card.
import { Env, autoMergePairs, ensureSchema, json, patientKey, setSetting } from "../../../lib/clinic";

const setting = async (env: Env, key: string) =>
  (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = ?").bind(key).first<{ value: string }>())?.value;

const STATS = (where: string) => `
  UPDATE patients SET visits = s.v, first_day = s.f, last_day = s.l, name = s.n, phones = s.ph FROM (
    SELECT coalesce(nullif(p.merged_into, ''), p.key) AS k, count(*) AS v, min(a.day) AS f, max(a.day) AS l,
           max(a.title) AS n, group_concat(DISTINCT nullif(a.phone, '')) AS ph
    FROM appointments a JOIN patients p ON p.key = a.patient_key
    WHERE a.removed = 0 ${where} GROUP BY 1) s
  WHERE patients.key = s.k`;

/** Whole-table summary refresh: only when something changed, and at most every 2 hours. */
async function refreshStats(env: Env, force = false) {
  if (!force) {
    if ((await setting(env, "stats_dirty")) !== "1") return;
    const last = await setting(env, "stats_at");
    if (last && Date.now() - Date.parse(last) < 2 * 3600 * 1000) return;
  }
  await env.DB.prepare(STATS("")).run();
  await setSetting(env, "stats_at", new Date().toISOString());
  await setSetting(env, "stats_dirty", "0");
}

/** One card's summary (reads only that patient's visits). */
async function refreshOne(env: Env, root: string) {
  await env.DB.prepare(STATS("AND a.patient_key IN (SELECT key FROM patients WHERE key = ?1 OR merged_into = ?1)")).bind(root).run();
}

async function assignNumbers(env: Env) {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO patients (key, no)
     SELECT k, (SELECT coalesce(max(no), 10000) FROM patients) + row_number() OVER (ORDER BY first, k) FROM (
       SELECT patient_key AS k, min(start) AS first FROM appointments
       WHERE removed = 0 AND patient_key IS NOT NULL AND patient_key NOT LIKE '#%'
         AND patient_key NOT IN (SELECT key FROM patients) GROUP BY patient_key)`,
  ).run();
}

async function autoMerge(env: Env) {
  const last = await setting(env, "last_automerge");
  if (last && Date.now() - Date.parse(last) < 6 * 3600 * 1000) return 0;
  await setSetting(env, "last_automerge", new Date().toISOString());
  const { results } = await env.DB.prepare(
    `SELECT a.phone, json_group_array(DISTINCT p.key) AS ks FROM appointments a JOIN patients p ON p.key = a.patient_key
     WHERE a.removed = 0 AND a.phone <> '' AND (p.merged_into IS NULL OR p.merged_into <> '') GROUP BY a.phone HAVING count(DISTINCT p.key) > 1`,
  ).all<{ phone: string; ks: string }>();
  const keys = [...new Set(results.flatMap((r) => JSON.parse(r.ks) as string[]))];
  const { results: rows } = await env.DB.prepare("SELECT key, no, merged_into FROM patients WHERE key IN (SELECT value FROM json_each(?))")
    .bind(JSON.stringify(keys)).all<{ key: string; no: number; merged_into: string | null }>();
  const info = new Map(rows.map((r) => [r.key, r]));
  const groups = results.map((r) => (JSON.parse(r.ks) as string[]).sort((a, b) => (info.get(a)?.no || 0) - (info.get(b)?.no || 0)));
  const { results: no } = await env.DB.prepare("SELECT a, b FROM merge_no").all<{ a: string; b: string }>();
  const refused = new Set(no.map((r) => r.a + "|" + r.b));
  const stmts = autoMergePairs(groups)
    .filter(([from, to]) => info.get(from)?.merged_into == null && !refused.has([from, to].sort().join("|")))
    .map(([from, to]) => env.DB.prepare("UPDATE patients SET merged_into = ? WHERE key = ? AND merged_into IS NULL").bind(info.get(to)?.merged_into || to, from));
  for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
  if (stmts.length) await setSetting(env, "stats_dirty", "1");
  return stmts.length;
}

const fail = (e: unknown, status = 500) => json({ ok: false, error: String((e as Error)?.message || e) }, status);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const u = new URL(request.url);
    const pending = await env.DB.prepare("SELECT count(*) AS n FROM appointments WHERE patient_key IS NULL").first<{ n: number }>();
    const no = parseInt(u.searchParams.get("no") || "");

    if (no) {
      const COLS = "key, no, notes, card_no, merged_into, display_name, phone_override, edited_at";
      const p = await env.DB.prepare(`SELECT ${COLS} FROM patients WHERE no = ?`).bind(no).first<Record<string, string>>();
      if (!p) return json({ error: "not found" }, 404);
      const main = p.merged_into || p.key;
      const card = main === p.key ? p : await env.DB.prepare(`SELECT ${COLS} FROM patients WHERE key = ?`).bind(main).first<Record<string, string>>();
      const { results: members } = await env.DB.prepare("SELECT key, no FROM patients WHERE key = ?1 OR merged_into = ?1").bind(main).all<{ key: string; no: number }>();
      const { results: visits } = await env.DB.prepare(
        `SELECT uid, day, start, end, title, phone, treatment, description, all_day AS allDay FROM appointments
         WHERE removed = 0 AND patient_key IN (SELECT value FROM json_each(?)) ORDER BY start`,
      ).bind(JSON.stringify(members.map((m) => m.key))).all<Record<string, string>>();
      const { results: payments } = await env.DB.prepare(
        `SELECT src, day, name, paid_iqd, paid_usd, due_iqd, due_usd, work, notes FROM payments
         WHERE patient_key IN (SELECT value FROM json_each(?)) ORDER BY day, id`,
      ).bind(JSON.stringify(members.map((m) => m.key))).all<Record<string, string>>();
      const refs = [...visits.map((v) => "a:" + v.uid), ...payments.map((y) => "p:" + y.src)];
      const { results: rows } = await env.DB.prepare(
        `SELECT id, ref, data, hidden, updated_at FROM card_rows
         WHERE patient_key IN (SELECT value FROM json_each(?1)) OR ref IN (SELECT value FROM json_each(?2))`,
      ).bind(JSON.stringify(members.map((m) => m.key)), JSON.stringify(refs)).all<Record<string, string>>();
      const count: Record<string, number> = {};
      for (const v of visits) count[v.title.trim()] = (count[v.title.trim()] || 0) + 1;
      const auto = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || payments[0]?.name || main;
      const autoPhones = [...new Set(visits.map((v) => v.phone).filter(Boolean))];
      const name = card?.display_name || auto;
      const phones = card?.phone_override != null ? card.phone_override.split(",").map((x) => x.trim()).filter(Boolean) : autoPhones;
      return json({ patient: { ...card, name, auto_name: auto, phones, auto_phones: autoPhones, merged: members.filter((m) => m.key !== main) },
        visits, payments, rows: rows.map((r) => ({ ...r, data: JSON.parse(r.data || "{}") })) });
    }

    if (!pending?.n) await refreshStats(env);
    if (u.searchParams.get("all")) {
      const { results } = await env.DB.prepare(
        `SELECT no, key, coalesce(display_name, name, key) AS name, coalesce(phone_override, phones) AS phones, visits, last_day AS last,
                merged_into = '' AS unmerged, no_msg, (SELECT max(sent_at) FROM msg_log m WHERE m.no = patients.no) AS last_msg FROM patients WHERE merged_into IS NULL OR merged_into = ''`,
      ).all();
      const { results: no } = await env.DB.prepare("SELECT a, b FROM merge_no").all();
      return json({ patients: results, no });
    }
    const q = (u.searchParams.get("q") || "").trim().slice(0, 60);
    const offset = Math.max(0, parseInt(u.searchParams.get("offset") || "0") || 0);
    const digits = q.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))).replace(/\D/g, "");
    const nq = q ? patientKey(q).replace(/^#/, "") : "";
    const { results } = await env.DB.prepare(
      `SELECT no, key, visits, first_day AS first, last_day AS last, coalesce(display_name, name, key) AS name, coalesce(phone_override, phones) AS phones FROM patients
       WHERE (merged_into IS NULL OR merged_into = '') AND (visits > 0 OR EXISTS (SELECT 1 FROM payments y WHERE y.patient_key = patients.key))
         AND (?1 = '' OR key LIKE '%' || ?1 || '%' OR (?2 <> '' AND (phones LIKE '%' || ?2 || '%' OR phone_override LIKE '%' || ?2 || '%'))
              OR CAST(no AS TEXT) = ?3 OR (?3 <> '' AND display_name LIKE '%' || ?3 || '%')
              OR EXISTS (SELECT 1 FROM patients c WHERE c.merged_into = patients.key AND (c.key LIKE '%' || ?1 || '%' OR CAST(c.no AS TEXT) = ?3)))
       ORDER BY coalesce(last_day, '0') DESC, no DESC LIMIT 100 OFFSET ?4`,
    ).bind(nq, digits.length >= 4 ? digits : "", q, offset).all();
    const total = await env.DB.prepare("SELECT count(*) AS n FROM patients WHERE (merged_into IS NULL OR merged_into = '') AND (visits > 0 OR EXISTS (SELECT 1 FROM payments y WHERE y.patient_key = patients.key))").first<{ n: number }>();
    return json({ q, total: total?.n || 0, pending: pending?.n || 0, patients: results });
  } catch (e) { return fail(e); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const action = new URL(request.url).searchParams.get("action");
    if (action === "automerge") return json({ ok: true, merged: await autoMerge(env) });
    if (action === "rebuild") {
      const { results } = await env.DB.prepare("SELECT uid, title FROM appointments WHERE patient_key IS NULL LIMIT 1500").all<{ uid: string; title: string }>();
      const stmts = results.map((r) => env.DB.prepare("UPDATE appointments SET patient_key = ? WHERE uid = ?").bind(patientKey(r.title || ""), r.uid));
      for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
      const left = await env.DB.prepare("SELECT count(*) AS n FROM appointments WHERE patient_key IS NULL").first<{ n: number }>();
      if (!left?.n) { await assignNumbers(env); await refreshStats(env, true); }
      return json({ ok: true, done: results.length, left: left?.n || 0 });
    }
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    if (action === "merge") {
      const to = await env.DB.prepare("SELECT key, merged_into FROM patients WHERE no = ?").bind(Number(body.to)).first<{ key: string; merged_into: string }>();
      const fromNos = (Array.isArray(body.from) ? body.from : [body.from]).map(Number).filter(Boolean).slice(0, 30);
      if (!to || !fromNos.length) return json({ ok: false, error: "bad numbers" }, 400);
      const target = to.merged_into || to.key;
      const { results: from } = await env.DB.prepare("SELECT key, no FROM patients WHERE no IN (SELECT value FROM json_each(?))")
        .bind(JSON.stringify(fromNos)).all<{ key: string; no: number }>();
      const moving = from.filter((f) => f.key !== target);
      if (!moving.length) return json({ ok: false, error: "bad numbers" }, 400);
      const stmts = moving.flatMap((f) => [
        env.DB.prepare("UPDATE patients SET merged_into = ? WHERE key = ? OR merged_into = ?").bind(target, f.key, f.key),
        env.DB.prepare("DELETE FROM merge_no WHERE (a = ?1 AND b = ?2) OR (a = ?2 AND b = ?1)").bind(f.key, target),
      ]);
      if (typeof body.name === "string" && body.name.trim())
        stmts.push(env.DB.prepare("UPDATE patients SET display_name = ?, edited_at = datetime('now') WHERE key = ?").bind(body.name.trim().slice(0, 120), target));
      await env.DB.batch(stmts);
      await refreshOne(env, target);
      return json({ ok: true, merged: moving.map((f) => f.no) });
    }
    if (action === "unmerge") {
      const p = await env.DB.prepare("SELECT key, merged_into FROM patients WHERE no = ?").bind(Number(body.no)).first<{ key: string; merged_into: string }>();
      if (!p) return json({ ok: false, error: "bad number" }, 400);
      // undo = the merge was a slip: back to an ordinary card. Otherwise the owner says "not the same person": remembered.
      const stmts = [env.DB.prepare("UPDATE patients SET merged_into = ? WHERE no = ?").bind(body.undo ? null : "", Number(body.no))];
      if (p.merged_into && !body.undo) stmts.push(env.DB.prepare("INSERT OR IGNORE INTO merge_no (a, b) VALUES (?, ?)").bind(...[p.key, p.merged_into].sort()));
      await env.DB.batch(stmts);
      await refreshOne(env, p.key);
      if (p.merged_into) await refreshOne(env, p.merged_into);
      return json({ ok: true });
    }
    if (action === "nomsg") {
      await env.DB.prepare("UPDATE patients SET no_msg = ? WHERE no = ?").bind(body.value ? 1 : 0, Number(body.no)).run();
      return json({ ok: true });
    }
    if (action === "sent") {
      const nos = (Array.isArray(body.nos) ? body.nos : [body.no]).map(Number).filter((n: number) => n > 0).slice(0, 200);
      if (nos.length) await env.DB.batch(nos.map((n: number) => env.DB.prepare("INSERT INTO msg_log (no, campaign) VALUES (?, ?)").bind(n, String(body.campaign || "").slice(0, 60))));
      return json({ ok: true });
    }
    if (action === "nomerge") {
      const { results } = await env.DB.prepare("SELECT key FROM patients WHERE no IN (?, ?)").bind(Number(body.a), Number(body.b)).all<{ key: string }>();
      if (results.length !== 2) return json({ ok: false, error: "bad numbers" }, 400);
      await env.DB.prepare("INSERT OR IGNORE INTO merge_no (a, b) VALUES (?, ?)").bind(...results.map((r) => r.key).sort()).run();
      return json({ ok: true });
    }
    if (action === "save") {
      const p = await env.DB.prepare("SELECT key, merged_into FROM patients WHERE no = ?").bind(Number(body.no)).first<{ key: string; merged_into: string }>();
      if (!p) return json({ ok: false, error: "bad number" }, 400);
      const main = p.merged_into || p.key;
      const str = (v: unknown, n: number) => (v == null ? null : String(v).trim().slice(0, n) || null);
      const num = (v: unknown) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
      const clean = (r: Record<string, unknown>) => {
        const d: Record<string, unknown> = {};
        if (typeof r.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.day)) d.day = r.day;
        if ("work" in r) d.work = str(r.work, 300) ?? "";
        if ("notes" in r) d.notes = str(r.notes, 300) ?? "";
        for (const f of ["paid_iqd", "paid_usd", "due_iqd", "due_usd"]) if (f in r) d[f] = num(r[f]);
        return d;
      };
      const stmts: D1PreparedStatement[] = [];
      if ("name" in body || "phones" in body || "notes" in body || "card_no" in body) {
        const phones = body.phones == null ? null : String(body.phones).replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c)))
          .split(/[,،\n]+/).map((x) => x.replace(/[^\d+]/g, "")).filter((x) => x.length >= 7).join(",");
        stmts.push(env.DB.prepare(
          `UPDATE patients SET display_name = ?, phone_override = ?, notes = ?, card_no = ?, edited_at = datetime('now') WHERE key = ?`,
        ).bind(str(body.name, 120), body.phones == null ? null : phones, str(body.notes, 2000) ?? "", str(body.card_no, 20) ?? "", main));
      }
      for (const r of (Array.isArray(body.rows) ? body.rows : []).slice(0, 200) as Record<string, unknown>[]) {
        const ref = String(r.ref || "");
        if (/^m:\d+$/.test(ref)) {
          stmts.push(env.DB.prepare("UPDATE card_rows SET data = ?, hidden = ?, updated_at = datetime('now') WHERE id = ? AND ref IS NULL")
            .bind(JSON.stringify(clean(r)), r.hidden ? 1 : 0, Number(ref.slice(2))));
        } else if (/^[ap]:/.test(ref)) {
          stmts.push(env.DB.prepare(
            `INSERT INTO card_rows (patient_key, ref, data, hidden) VALUES (?, ?, ?, ?)
             ON CONFLICT(ref) DO UPDATE SET data = excluded.data, hidden = excluded.hidden, updated_at = datetime('now')`,
          ).bind(main, ref.slice(0, 200), JSON.stringify(clean(r)), r.hidden ? 1 : 0));
        }
      }
      for (const r of (Array.isArray(body.add) ? body.add : []).slice(0, 50) as Record<string, unknown>[]) {
        const d = clean(r); if (!d.day) continue;
        stmts.push(env.DB.prepare("INSERT INTO card_rows (patient_key, ref, data) VALUES (?, NULL, ?)").bind(main, JSON.stringify(d)));
      }
      if (!stmts.length) return json({ ok: true, saved: 0 });
      for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));
      return json({ ok: true, saved: stmts.length });
    }
    if (action === "note") {
      await env.DB.prepare("UPDATE patients SET notes = ?, card_no = ? WHERE no = ?")
        .bind(String(body.notes || "").slice(0, 2000), String(body.card_no || "").slice(0, 20), Number(body.no)).run();
      return json({ ok: true });
    }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return fail(e); }
};
