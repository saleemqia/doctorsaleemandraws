export interface Env {
  BOT_TOKEN: string;
  BOT_WEBHOOK_SECRET: string;
  OWNER_PAIR_CODE: string;
  CLINIC_API_SECRET: string;
  CLINIC_API: string;
}

type TelegramUpdate = {
  message?: { chat?: { id?: number; type?: string }; text?: string };
};

const categories = [
  ["electricity", "فاتورة الكهرباء"],
  ["salary", "الرواتب"],
  ["office", "مشتريات عيادة الأسنان"],
  ["lab", "المختبر السني"],
  ["rent", "الإيجار"],
  ["internet", "الإنترنت وبطاقات الهاتف"],
  ["other", "مصروفات أخرى"],
] as const;

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});

function monthNow() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baghdad", year: "numeric", month: "2-digit" }).format(new Date());
}

function lastDayInBaghdad() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Baghdad", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date()).reduce<Record<string, string>>((out, p) => (out[p.type] = p.value, out), {});
  const day = Number(parts.day), last = new Date(Date.UTC(Number(parts.year), Number(parts.month), 0)).getUTCDate();
  return day === last ? `${parts.year}-${parts.month}` : null;
}

function formatAmount(n: number, suffix: string) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)} ${suffix}`;
}

async function api(env: Env, action: string, method = "GET", payload?: unknown, chatId?: number) {
  const url = new URL(env.CLINIC_API);
  url.searchParams.set("action", action);
  if (chatId) url.searchParams.set("chatId", String(chatId));
  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${env.CLINIC_API_SECRET}`, ...(payload ? { "Content-Type": "application/json" } : {}) },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await response.json() as Record<string, any>;
  if (!response.ok || data.ok === false) throw new Error(String(data.error || `Clinic API ${response.status}`));
  return data;
}

async function telegram(env: Env, method: string, payload: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  const data = await response.json() as { ok?: boolean; description?: string };
  if (!response.ok || !data.ok) throw new Error(data.description || `Telegram API ${response.status}`);
}

async function send(env: Env, chatId: number, text: string) {
  await telegram(env, "sendMessage", { chat_id: chatId, text, disable_web_page_preview: true });
}

function parseAmount(text: string): { iqd: number; usd: number } | null {
  const parts = text.trim().split(/[\/،,]/).map((x) => x.trim());
  if (parts.length !== 2) return null;
  const number = (s: string) => {
    if (/^(0|none|no|لا|صفر|—|-|)$/i.test(s)) return 0;
    const clean = s.replace(/[٬,]/g, "").replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))).replace(/[^\d.]/g, "");
    if (!clean || (clean.match(/\./g) || []).length > 1) return NaN;
    return Number(clean);
  };
  const iqd = number(parts[0]), usd = number(parts[1]);
  return Number.isFinite(iqd) && Number.isFinite(usd) ? { iqd, usd } : null;
}

function form(month: string, recorded: Array<{ category: string; iqd: number; usd: number }> = []) {
  const existing = new Map(recorded.map((r) => [r.category, r]));
  const lines = categories.map(([key, label]) => {
    const prior = existing.get(key);
    const recordedText = prior ? ` (المسجل حاليًا: ${formatAmount(prior.iqd || 0, "د.ع")} / ${formatAmount(prior.usd || 0, "$")})` : "";
    return `${label}: [دينار] / [دولار]${recordedText}`;
  });
  return `إغلاق مصاريف العيادة\nالشهر: ${month}\nاكتب المبلغ بالدينار / الدولار لكل بند. أدخل 0 أو «لا» عند عدم وجود مبلغ. اكتب فقط المبالغ التي لم تُسجّل سابقًا في الموقع أو ملف الإكسل لتجنب التكرار.\n\n${lines.join("\n")}\n\nأرسل البنود السبعة في رسالة واحدة. لإلغاء اكتب /cancel.`;
}

async function report(env: Env, chatId: number, month: string) {
  const s = await api(env, "summary", "GET", undefined, chatId);
  const data = s.months?.[month];
  if (!data) return send(env, chatId, `لا توجد بيانات مالية للشهر ${month} حتى الآن.`);
  const totalExpenseIQD = Number(data.exp_iqd || 0), totalExpenseUSD = Number(data.exp_usd || 0);
  const netIQD = Number(data.inc_iqd || 0) + Number(data.oth_iqd || 0) - totalExpenseIQD;
  const netUSD = Number(data.inc_usd || 0) + Number(data.oth_usd || 0) - totalExpenseUSD;
  const lines = categories.map(([, label]) => {
    const row = (data.expenses || []).find((x: any) => x.category === label);
    return `${label}: ${formatAmount(Number(row?.iqd || 0), "د.ع")} / ${formatAmount(Number(row?.usd || 0), "$")}`;
  });
  return send(env, chatId, `ملخص ${month}\n\n${lines.join("\n")}\n\nالإيراد: ${formatAmount(Number(data.inc_iqd || 0) + Number(data.oth_iqd || 0), "د.ع")} / ${formatAmount(Number(data.inc_usd || 0) + Number(data.oth_usd || 0), "$")}\nالمصاريف: ${formatAmount(totalExpenseIQD, "د.ع")} / ${formatAmount(totalExpenseUSD, "$")}\nالصافي: ${formatAmount(netIQD, "د.ع")} / ${formatAmount(netUSD, "$")}\n\nلا يوجد تحويل بين العملتين.`);
}

