// Guards everything under /clinic: only browsers holding a valid clinic key cookie get in.
// /clinic/login?k=KEY checks the key (only its SHA-256 hash is stored in D1), sets the cookie,
// and redirects to /clinic/ so the key does not stay in the address bar or history.
import { COOKIE, Env, cookieValue, keyValid, needsPatientPin, needsPin, patientPinHash, patientPinUnlocked, pinUnlocked, sha256 } from "../../lib/clinic";
import { GOOGLE_CLIENT_ID, newSession, sessionCookie, verifyGoogle } from "../../lib/googleLogin";

const PRIVATE = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

const denied = () => new Response(
  `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>صفحة خاصة</title>
<body style="font-family:system-ui,sans-serif;background:#f4f7fc;color:#13285C;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:16px">
<div><h1 style="font-size:22px">صفحة خاصة بالعيادة</h1><p>سجّل الدخول بحساب Google المسموح له، أو افتح رابط الدخول الخاص بك.</p>
<script src="https://accounts.google.com/gsi/client" async></script>
<div id="g_id_onload" data-client_id="${GOOGLE_CLIENT_ID}" data-callback="gLogin" data-auto_prompt="false" data-ux_mode="popup"></div>
<div style="display:flex;justify-content:center;margin:18px 0 6px"><div class="g_id_signin" data-type="standard" data-shape="pill" data-theme="filled_blue" data-text="signin_with" data-size="large" data-locale="ar" data-logo_alignment="left"></div></div>
<p id="gMsg" style="color:#C2413A;font-size:14px;min-height:1em"></p>
<script>function gLogin(r){var m=document.getElementById("gMsg");m.style.color="#5B6B8C";m.textContent="جارٍ التحقق…";
fetch("/clinic/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({credential:r.credential})}).then(function(x){return x.json()}).then(function(d){if(d.ok){location.href="/clinic/"}else{m.style.color="#C2413A";m.textContent=d.error||"تعذّر الدخول"}}).catch(function(){m.style.color="#C2413A";m.textContent="تعذّر الاتصال"})}</script>
<p style="color:#5B6B8C;font-size:13px;margin:4px 0 0">أو بمفتاح الدخول:</p>
<form action="/clinic/login" method="get" style="margin:18px auto;display:flex;gap:8px;max-width:420px">
<input name="k" type="password" required minlength="20" autocomplete="current-password" placeholder="أو الصق مفتاح الدخول هنا" style="flex:1;padding:10px;border:1px solid #cbd6ea;border-radius:10px;font:inherit;direction:ltr">
<button style="padding:10px 16px;border:0;border-radius:10px;background:#13285C;color:#fff;font:inherit">دخول</button></form>
<p><a href="/" style="color:#1F6FD1">العودة إلى الموقع</a></p></div></body></html>`,
  { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE } },
);

