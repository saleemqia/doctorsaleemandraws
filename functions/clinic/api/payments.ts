// POST /clinic/api/payments  {sheet: "2026-01", rows: [{src, name, day, paid_iqd, paid_usd, due_iqd, due_usd, work, notes, phone}]}
// Replaces one month of the owner's accounts workbook (parsed in the browser) and links every row to a patient card:
//   1. same normalised name as a card, 2. same name ignoring spaces, 3. a calendar visit that day with a nearly
//   identical name (sameName). Otherwise the row gets a new card. Re-uploading a month replaces it, never duplicates.
import { Env, ensureSchema, json, patientKey, sameName, setSetting } from "../../../lib/clinic";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const body = (await request.json()) as { sheet?: string; rows?: Record<string, unknown>[] };
    const sheet = String(body.sheet || "");
    if (!/^\d{4}-\d{2}$/.test(sheet)) return json({ ok: false, error: "bad sheet" }, 400);
    const num = (v: unknown) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
    const rows = (body.rows || []).slice(0, 600).map((r) => ({
      src: String(r.src || "").slice(0, 80), name: String(r.name || "").trim().slice(0, 120), day: String(r.day || ""),
      paid_iqd: num(r.paid_iqd), paid_usd: num(r.paid_usd), due_iqd: num(r.due_iqd), due_usd: num(r.due_usd),
      work: String(r.work || "").slice(0, 300), notes: String(r.notes || "").slice(0, 300), phone: String(r.phone || "").slice(0, 20),
    })).filter((r) => r.name && /^\d{4}-\d{2}-\d{2}$/.test(r.day) && !patientKey(r.name).startsWith("#"));

    // Candidate cards: exact keys, then keys of people who had a calendar visit on the same days.
    const keys = [...new Set(rows.map((r) => patientKey(r.name)))];
    const { results: known } = await env.DB.prepare("SELECT key FROM patients WHERE key IN (SELECT value FROM json_each(?))").bind(JSON.stringify(keys)).all<{ key: string }>();
    const have = new Set(known.map((k) => k.key));
    const days = [...new Set(rows.map((r) => r.day))];
    const { results: dayKeys } = await env.DB.prepare(
      "SELECT DISTINCT day, patient_key AS k FROM appointments WHERE day IN (SELECT value FROM json_each(?)) AND patient_key IS NOT NULL",
    ).bind(JSON.stringify(days)).all<{ day: string; k: string }>();
    const onDay = new Map<string, string[]>();
    for (const d of dayKeys) { if (!onDay.has(d.day)) onDay.set(d.day, []); onDay.get(d.day)!.push(d.k); }
    const flat = (s: string) => s.replace(/\s+/g, "");

    let exact = 0, near = 0, fresh = 0;
    const out = rows.map((r) => {
      let k = patientKey(r.name), how = "exact";
      if (!have.has(k)) {
        const same = (onDay.get(r.day) || []).filter((c) => flat(c) === flat(k) || sameName(c, k));
        if (same.length === 1) { k = same[0]; how = "visit"; } else how = "new";
      }
      if (how === "exact") exact++; else if (how === "visit") near++; else fresh++;
      return { ...r, k, how };
    });

    const stmts = [env.DB.prepare("DELETE FROM payments WHERE sheet = ? AND src NOT LIKE 'm:%'").bind(sheet)];
    for (const r of out) stmts.push(env.DB.prepare(
      `INSERT OR REPLACE INTO payments (src, sheet, patient_key, name, day, paid_iqd, paid_usd, due_iqd, due_usd, work, notes, phone, matched)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(r.src, sheet, r.k, r.name, r.day, r.paid_iqd, r.paid_usd, r.due_iqd, r.due_usd, r.work, r.notes, r.phone, r.how));
    for (const k of new Set(out.filter((r) => r.how === "new").map((r) => r.k))) stmts.push(env.DB.prepare(
      "INSERT OR IGNORE INTO patients (key, no) SELECT ?1, (SELECT coalesce(max(no), 10000) + 1 FROM patients) WHERE NOT EXISTS (SELECT 1 FROM patients WHERE key = ?1)",
    ).bind(k));
    for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
    if (fresh) await setSetting(env, "stats_dirty", "1");
    return json({ ok: true, sheet, saved: out.length, exact, near, fresh, skipped: (body.rows || []).length - out.length });
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};
