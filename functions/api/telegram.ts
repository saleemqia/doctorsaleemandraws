import { Env, ensureSchema, json, setSetting, todayLocal } from "../../lib/clinic";
import { appendExpenseToSheet, deleteExpenseFromSheet } from "../../lib/google-sheets";

type BotEnv = Env & { TELEGRAM_FINANCE_SECRET?: string; TELEGRAM_PAIR_CODE?: string };
type Expense = { category: string; label: string; iqd: number; usd: number };
const CATEGORIES: Record<string, string> = {
  electricity: "فاتورة الكهرباء", salary: "الرواتب", office: "مشتريات عيادة الأسنان",
  lab: "المختبر السني", rent: "الإيجار", internet: "الإنترنت وبطاقات الهاتف", other: "مصروفات أخرى",
};
const validMonth = (s: unknown): s is string => typeof s === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(s);
const lastDay = (month: string) => new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10);
const authorized = (request: Request, env: BotEnv) => !!env.TELEGRAM_FINANCE_SECRET && env.TELEGRAM_FINANCE_SECRET.length >= 32 && request.headers.get("Authorization") === `Bearer ${env.TELEGRAM_FINANCE_SECRET}`;

export const onRequestGet: PagesFunction<BotEnv> = async ({ request, env }) => {
  if (!authorized(request, env) || new URL(request.url).searchParams.get("action") !== "summary") return json({ ok: false }, 404);
  try {
    await ensureSchema(env);
    const url = new URL(request.url), chatId = url.searchParams.get("chatId") || "";
    const owner = (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'telegram_owner_chat'").first<{ value: string }>())?.value || "";
    if (!owner || chatId !== owner) return json({ ok: false }, 404);
    const [payments, other, expenses] = await Promise.all([
      env.DB.prepare("SELECT sheet, coalesce(sum(paid_iqd),0) AS iqd, coalesce(sum(paid_usd),0) AS usd FROM payments GROUP BY sheet").all<{ sheet: string; iqd: number; usd: number }>(),
      env.DB.prepare("SELECT sheet, coalesce(sum(amount_iqd),0) AS iqd, coalesce(sum(amount_usd),0) AS usd FROM other_income GROUP BY sheet").all<{ sheet: string; iqd: number; usd: number }>(),
      env.DB.prepare("SELECT sheet, category, coalesce(sum(amount_iqd),0) AS iqd, coalesce(sum(amount_usd),0) AS usd FROM expenses GROUP BY sheet, category").all<{ sheet: string; category: string; iqd: number; usd: number }>(),
    ]);
    const months: Record<string, { inc_iqd: number; inc_usd: number; oth_iqd: number; oth_usd: number; exp_iqd: number; exp_usd: number; expenses: Array<{ category: string; iqd: number; usd: number }> }> = {};
    const ensure = (sheet: string) => months[sheet] ||= { inc_iqd: 0, inc_usd: 0, oth_iqd: 0, oth_usd: 0, exp_iqd: 0, exp_usd: 0, expenses: [] };
    for (const r of payments.results) if (validMonth(r.sheet)) { const m = ensure(r.sheet); m.inc_iqd += r.iqd; m.inc_usd += r.usd; }
    for (const r of other.results) if (validMonth(r.sheet)) { const m = ensure(r.sheet); m.oth_iqd += r.iqd; m.oth_usd += r.usd; }
    for (const r of expenses.results) if (validMonth(r.sheet)) { const m = ensure(r.sheet); m.exp_iqd += r.iqd; m.exp_usd += r.usd; m.expenses.push({ category: r.category, iqd: r.iqd, usd: r.usd }); }
    return json({ ok: true, months });
  } catch (error) { return json({ ok: false, error: String((error as Error)?.message || error) }, 500); }
};

export const onRequestPost: PagesFunction<BotEnv> = async ({ request, env }) => {
  if (!authorized(request, env)) return json({ ok: false }, 404);
  try {
    await ensureSchema(env);
    const action = new URL(request.url).searchParams.get("action"), body = await request.json() as Record<string, unknown>;
    const chatId = String(body.chatId || "");
    const owner = (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'telegram_owner_chat'").first<{ value: string }>())?.value || "";
    if (action === "pair") {
      if (owner && owner === chatId) return json({ ok: true, paired: true });
      if (owner || !env.TELEGRAM_PAIR_CODE || String(body.code || "") !== env.TELEGRAM_PAIR_CODE || !/^\d{5,20}$/.test(chatId)) return json({ ok: true, paired: false });
      await setSetting(env, "telegram_owner_chat", chatId);
      return json({ ok: true, paired: true });
    }
    if (action === "authorize") return json({ ok: true, authorized: !!owner && owner === chatId });
    if (action === "reminder") {
      const month = body.month;
      if (!validMonth(month) || todayLocal() !== lastDay(month) || !owner) return json({ ok: true, send: false });
      const sent = (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'telegram_reminder_month'").first<{ value: string }>())?.value || "";
      if (sent === month) return json({ ok: true, send: false });
      await setSetting(env, "telegram_reminder_month", month);
      const rows = await env.DB.prepare("SELECT category, coalesce(sum(amount_iqd),0) AS iqd, coalesce(sum(amount_usd),0) AS usd FROM expenses WHERE sheet = ? GROUP BY category").bind(month).all<Expense>();
      return json({ ok: true, send: true, chatId: owner, expenses: rows.results });
    }
    if (action === "expenses") {
      if (!owner || owner !== chatId) return json({ ok: false }, 404);
      const month = body.month, rows = Array.isArray(body.expenses) ? body.expenses as Expense[] : [];
      if (!validMonth(month) || rows.length !== 7) return json({ ok: false, error: "أرسل بنود المصروفات السبعة" }, 400);
      let sheetPending = !month.startsWith("2026-");
      for (const row of rows) {
        const label = CATEGORIES[row.category], iqd = Number(row.iqd), usd = Number(row.usd);
        if (!label || row.label !== label || !Number.isFinite(iqd) || !Number.isFinite(usd) || iqd < 0 || usd < 0 || iqd > 1e12 || usd > 1e9) return json({ ok: false, error: "بيانات المصروفات غير صحيحة" }, 400);
      }
      for (const row of rows) {
        const src = `tg:${month}:${row.category}`, day = lastDay(month);
        const previous = await env.DB.prepare("SELECT id FROM expenses WHERE src = ?").bind(src).first<{ id: number }>();
        if (row.iqd === 0 && row.usd === 0) {
          await env.DB.prepare("DELETE FROM expenses WHERE src = ?").bind(src).run();
          if (previous && !sheetPending) try { await deleteExpenseFromSheet(env, day, src); } catch { sheetPending = true; }
          continue;
        }
        await env.DB.prepare("INSERT INTO expenses (src, sheet, category, day, amount_iqd, amount_usd, description, receipt) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(src) DO UPDATE SET sheet=excluded.sheet, category=excluded.category, day=excluded.day, amount_iqd=excluded.amount_iqd, amount_usd=excluded.amount_usd, description=excluded.description")
          .bind(src, month, row.label, day, row.iqd, row.usd, "إدخال شهري عبر بوت العيادة", "").run();
        if (!sheetPending) try { await appendExpenseToSheet(env, { src, category: row.label, day, iqd: row.iqd, usd: row.usd, desc: "إدخال شهري عبر بوت العيادة" }); }
        catch { sheetPending = true; }
      }
      return json({ ok: true, sheetPending, message: sheetPending ? "راجع إعداد ملف السنة أو اتصال Google Sheets." : "تم تحديث ملف 2026." });
    }
    return json({ ok: false }, 404);
  } catch (error) { return json({ ok: false, error: String((error as Error)?.message || error) }, 500); }
};