async function handleUpdate(env: Env, update: TelegramUpdate) {
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = (message?.text || "").trim();
  if (!chatId || message?.chat?.type !== "private" || !text) return;

  if (text.startsWith("/start")) {
    const code = text.split(/\s+/, 2)[1] || "";
    const pair = await api(env, "pair", "POST", { chatId, code });
    if (!pair.paired) return send(env, chatId, "هذا البوت خاص بمالك العيادة. استخدم رابط الربط الخاص الذي أُعدّ لحسابك.");
    return send(env, chatId, `أهلًا دكتور سليم. أذكّرك في آخر يوم من كل شهر عند الساعة 7 مساءً بتوقيت دهوك.\n\nالأوامر:\n/close [YYYY-MM] إدخال مصاريف الشهر\n/summary [YYYY-MM] مراجعة الإيرادات والمصاريف والصافي\n/help عرض المساعدة\n\nتُحفظ المصاريف في حسابات العيادة وتُزامن إلى ملف 2026 عند توفر تكامل Sheets.`);
  }

  const owner = await api(env, "authorize", "POST", { chatId });
  if (!owner.authorized) return;
  if (/^\/(help|start)\b/.test(text)) return send(env, chatId, "استخدم /close لإدخال المصاريف أو /summary لمراجعة صافي الشهر. يمكنك كتابة /close 2026-10 لإدخال شهر محدد.");
  if (/^\/cancel\b/.test(text)) return send(env, chatId, "تم إلغاء إدخال هذا الشهر. لم تُحفظ أي تغييرات.");
  const cmd = text.match(/^\/(close|summary)(?:@\w+)?(?:\s+(\d{4}-\d{2}))?$/);
  if (cmd) {
    const month = cmd[2] || monthNow();
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return send(env, chatId, "اكتب الشهر بصيغة YYYY-MM مثل /close 2026-10.");
    if (cmd[1] === "summary") return report(env, chatId, month);
    const data = await api(env, "summary", "GET", undefined, chatId);
    return send(env, chatId, form(month, data.months?.[month]?.expenses || []));
  }

  const submitted = new Map<string, { iqd: number; usd: number }>();
  const monthLine = text.match(/(?:^|\n)\s*الشهر\s*[:：]\s*(\d{4}-(?:0[1-9]|1[0-2]))\s*(?:\n|$)/);
  const month = monthLine?.[1] || monthNow();
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(":");
    if (parts.length < 2) continue;
    const category = categories.find(([key, label]) => key === parts[0].trim() || label === parts[0].trim());
    if (!category) continue;
    const amount = parseAmount(parts.slice(1).join(":").replace(/\s*\([^)]*\)\s*$/, ""));
    if (!amount) return send(env, chatId, `لم أفهم مبلغ ${category[1]}. اكتب المبالغ بهذا الشكل: 150000 / 25 أو 0 / 0.`);
    submitted.set(category[0], amount);
  }
  if (submitted.size !== categories.length) return send(env, chatId, `لم أجد البنود السبعة. أرسل /close ${month} للحصول على النموذج، وأرسل كل البنود في رسالة واحدة.`);

  const result = await api(env, "expenses", "POST", {
    chatId,
    month,
    expenses: categories.map(([category, label]) => ({ category, label, ...submitted.get(category)! })),
  });
  await send(env, chatId, result.sheetPending
    ? `تم حفظ مصاريف ${month} في حسابات العيادة. تعذر تحديث Google Sheets آليًا لهذه السنة؛ ستظهر البيانات في تصدير Excel من الموقع.\n\n${result.message || ""}`
    : `تم حفظ مصاريف ${month} وتحديث السجل المتصل. راجع النتيجة باستخدام /summary ${month}.`);
  return report(env, chatId, month);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ ok: true, bot: "Dr Saleem Clinic Finance" });
    if (url.pathname !== "/webhook" || request.method !== "POST") return json({ error: "not found" }, 404);
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.BOT_WEBHOOK_SECRET) return json({ error: "unauthorized" }, 401);
    try { await handleUpdate(env, await request.json() as TelegramUpdate); return json({ ok: true }); }
    catch (error) { return json({ ok: false, error: String((error as Error)?.message || error) }, 500); }
  },
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const month = lastDayInBaghdad();
    if (!month) return;
    const claim = await api(env, "reminder", "POST", { month });
    if (!claim.send || !claim.chatId) return;
    ctx.waitUntil(send(env, Number(claim.chatId), `${form(month, claim.expenses || [])}\n\nأرسل /summary ${month} لمراجعة الصافي بعد الإدخال.`));
  },
};

