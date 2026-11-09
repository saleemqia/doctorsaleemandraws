import {
  Env,
  PATIENT_PIN_COOKIE,
  PATIENT_PIN_HOURS,
  patientPinCheck,
  patientPinHash,
  patientPinToken,
  pinUnlocked,
  setPatientPin,
} from "../../../lib/clinic";

const PRIVATE = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const json = (data: unknown, status = 200, cookie?: string) => new Response(JSON.stringify(data), {
  status,
  headers: { ...PRIVATE, ...(cookie ? { "Set-Cookie": cookie } : {}) },
});
const cookie = (value: string, age: number) =>
  `${PATIENT_PIN_COOKIE}=${value}; Path=/clinic; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const configured = !!(await patientPinHash(env));
  const token = request.headers.get("Cookie") || "";
  return json({ ok: true, configured, unlocked: configured && token.includes(PATIENT_PIN_COOKIE + "=") });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get("action") || "unlock";
  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return json({ ok: false, error: "طلب غير مسموح" }, 403);
  }
  if (action === "lock") return json({ ok: true }, 200, cookie("", 0));

  const body = await request.json<{ password?: unknown }>().catch(() => ({} as { password?: unknown }));
  const password = String(body.password ?? "").trim();

  if (action === "setup") {
    if (!(await pinUnlocked(env, request))) return json({ ok: false, ownerPin: true, error: "افتح قفل المالك أولاً" }, 403);
    if (!(await setPatientPin(env, password))) return json({ ok: false, error: "استخدم 4 إلى 12 رقمًا" }, 400);
    const stored = await patientPinHash(env);
    return json({ ok: true, configured: true }, 200, cookie(await patientPinToken(stored), PATIENT_PIN_HOURS * 3600));
  }

  if (!(await patientPinHash(env))) return json({ ok: false, setup: true, error: "لم تُضبط كلمة مرور بطاقات المرضى بعد" }, 503);
  const token = await patientPinCheck(env, password);
  if (!token) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return json({ ok: false, error: "كلمة المرور غير صحيحة" }, 403);
  }
  return json({ ok: true, configured: true }, 200, cookie(token, PATIENT_PIN_HOURS * 3600));
};
