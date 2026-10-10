// Clinic accounts.
//   GET  /clinic/api/finance?year=2026            income / expenses / outstanding by month + expenses by category + the expense list
//   POST /clinic/api/finance?action=expenses      {sheet:"2026-01", rows:[{src,category,day,iqd,usd,desc,receipt}]}  replaces that month's IMPORTED expenses
//   POST /clinic/api/finance?action=add           {category, day, iqd, usd, desc}   an expense typed in by hand (kept across imports)
//   POST /clinic/api/finance?action=del           {id}
// Income comes from the same `payments` rows that feed the patient cards, so one Excel upload updates cards and charts together.
import { Env, ensureSchema, json, patientKey, setSetting } from "../../../lib/clinic";

const num = (v: unknown) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const url = new URL(request.url);
    const q = (url.searchParams.get("names") || "").trim();
    if (q) {      // name suggestions for the quick-entry form
      const like = `%${q.slice(0, 40)}%`;
      const { results } = await env.DB.prepare(
        "SELECT coalesce(display_name, name, key) AS n FROM patients WHERE merged_into IS NULL AND (name LIKE ?1 OR display_name LIKE ?1 OR key LIKE ?1) ORDER BY visits DESC LIMIT 8",
      ).bind(like).all<{ n: string }>();
      return json({ ok: true, names: results.map((r) => r.n) });
    }
    const { results: yrs } = await env.DB.prepare(
      "SELECT DISTINCT substr(sheet,1,4) AS y FROM payments UNION SELECT DISTINCT substr(sheet,1,4) FROM other_income UNION SELECT DISTINCT substr(sheet,1,4) FROM expenses ORDER BY y DESC",
    ).all<{ y: string }>();
    const years = yrs.map((r) => r.y).filter(Boolean);
    const year = /^\d{4}$/.test(url.searchParams.get("year") || "") ? url.searchParams.get("year")! : years[0] || String(new Date().getFullYear());
    const like = year + "-%";
    const { results: inc } = await env.DB.prepare(
      `SELECT CAST(substr(sheet,6,2) AS INTEGER) AS m, count(*) AS n, coalesce(sum(paid_iqd),0) AS paid_iqd, coalesce(sum(paid_usd),0) AS paid_usd,
              coalesce(sum(due_iqd),0) AS due_iqd, coalesce(sum(due_usd),0) AS due_usd
       FROM payments WHERE sheet LIKE ? GROUP BY m`,
    ).bind(like).all<Record<string, number>>();
    const { results: oth } = await env.DB.prepare(
      `SELECT CAST(substr(sheet,6,2) AS INTEGER) AS m, coalesce(sum(amount_iqd),0) AS iqd, coalesce(sum(amount_usd),0) AS usd FROM other_income WHERE sheet LIKE ? GROUP BY m`,
    ).bind(like).all<{ m: number; iqd: number; usd: number }>();
    const { results: exp } = await env.DB.prepare(
      `SELECT CAST(substr(sheet,6,2) AS INTEGER) AS m, category, coalesce(sum(amount_iqd),0) AS iqd, coalesce(sum(amount_usd),0) AS usd
       FROM expenses WHERE sheet LIKE ? GROUP BY m, category`,
    ).bind(like).all<{ m: number; category: string; iqd: number; usd: number }>();
    const { results: list } = await env.DB.prepare(
      "SELECT id, sheet, category, day, amount_iqd, amount_usd, description, receipt, (src LIKE 'm:%') AS manual FROM expenses WHERE sheet LIKE ? ORDER BY day DESC, id DESC LIMIT 600",
    ).bind(like).all();
    const { results: pays } = await env.DB.prepare(
      "SELECT id, name, day, paid_iqd, paid_usd, due_iqd, due_usd, work FROM payments WHERE src LIKE 'm:%' ORDER BY id DESC LIMIT 25",
    ).all();
    const months = Array.from({ length: 12 }, (_, i) => {
      const a = inc.find((r) => r.m === i + 1);
      const e = exp.filter((r) => r.m === i + 1);
      const o = oth.find((r) => r.m === i + 1);
      return {
        oth_iqd: o?.iqd || 0, oth_usd: o?.usd || 0,
        m: i + 1, visits: a?.n || 0, inc_iqd: a?.paid_iqd || 0, inc_usd: a?.paid_usd || 0, due_iqd: a?.due_iqd || 0, due_usd: a?.due_usd || 0,
        exp_iqd: e.reduce((t, r) => t + r.iqd, 0), exp_usd: e.reduce((t, r) => t + r.usd, 0),
      };
    });
    const cats: Record<string, { iqd: number[]; usd: number[] }> = {};
    for (const r of exp) {
      const c = (cats[r.category] ||= { iqd: Array(12).fill(0), usd: Array(12).fill(0) });
      c.iqd[r.m - 1] += r.iqd; c.usd[r.m - 1] += r.usd;
    }
    return json({ ok: true, year, years, months, cats, expenses: list, pays });
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const action = new URL(request.url).searchParams.get("action");
    const body = (await request.json()) as Record<string, unknown>;
    if (action === "expenses") {
      const sheet = String(body.sheet || "");
      if (!/^\d{4}-\d{2}$/.test(sheet)) return json({ ok: false, error: "bad sheet" }, 400);
      const rows = ((body.rows as Record<string, unknown>[]) || []).slice(0, 300).map((r) => ({
        src: "x:" + String(r.src || "").slice(0, 70), category: String(r.category || "").trim().slice(0, 80), day: String(r.day || ""),
        iqd: num(r.iqd), usd: num(r.usd), desc: String(r.desc || "").slice(0, 300), receipt: String(r.receipt || "").slice(0, 60),
      })).filter((r) => r.category && /^\d{4}-\d{2}-\d{2}$/.test(r.day) && ((r.iqd || 0) !== 0 || (r.usd || 0) !== 0));
      const stmts = [env.DB.prepare("DELETE FROM expenses WHERE sheet = ? AND src LIKE 'x:%'").bind(sheet)];
      for (const r of rows) stmts.push(env.DB.prepare(
        "INSERT OR REPLACE INTO expenses (src, sheet, category, day, amount_iqd, amount_usd, description, receipt) VALUES (?,?,?,?,?,?,?,?)",
      ).bind(r.src, sheet, r.category, r.day, r.iqd, r.usd, r.desc, r.receipt));
      for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
      return json({ ok: true, sheet, saved: rows.length });
    }
    if (action === "other") {
      const sheet = String(body.sheet || "");
      if (!/^\d{4}-\d{2}$/.test(sheet)) return json({ ok: false, error: "bad sheet" }, 400);
      const rows = ((body.rows as Record<string, unknown>[]) || []).slice(0, 100).map((r) => ({
        src: String(r.src || "").slice(0, 70), label: String(r.label || "").slice(0, 120), iqd: num(r.iqd), usd: num(r.usd),
      })).filter((r) => r.src && ((r.iqd || 0) !== 0 || (r.usd || 0) !== 0));
      const stmts = [env.DB.prepare("DELETE FROM other_income WHERE sheet = ?").bind(sheet)];
      for (const r of rows) stmts.push(env.DB.prepare("INSERT OR REPLACE INTO other_income (src, sheet, label, day, amount_iqd, amount_usd) VALUES (?,?,?,?,?,?)")
        .bind(r.src, sheet, r.label, sheet + "-01", r.iqd, r.usd));
      for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100));
      return json({ ok: true, sheet, saved: rows.length });
    }
    if (action === "add") {
      const day = String(body.day || "");
      const category = String(body.category || "").trim().slice(0, 80);
      const iqd = num(body.iqd), usd = num(body.usd);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !category || ((iqd || 0) === 0 && (usd || 0) === 0)) return json({ ok: false, error: "أدخل التاريخ والنوع والمبلغ" }, 400);
      await env.DB.prepare("INSERT INTO expenses (src, sheet, category, day, amount_iqd, amount_usd, description, receipt) VALUES (?,?,?,?,?,?,?,?)")
        .bind("m:" + Date.now() + Math.random().toString(36).slice(2, 6), day.slice(0, 7), category, day, iqd, usd, String(body.desc || "").slice(0, 300), "").run();
      return json({ ok: true });
    }
    if (action === "pay") {
      const name = String(body.name || "").trim().slice(0, 120), day = String(body.day || "");
      const paidI = num(body.paid_iqd), paidU = num(body.paid_usd), dueI = num(body.due_iqd), dueU = num(body.due_usd);
      const key = patientKey(name);
      if (!name || key.startsWith("#") || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return json({ ok: false, error: "أدخل اسم المريض والتاريخ" }, 400);
      if (![paidI, paidU, dueI, dueU].some((v) => (v || 0) !== 0)) return json({ ok: false, error: "أدخل مبلغًا مدفوعًا أو متبقيًا" }, 400);
      const known = await env.DB.prepare("SELECT key FROM patients WHERE key = ?").bind(key).first();
      const stmts = [env.DB.prepare(
        `INSERT INTO payments (src, sheet, patient_key, name, day, paid_iqd, paid_usd, due_iqd, due_usd, work, notes, phone, matched) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind("m:" + Date.now() + Math.random().toString(36).slice(2, 6), day.slice(0, 7), key, name, day, paidI, paidU, dueI, dueU,
        String(body.work || "").slice(0, 300), String(body.notes || "").slice(0, 300), "", "manual")];
      if (!known) stmts.push(env.DB.prepare(
        "INSERT OR IGNORE INTO patients (key, no) SELECT ?1, (SELECT coalesce(max(no), 10000) + 1 FROM patients) WHERE NOT EXISTS (SELECT 1 FROM patients WHERE key = ?1)",
      ).bind(key));
      await env.DB.batch(stmts);
      if (!known) await setSetting(env, "stats_dirty", "1");
      return json({ ok: true, newCard: !known });
    }
    if (action === "paydel") {
      await env.DB.prepare("DELETE FROM payments WHERE id = ? AND src LIKE 'm:%'").bind(Number(body.id)).run();
      return json({ ok: true });
    }
    if (action === "del") {
      await env.DB.prepare("DELETE FROM expenses WHERE id = ?").bind(Number(body.id)).run();
      return json({ ok: true });
    }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};
