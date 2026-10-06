// Patient cards built from the calendar: every visit is grouped by a normalised name (lib/clinic.ts patientKey).
// GET  /clinic/api/patients?q=&offset=     → patient list (newest visit first), search by name or phone
// GET  /clinic/api/patients?no=10023       → one card: patient + all visits
// POST /clinic/api/patients?action=rebuild → fills patient_key for rows that lack it (≤1500 per call; repeat until done=0)
// POST /clinic/api/patients?action=merge   {from, to}  → visits of patient `from` show on card `to`
// POST /clinic/api/patients?action=note    {no, notes, card_no}
import { Env, json, patientKey } from "../../../lib/clinic";

const GROUP = "coalesce(p.merged_into, a.patient_key)";

async function assignNumbers(env: Env) {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO patients (key, no)
     SELECT k, (SELECT coalesce(max(no), 10000) FROM patients) + row_number() OVER (ORDER BY first, k) FROM (
       SELECT patient_key AS k, min(start) AS first FROM appointments
       WHERE removed = 0 AND patient_key IS NOT NULL AND patient_key NOT LIKE '#%'
         AND patient_key NOT IN (SELECT key FROM patients) GROUP BY patient_key)`,
  ).run();
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const u = new URL(request.url);
  const pending = await env.DB.prepare("SELECT count(*) AS n FROM appointments WHERE patient_key IS NULL").first<{ n: number }>();
  await assignNumbers(env);
  const no = parseInt(u.searchParams.get("no") || "");
  if (no) {
    const p = await env.DB.prepare("SELECT key, no, notes, card_no, merged_into FROM patients WHERE no = ?").bind(no).first<Record<string, string>>();
    if (!p) return json({ error: "not found" }, 404);
    const main = p.merged_into || p.key;
    const card = main === p.key ? p : await env.DB.prepare("SELECT key, no, notes, card_no FROM patients WHERE key = ?").bind(main).first<Record<string, string>>();
    const { results: visits } = await env.DB.prepare(
      `SELECT a.day, a.start, a.end, a.title, a.phone, a.treatment, a.description, a.all_day AS allDay FROM appointments a
       LEFT JOIN patients p ON p.key = a.patient_key
       WHERE a.removed = 0 AND ${GROUP} = ? ORDER BY a.start`,
    ).bind(main).all<Record<string, string>>();
    const { results: alsoKeys } = await env.DB.prepare("SELECT no, key FROM patients WHERE merged_into = ?").bind(main).all();
    const count: Record<string, number> = {};
    for (const v of visits) count[v.title.trim()] = (count[v.title.trim()] || 0) + 1;
    const name = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || main;
    const phones = [...new Set(visits.map((v) => v.phone).filter(Boolean))];
    return json({ patient: { ...card, name, phones, merged: alsoKeys }, visits });
  }

  const q = (u.searchParams.get("q") || "").trim().slice(0, 60);
  const offset = Math.max(0, parseInt(u.searchParams.get("offset") || "0") || 0);
  const digits = q.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))).replace(/\D/g, "");
  const nq = q ? patientKey(q).replace(/^#/, "") : "";
  const { results } = await env.DB.prepare(
    `SELECT m.no, m.key, count(*) AS visits, min(a.day) AS first, max(a.day) AS last,
       max(a.title) AS name, group_concat(DISTINCT nullif(a.phone, '')) AS phones
     FROM appointments a
     JOIN patients p ON p.key = a.patient_key
     JOIN patients m ON m.key = coalesce(p.merged_into, p.key)
     WHERE a.removed = 0
     GROUP BY m.key
     HAVING (?1 = '' OR m.key LIKE '%' || ?1 || '%' OR (?2 <> '' AND phones LIKE '%' || ?2 || '%') OR CAST(m.no AS TEXT) = ?3)
     ORDER BY last DESC, m.no DESC LIMIT 100 OFFSET ?4`,
  ).bind(nq, digits.length >= 4 ? digits : "", q, offset).all();
  const total = await env.DB.prepare("SELECT count(*) AS n FROM patients WHERE merged_into IS NULL").first<{ n: number }>();
  return json({ q, total: total?.n || 0, pending: pending?.n || 0, patients: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get("action");
  if (action === "rebuild") {
    const { results } = await env.DB.prepare("SELECT uid, title FROM appointments WHERE patient_key IS NULL LIMIT 1500").all<{ uid: string; title: string }>();
    const stmts = results.map((r) => env.DB.prepare("UPDATE appointments SET patient_key = ? WHERE uid = ?").bind(patientKey(r.title || ""), r.uid));
    for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
    const left = await env.DB.prepare("SELECT count(*) AS n FROM appointments WHERE patient_key IS NULL").first<{ n: number }>();
    if (!left?.n) await assignNumbers(env);
    return json({ ok: true, done: results.length, left: left?.n || 0 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (action === "merge") {
    const from = await env.DB.prepare("SELECT key FROM patients WHERE no = ?").bind(Number(body.from)).first<{ key: string }>();
    const to = await env.DB.prepare("SELECT key, merged_into FROM patients WHERE no = ?").bind(Number(body.to)).first<{ key: string; merged_into: string }>();
    if (!from || !to || from.key === to.key) return json({ ok: false, error: "bad numbers" }, 400);
    const target = to.merged_into || to.key;
    await env.DB.batch([
      env.DB.prepare("UPDATE patients SET merged_into = ? WHERE key = ? OR merged_into = ?").bind(target, from.key, from.key),
    ]);
    return json({ ok: true });
  }
  if (action === "unmerge") {
    await env.DB.prepare("UPDATE patients SET merged_into = NULL WHERE no = ?").bind(Number(body.no)).run();
    return json({ ok: true });
  }
  if (action === "note") {
    await env.DB.prepare("UPDATE patients SET notes = ?, card_no = ? WHERE no = ?")
      .bind(String(body.notes || "").slice(0, 2000), String(body.card_no || "").slice(0, 20), Number(body.no)).run();
    return json({ ok: true });
  }
  return json({ ok: false, error: "unknown action" }, 400);
};
