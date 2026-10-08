// Clinic accounts.
//   GET  /clinic/api/finance?year=2026            income / expenses / outstanding by month + expenses by category + the expense list
//   POST /clinic/api/finance?action=expenses      {sheet:"2026-01", rows:[{src,category,day,iqd,usd,desc,receipt}]}  replaces that month's IMPORTED expenses
//   POST /clinic/api/finance?action=add           {category, day, iqd, usd, desc}   an expense typed in by hand (kept across imports)
//   POST /clinic/api/finance?action=del           {id}
// Income comes from the same `payments` rows that feed the patient cards, so one Excel upload updates cards and charts together.
import { Env, ensureSchema, json } from "../../../lib/clinic";

const num = (v: unknown) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const url = new URL(request.url);
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
    return json({ ok: true, year, years, months, cats, expenses: list });
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
    if (action === "del") {
      await env.DB.prepare("DELETE FROM expenses WHERE id = ?").bind(Number(body.id)).run();
      return json({ ok: true });
    }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};
