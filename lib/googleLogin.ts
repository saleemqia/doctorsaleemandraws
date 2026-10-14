// "Sign in with Google" for /clinic (owner and staff). Google checks the person; we check the email is on the allowed list.
// Only the public client ID is used here (no secret): the browser gets an ID token from Google, the server verifies it.
// A successful sign-in creates a normal clinic session key (random), stored as its SHA-256 in clinic_keys with label "google:<email>".
import { COOKIE, Env, sha256 } from "./clinic";

export const GOOGLE_CLIENT_ID = "60543628402-2ea083dcmpnu2kjq7miakokuoh182fi0.apps.googleusercontent.com";
const OWNER = "dr.saleemo@gmail.com";
export const SESSION_DAYS = 60;

const norm = (e: string) => e.trim().toLowerCase();

export async function allowedEmails(env: Env): Promise<string[]> {
  const v = (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'login_emails'").first<{ value: string }>())?.value;
  if (!v) return [OWNER];
  try { return (JSON.parse(v) as string[]).map(norm).filter(Boolean); } catch { return [OWNER]; }
}

export async function setAllowedEmails(env: Env, list: string[]) {
  const clean = [...new Set(list.map(norm).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))];
  const before = await allowedEmails(env);
  await env.DB.prepare("INSERT INTO clinic_settings (key, value) VALUES ('login_emails', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .bind(JSON.stringify(clean)).run();
  // Removing someone also signs them out everywhere.
  for (const e of before.filter((x) => !clean.includes(x))) await env.DB.prepare("DELETE FROM clinic_keys WHERE label = ?").bind("google:" + e).run();
  return clean;
}

export async function sessions(env: Env) {
  const r = await env.DB.prepare("SELECT label, COUNT(*) n, MAX(created_at) last FROM clinic_keys WHERE label LIKE 'google:%' GROUP BY label").all<{ label: string; n: number; last: string }>();
  return (r.results || []).map((x) => ({ email: x.label.slice(7), n: x.n, last: x.last }));
}

export async function signOutEmail(env: Env, email: string) {
  await env.DB.prepare("DELETE FROM clinic_keys WHERE label = ?").bind("google:" + norm(email)).run();
}

/** Checks a Google ID token; returns the email when it is valid and allowed. */
export async function verifyGoogle(env: Env, idToken: string): Promise<{ email?: string; error?: string }> {
  if (!idToken || idToken.length > 4096) return { error: "no token" };
  let r: Response;
  try { r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken)); } catch { return { error: "تعذّر الاتصال بـ Google، حاول بعد قليل" }; }
  if (!r.ok) return { error: "رمز Google غير صالح، حاول مرة أخرى" };
  const t = await r.json<{ aud?: string; iss?: string; exp?: string; email?: string; email_verified?: string | boolean }>();
  if (t.aud !== GOOGLE_CLIENT_ID) return { error: "رمز Google لتطبيق آخر" };
  if (!["accounts.google.com", "https://accounts.google.com"].includes(t.iss || "")) return { error: "مصدر غير معروف" };
  if (!t.exp || +t.exp * 1000 < Date.now()) return { error: "انتهت صلاحية تسجيل الدخول، حاول مرة أخرى" };
  const email = norm(t.email || "");
  if (!email || !(t.email_verified === true || t.email_verified === "true")) return { error: "بريد غير مؤكد" };
  if (!(await allowedEmails(env)).includes(email)) return { error: `الحساب ${email} غير مسموح له بالدخول. اطلب من الدكتور إضافته.` };
  return { email };
}

export async function newSession(env: Env, email: string): Promise<string> {
  const b = crypto.getRandomValues(new Uint8Array(32));
  const key = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  await env.DB.prepare("INSERT INTO clinic_keys (hash, label) VALUES (?, ?)").bind(await sha256(key), "google:" + email).run();
  return key;
}

export const sessionCookie = (key: string) =>
  `${COOKIE}=${encodeURIComponent(key)}; Path=/clinic; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
