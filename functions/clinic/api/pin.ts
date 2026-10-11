// The owner's PIN for accounts, statistics and patient cards (auth by the /clinic middleware first).
//   GET  /clinic/api/pin                → {ok, unlocked}
//   POST /clinic/api/pin {pin}          → unlocks for PIN_MINUTES (cookie), or {ok:false}
//   POST /clinic/api/pin?action=lock    → locks again now
import { Env, PIN_COOKIE, PIN_MINUTES, pinCheck, pinUnlocked } from "../../../lib/clinic";

const json = (o: unknown, status = 200, cookie?: string) => new Response(JSON.stringify(o), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...(cookie ? { "Set-Cookie": cookie } : {}) },
});
const cookie = (v: string, age: number) => `${PIN_COOKIE}=${v}; Path=/clinic; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => json({ ok: true, unlocked: await pinUnlocked(env, request) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (new URL(request.url).searchParams.get("action") === "lock") return json({ ok: true }, 200, cookie("", 0));
  let pin = "";
  try { pin = String(((await request.json()) as { pin?: unknown }).pin ?? "").trim(); } catch { /* empty */ }
  const token = await pinCheck(env, pin);
  if (!token) { await new Promise((r) => setTimeout(r, 1200)); return json({ ok: false, error: "الرقم السري غير صحيح" }, 403); }
  return json({ ok: true, minutes: PIN_MINUTES }, 200, cookie(token, PIN_MINUTES * 60));
};
