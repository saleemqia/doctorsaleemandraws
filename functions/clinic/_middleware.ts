// Guards everything under /clinic: only browsers holding a valid clinic key cookie get in.
// /clinic/login?k=KEY checks the key (only its SHA-256 hash is stored in D1), sets the cookie,
// and redirects to /clinic/ so the key does not stay in the address bar or history.
import { COOKIE, Env, cookieValue, keyValid } from "../../lib/clinic";

const PRIVATE = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

const denied = () => new Response(
  `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>صفحة خاصة</title>
<body style="font-family:system-ui,sans-serif;background:#f4f7fc;color:#13285C;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:16px">
<div><h1 style="font-size:22px">صفحة خاصة بالعيادة</h1><p>افتح رابط الدخول الخاص بك مرة واحدة على هذا الجهاز.</p>
<form action="/clinic/login" method="get" style="margin:18px auto;display:flex;gap:8px;max-width:420px">
<input name="k" type="password" required minlength="20" autocomplete="current-password" placeholder="أو الصق مفتاح الدخول هنا" style="flex:1;padding:10px;border:1px solid #cbd6ea;border-radius:10px;font:inherit;direction:ltr">
<button style="padding:10px 16px;border:0;border-radius:10px;background:#13285C;color:#fff;font:inherit">دخول</button></form>
<p><a href="/" style="color:#1F6FD1">العودة إلى الموقع</a></p></div></body></html>`,
  { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE } },
);

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const url = new URL(request.url);

  // One host only, so the login cookie is always sent (doctorsaleem.com → www.doctorsaleem.com).
  if (url.hostname === "doctorsaleem.com") {
    url.hostname = "www.doctorsaleem.com";
    return new Response(null, { status: 301, headers: { Location: url.toString(), ...PRIVATE } });
  }

  if (url.pathname === "/clinic/logout") {
    return new Response(null, { status: 302, headers: {
      Location: "/", "Set-Cookie": `${COOKIE}=; Path=/clinic; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, ...PRIVATE } });
  }

  if (url.pathname === "/clinic/login") {
    const k = url.searchParams.get("k") || "";
    if (!(await keyValid(env, k))) return denied();
    return new Response(null, { status: 302, headers: {
      Location: "/clinic/",
      "Set-Cookie": `${COOKIE}=${encodeURIComponent(k)}; Path=/clinic; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
      ...PRIVATE } });
  }

  // Browsers use the cookie; the clinic's Google Drive export script sends the key in a header.
  const key = cookieValue(request, COOKIE) || request.headers.get("X-Clinic-Key") || "";
  let ok = false;
  try { ok = await keyValid(env, key); } catch (e) {
    // Database unavailable (e.g. the free plan's daily read limit): say so plainly instead of a raw 500 page.
    const msg = /limit/i.test(String(e)) ? "قاعدة البيانات وصلت حدّها اليومي المجاني، وتعود تلقائيًا الساعة 3:00 فجرًا بتوقيت بغداد."
      : "قاعدة البيانات غير متاحة مؤقتًا، أعد المحاولة بعد قليل.";
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 503, headers: { "Content-Type": "application/json; charset=utf-8", ...PRIVATE } });
  }
  if (!ok) return denied();

  const res = await next();
  const out = new Response(res.body, res);
  for (const [h, v] of Object.entries(PRIVATE)) out.headers.set(h, v);
  return out;
};