const patientGate = (configured: boolean, canSetup: boolean) => new Response(
  `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#13285C">
<title>دخول بطاقات المرضى</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:18px;background:linear-gradient(145deg,#eef5fd,#f8fbff);font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;color:#13285C}
.card{width:min(430px,100%);background:#fff;border:1px solid #dce6f4;border-radius:22px;padding:26px;box-shadow:0 18px 50px #13285c20;text-align:center}
.icon{width:62px;height:62px;display:grid;place-items:center;margin:0 auto 12px;border-radius:18px;background:#e7f1fd;font-size:30px}
h1{font-size:22px;margin:5px 0 8px}p{color:#5b6b8c;line-height:1.7;margin:0 0 18px}
input{width:100%;padding:13px 14px;border:1px solid #cbd8ea;border-radius:12px;font:inherit;font-size:18px;text-align:center;direction:ltr;letter-spacing:3px}
button{width:100%;margin-top:10px;padding:12px;border:0;border-radius:12px;background:#13285C;color:#fff;font:inherit;font-weight:800;cursor:pointer}
button:disabled{opacity:.6}.msg{min-height:24px;margin-top:12px;font-size:14px}.back{display:inline-block;margin-top:10px;color:#1f6fd1;text-decoration:none;font-size:14px}
</style></head><body><main class="card"><div class="icon">🔒</div><h1>بطاقات المرضى محمية</h1>
<p>${configured ? "أدخل كلمة مرور بطاقات المرضى. لن تظهر الأسماء أو البطاقات قبل نجاح الدخول." : canSetup ? "ضبط كلمة مرور بطاقات المرضى الآن. ستُحفظ مشفّرة ولن تظهر في GitHub." : "لم تُضبط كلمة مرور بطاقات المرضى بعد. افتح قفل المالك لإكمال الإعداد."}</p>
<form id="patientGateForm"><input id="patientPassword" name="password" type="password" inputmode="numeric" pattern="[0-9]{4,12}" minlength="4" maxlength="12" autocomplete="${configured ? "current-password" : "new-password"}" required ${configured || canSetup ? "" : "disabled"} aria-label="كلمة مرور بطاقات المرضى"><button id="patientGateButton" ${configured || canSetup ? "" : "disabled"}>${configured ? "فتح بطاقات المرضى" : "ضبط كلمة المرور وفتح الصفحة"}</button></form>
<div class="msg" id="patientGateMessage"></div><a class="back" href="/clinic/">العودة إلى أقسام العيادة</a>
<script>
var f=document.getElementById("patientGateForm"),m=document.getElementById("patientGateMessage"),b=document.getElementById("patientGateButton");
f.addEventListener("submit",async function(e){e.preventDefault();b.disabled=true;m.style.color="#5B6B8C";m.textContent="جارٍ التحقق…";
try{var r=await fetch("/clinic/api/patient-pin${configured ? "" : "?action=setup"}",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:document.getElementById("patientPassword").value})});var d=await r.json();
if(d.ok){m.style.color="#1E9E5A";m.textContent="${configured ? "كلمة المرور صحيحة ✓ جارٍ فتح بطاقات المرضى…" : "تم ضبط كلمة المرور بنجاح ✓ جارٍ فتح بطاقات المرضى…"}";setTimeout(function(){location.reload()},500)}
else{m.style.color="#C2413A";m.textContent=d.error||"تعذّر الدخول";b.disabled=false;document.getElementById("patientPassword").value="";document.getElementById("patientPassword").focus()}}
catch(_){m.style.color="#C2413A";m.textContent="تعذّر الاتصال";b.disabled=false}});
</script></main></body></html>`,
  { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE } },
);

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const url = new URL(request.url);

  // One host only, so the login cookie is always sent (doctorsaleem.com → www.doctorsaleem.com).
  if (url.hostname === "doctorsaleem.com") {
    url.hostname = "www.doctorsaleem.com";
    return new Response(null, { status: 301, headers: { Location: url.toString(), ...PRIVATE } });
  }

  // Sign in with Google: the page sends Google's ID token; we check it and the allowed-email list, then give a session cookie.
  if (url.pathname === "/clinic/google" && request.method === "POST") {
    const j = (o: unknown, st = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(o), { status: st, headers: { "Content-Type": "application/json; charset=utf-8", ...PRIVATE, ...extra } });
    if (request.headers.get("Origin") !== url.origin) return j({ ok: false, error: "طلب غير مسموح" }, 403);
    const body = await request.json<{ credential?: string }>().catch(() => ({} as { credential?: string }));
    const v = await verifyGoogle(env, body.credential || "");
    if (!v.email) { await new Promise((r) => setTimeout(r, 800)); return j({ ok: false, error: v.error }, 403); }
    return j({ ok: true, email: v.email }, 200, { "Set-Cookie": sessionCookie(await newSession(env, v.email)) });
  }

  if (url.pathname === "/clinic/logout") {
    // A Google session is removed from the database too, so the cookie cannot be reused.
    const k = cookieValue(request, COOKIE);
    if (k) await env.DB.prepare("DELETE FROM clinic_keys WHERE hash = ? AND label LIKE 'google:%'").bind(await sha256(k)).run().catch(() => {});
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

  // Patient cards have their own lock. The page itself is replaced by the gate, so no patient UI is sent before unlock.
  const cleanPath = url.pathname.replace(/\/+$/, "");
  const patientPage = cleanPath === "/clinic" && url.searchParams.get("view") === "patients";
  if (patientPage && !(await patientPinUnlocked(env, request))) {
    const configured = !!(await patientPinHash(env));
    const canSetup = !configured && await pinUnlocked(env, request);
    return patientGate(configured, canSetup);
  }
  if (needsPatientPin(url) && !(await patientPinUnlocked(env, request))) {
    return new Response(JSON.stringify({ ok: false, patientPin: true, error: "بطاقات المرضى محمية بكلمة مرور" }), {
      status: 403, headers: { "Content-Type": "application/json; charset=utf-8", ...PRIVATE },
    });
  }

  // Accounts and spreadsheet tools also need the owner's PIN (see lib/clinic.ts needsPin).
  if (needsPin(url, request.method) && !(await pinUnlocked(env, request))) {
    return new Response(JSON.stringify({ ok: false, pin: true, error: "هذا القسم محمي برقم سري" }), { status: 403, headers: { "Content-Type": "application/json; charset=utf-8", ...PRIVATE } });
  }

  const res = await next();
  const out = new Response(res.body, res);
  for (const [h, v] of Object.entries(PRIVATE)) out.headers.set(h, v);
  return out;
};
