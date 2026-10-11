// Writing appointments into the owner's Outlook calendar (Microsoft Graph) and Google Calendar.
// The owner registers an app with Microsoft and with Google, pastes its client id + secret on the /clinic page (PIN),
// then signs in once with each account. Secrets and tokens live only in D1 (clinic_settings), never in this code.

import { Env, addDays, patientKey, setSetting, todayLocal } from "./clinic";

export type Provider = "ms" | "g";
export const REDIRECT = "https://www.doctorsaleem.com/clinic/api/cal/callback";

const P = {
  ms: {
    auth: (tenant: string) => `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
    token: (tenant: string) => `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    scope: "offline_access Calendars.ReadWrite User.Read",
  },
  g: {
    auth: () => "https://accounts.google.com/o/oauth2/v2/auth",
    token: () => "https://oauth2.googleapis.com/token",
    scope: "openid email https://www.googleapis.com/auth/calendar.events",
  },
};

export async function settings(env: Env, keys: string[]): Promise<Record<string, string>> {
  const { results } = await env.DB.prepare("SELECT key, value FROM clinic_settings WHERE key IN (SELECT value FROM json_each(?))")
    .bind(JSON.stringify(keys)).all<{ key: string; value: string }>();
  const o: Record<string, string> = {}; for (const r of results) o[r.key] = r.value; return o;
}
const k = (p: Provider, name: string) => `cal_${p}_${name}`;

export async function ensureCalSchema(env: Env) {
  // Appointments typed in on the clinic page (shown at once, before Outlook's published link catches up),
  // and the Google copy of every Outlook appointment (so each is copied once and kept in step).
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS cal_events (uid TEXT PRIMARY KEY, ms_id TEXT, g_id TEXT, day TEXT, start TEXT, end TEXT,
      title TEXT, phone TEXT, treatment TEXT, notes TEXT, deleted INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')))`),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS cal_events_day ON cal_events(day)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS cal_copy (uid TEXT PRIMARY KEY, g_id TEXT, sig TEXT, day TEXT)"),
  ]);
}

export async function status(env: Env) {
  const s = await settings(env, ["ms", "g"].flatMap((p) => ["client_id", "refresh", "account", "tenant"].map((n) => k(p as Provider, n))));
  const one = (p: Provider) => ({ configured: !!s[k(p, "client_id")], connected: !!s[k(p, "refresh")], account: s[k(p, "account")] || "", tenant: s[k(p, "tenant")] || "" });
  return { ms: one("ms"), g: one("g") };
}

export async function saveConfig(env: Env, p: Provider, clientId: string, secret: string, tenant?: string) {
  await setSetting(env, k(p, "client_id"), clientId.trim());
  if (secret.trim()) await setSetting(env, k(p, "secret"), secret.trim());
  if (p === "ms") await setSetting(env, k(p, "tenant"), (tenant || "common").trim() || "common");
}

export async function disconnect(env: Env, p: Provider) {
  await env.DB.prepare("DELETE FROM clinic_settings WHERE key IN (?, ?, ?, ?)").bind(k(p, "refresh"), k(p, "access"), k(p, "exp"), k(p, "account")).run();
}

export async function authUrl(env: Env, p: Provider): Promise<string> {
  const s = await settings(env, [k(p, "client_id"), k(p, "tenant")]);
  const id = s[k(p, "client_id")]; if (!id) throw new Error("not configured");
  const state = p + "." + crypto.randomUUID();
  await setSetting(env, "cal_state", state + "|" + Date.now());
  const q = new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: REDIRECT, scope: P[p].scope, state });
  if (p === "ms") { q.set("response_mode", "query"); q.set("prompt", "select_account"); return `${P.ms.auth(s[k(p, "tenant")] || "common")}?${q}`; }
  q.set("access_type", "offline"); q.set("prompt", "consent"); q.set("include_granted_scopes", "true");
  return `${P.g.auth()}?${q}`;
}

async function tokenCall(env: Env, p: Provider, body: Record<string, string>) {
  const s = await settings(env, [k(p, "client_id"), k(p, "secret"), k(p, "tenant")]);
  const form = new URLSearchParams({ client_id: s[k(p, "client_id")] || "", client_secret: s[k(p, "secret")] || "", ...body });
  if (p === "ms") form.set("scope", P.ms.scope);
  const r = await fetch(p === "ms" ? P.ms.token(s[k(p, "tenant")] || "common") : P.g.token(), {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form,
  });
  const j = (await r.json().catch(() => ({}))) as Record<string, string>;
  if (!r.ok || !j.access_token) throw new Error(j.error_description || j.error || "token " + r.status);
  await setSetting(env, k(p, "access"), j.access_token);
  await setSetting(env, k(p, "exp"), String(Date.now() + (Number(j.expires_in) || 3600) * 1000 - 120000));
  if (j.refresh_token) await setSetting(env, k(p, "refresh"), j.refresh_token);
  return j;
}

/** OAuth redirect back from Microsoft / Google: checks the state, stores the tokens, remembers the account name. */
export async function callback(env: Env, code: string, state: string): Promise<Provider> {
  const saved = (await settings(env, ["cal_state"])).cal_state || "";
  const [st, at] = saved.split("|");
  if (!state || state !== st || Date.now() - Number(at) > 15 * 60000) throw new Error("expired, try again");
  await env.DB.prepare("DELETE FROM clinic_settings WHERE key = 'cal_state'").run();
  const p = state.split(".")[0] as Provider;
  const j = await tokenCall(env, p, { grant_type: "authorization_code", code, redirect_uri: REDIRECT });
  let account = "";
  try {
    if (p === "ms") account = String(((await (await fetch("https://graph.microsoft.com/v1.0/me", { headers: { Authorization: "Bearer " + j.access_token } })).json()) as Record<string, string>).userPrincipalName || "");
    else account = JSON.parse(atob(String(j.id_token).split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).email || "";
  } catch { /* name only */ }
  await setSetting(env, k(p, "account"), account);
  return p;
}

async function access(env: Env, p: Provider): Promise<string | null> {
  const s = await settings(env, [k(p, "access"), k(p, "exp"), k(p, "refresh")]);
  if (!s[k(p, "refresh")]) return null;
  if (s[k(p, "access")] && Number(s[k(p, "exp")]) > Date.now()) return s[k(p, "access")];
  return (await tokenCall(env, p, { grant_type: "refresh_token", refresh_token: s[k(p, "refresh")] })).access_token;
}

async function api(env: Env, p: Provider, method: string, url: string, body?: unknown) {
  const tok = await access(env, p); if (!tok) return null;
  const r = await fetch(url, { method, headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (r.status === 204 || r.status === 410 || (method === "DELETE" && r.status === 404)) return {};
  const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
  if (!r.ok) throw new Error(`${p === "ms" ? "Outlook" : "Google"}: ${(j.error as { message?: string })?.message || j.error_description || r.status}`);
  return j;
}

export interface NewAppt { title: string; phone: string; treatment: string; notes: string; start: string; end: string }
const bodyText = (a: NewAppt) => [a.phone, a.treatment, a.notes].filter(Boolean).join(" ");

const msEvent = (a: NewAppt) => ({
  subject: a.title, body: { contentType: "text", content: bodyText(a) },
  start: { dateTime: a.start.replace("Z", ""), timeZone: "UTC" }, end: { dateTime: a.end.replace("Z", ""), timeZone: "UTC" },
});
const gEvent = (a: NewAppt) => ({
  summary: a.title, description: bodyText(a),
  start: { dateTime: a.start, timeZone: "Asia/Baghdad" }, end: { dateTime: a.end, timeZone: "Asia/Baghdad" },
});
const gCal = async (env: Env) => encodeURIComponent((await settings(env, ["cal_g_calendar"])).cal_g_calendar || "primary");

/** Creates the visit in every connected calendar and remembers it so the page shows it at once. */
export async function createAppt(env: Env, a: NewAppt) {
  const out: { ms?: string; g?: string; errors: string[] } = { errors: [] };
  let uid = "page|" + crypto.randomUUID(), msId = "", gId = "";
  try { const r = await api(env, "ms", "POST", "https://graph.microsoft.com/v1.0/me/events", msEvent(a)); if (r) { msId = String(r.id); uid = String(r.iCalUId || uid); out.ms = "ok"; } }
  catch (e) { out.errors.push(String((e as Error).message)); }
  try { const r = await api(env, "g", "POST", `https://www.googleapis.com/calendar/v3/calendars/${await gCal(env)}/events`, gEvent(a)); if (r) { gId = String(r.id); out.g = "ok"; } }
  catch (e) { out.errors.push(String((e as Error).message)); }
  if (!msId && !gId) return { ...out, uid: "" };
  const day = new Date(Date.parse(a.start) + 180 * 60000).toISOString().slice(0, 10);
  await env.DB.prepare(`INSERT INTO cal_events (uid, ms_id, g_id, day, start, end, title, phone, treatment, notes) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .bind(uid, msId, gId, day, a.start, a.end, a.title, a.phone, a.treatment, a.notes).run();
  if (gId) await env.DB.prepare("INSERT OR REPLACE INTO cal_copy (uid, g_id, sig, day) VALUES (?,?,?,?)").bind(uid, gId, sig(a), day).run();
  return { ...out, uid };
}

const sig = (a: { title: string; start: string; end: string; phone?: string; treatment?: string }) => [a.title, a.start, a.end, a.phone || "", a.treatment || ""].join("|");

/** Finds the Outlook and Google copies of an appointment (typed in here, or an Outlook one copied to Google). */
async function locate(env: Env, uid: string) {
  const ev = await env.DB.prepare("SELECT ms_id, g_id FROM cal_events WHERE uid = ?").bind(uid).first<{ ms_id: string; g_id: string }>();
  let msId = ev?.ms_id || "", gId = ev?.g_id || "";
  if (!gId) gId = (await env.DB.prepare("SELECT g_id FROM cal_copy WHERE uid = ?").bind(uid).first<{ g_id: string }>())?.g_id || "";
  if (!msId && !uid.includes("|")) {          // an Outlook appointment: its published UID is Outlook's iCalUId
    try {
      const r = await api(env, "ms", "GET", `https://graph.microsoft.com/v1.0/me/events?$filter=iCalUId eq '${uid.replace(/'/g, "''")}'&$select=id`);
      msId = String(((r?.value as { id: string }[]) || [])[0]?.id || "");
    } catch { /* not found */ }
  }
  return { msId, gId };
}

export async function updateAppt(env: Env, uid: string, a: NewAppt) {
  const { msId, gId } = await locate(env, uid); const errors: string[] = [];
  if (msId) try { await api(env, "ms", "PATCH", `https://graph.microsoft.com/v1.0/me/events/${msId}`, msEvent(a)); } catch (e) { errors.push(String((e as Error).message)); }
  if (gId) try { await api(env, "g", "PATCH", `https://www.googleapis.com/calendar/v3/calendars/${await gCal(env)}/events/${gId}`, gEvent(a)); } catch (e) { errors.push(String((e as Error).message)); }
  const day = new Date(Date.parse(a.start) + 180 * 60000).toISOString().slice(0, 10);
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO cal_events (uid, ms_id, g_id, day, start, end, title, phone, treatment, notes) VALUES (?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(uid) DO UPDATE SET day=excluded.day, start=excluded.start, end=excluded.end, title=excluded.title, phone=excluded.phone,
        treatment=excluded.treatment, notes=excluded.notes, deleted=0, created_at=datetime('now')`).bind(uid, msId, gId, day, a.start, a.end, a.title, a.phone, a.treatment, a.notes),
    env.DB.prepare("UPDATE cal_copy SET sig=?, day=? WHERE uid=?").bind(sig(a), day, uid),
    env.DB.prepare(`UPDATE appointments SET day=?, start=?, end=?, title=?, phone=?, treatment=?, description=?, patient_key=? WHERE uid=?`)
      .bind(day, a.start, a.end, a.title, a.phone, a.treatment, bodyText(a), patientKey(a.title), uid),
  ]);
  return { ok: !!(msId || gId), outlook: !!msId, google: !!gId, errors };
}

export async function deleteAppt(env: Env, uid: string) {
  const { msId, gId } = await locate(env, uid); const errors: string[] = [];
  if (msId) try { await api(env, "ms", "DELETE", `https://graph.microsoft.com/v1.0/me/events/${msId}`); } catch (e) { errors.push(String((e as Error).message)); }
  if (gId) try { await api(env, "g", "DELETE", `https://www.googleapis.com/calendar/v3/calendars/${await gCal(env)}/events/${gId}`); } catch (e) { errors.push(String((e as Error).message)); }
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO cal_events (uid, ms_id, g_id, deleted, day, start, title) SELECT ?, ?, ?, 1, day, start, title FROM appointments WHERE uid = ?
      ON CONFLICT(uid) DO UPDATE SET deleted = 1, created_at = datetime('now')`).bind(uid, msId, gId, uid),
    env.DB.prepare("UPDATE cal_events SET deleted = 1, created_at = datetime('now') WHERE uid = ?").bind(uid),
    env.DB.prepare("DELETE FROM cal_copy WHERE uid = ?").bind(uid),
    env.DB.prepare("UPDATE appointments SET removed = 1 WHERE uid = ?").bind(uid),
  ]);
  return { ok: !!(msId || gId), outlook: !!msId, google: !!gId, errors };
}

/** Copies archived Outlook appointments in [from, to) to Google (new ones added, changed ones updated, cancelled ones removed).
 *  At most `max` calls per run (Cloudflare allows ~50 outgoing requests per page request). */
export async function copyToGoogle(env: Env, from: string, to: string, max = 30) {
  if (!(await access(env, "g"))) return { ok: false, error: "Google is not connected", done: 0, left: 0 };
  const cal = await gCal(env);
  const { results } = await env.DB.prepare(
    `SELECT a.uid, a.start, a.end, a.title, a.phone, a.treatment, a.description, a.all_day, a.removed, c.g_id, c.sig
     FROM appointments a LEFT JOIN cal_copy c ON c.uid = a.uid
     WHERE a.day >= ? AND a.day < ? AND a.uid NOT LIKE 'page|%' AND (
       (a.removed = 0 AND c.uid IS NULL) OR (a.removed = 1 AND c.uid IS NOT NULL)
       OR (a.removed = 0 AND c.sig IS NOT (a.title || '|' || a.start || '|' || a.end || '|' || coalesce(a.phone,'') || '|' || coalesce(a.treatment,''))))
     ORDER BY a.start LIMIT ?`,
  ).bind(from, to, max + 1).all<Record<string, string | number>>();
  const todo = results.slice(0, max); let done = 0; const errors: string[] = [];
  for (const r of todo) {
    const a = { title: String(r.title || ""), phone: String(r.phone || ""), treatment: String(r.treatment || ""), notes: "", start: String(r.start), end: String(r.end || r.start) };
    const day = new Date(Date.parse(a.start) + 180 * 60000).toISOString().slice(0, 10);
    try {
      if (Number(r.removed)) {
        await api(env, "g", "DELETE", `https://www.googleapis.com/calendar/v3/calendars/${cal}/events/${r.g_id}`);
        await env.DB.prepare("DELETE FROM cal_copy WHERE uid = ?").bind(r.uid).run();
      } else {
        const ev = Number(r.all_day)
          ? { summary: a.title, description: String(r.description || ""), start: { date: day }, end: { date: addDays(day, 1) } }
          : { ...gEvent(a), description: String(r.description || "") };
        const res = r.g_id
          ? await api(env, "g", "PATCH", `https://www.googleapis.com/calendar/v3/calendars/${cal}/events/${r.g_id}`, ev)
          : await api(env, "g", "POST", `https://www.googleapis.com/calendar/v3/calendars/${cal}/events`, ev);
        await env.DB.prepare("INSERT OR REPLACE INTO cal_copy (uid, g_id, sig, day) VALUES (?,?,?,?)").bind(r.uid, String(res?.id || r.g_id), sig(a), day).run();
      }
      done++;
    } catch (e) { errors.push(String((e as Error).message)); if (errors.length > 3) break; }
  }
  return { ok: !errors.length, done, left: Math.max(0, results.length - done), errors };
}

/** Run after each calendar refresh: keeps Google in step for the coming weeks (small batch, in the background). */
export async function autoCopy(env: Env) {
  const s = await settings(env, [k("g", "refresh"), "cal_g_auto"]);
  if (!s[k("g", "refresh")] || s.cal_g_auto === "0") return;
  await ensureCalSchema(env);
  await copyToGoogle(env, todayLocal(), addDays(todayLocal(), 120), 12);
}

/** Appointments typed in on the page that Outlook's published link does not show yet, and ones deleted here. */
export async function pageEvents(env: Env, from: string, to: string) {
  try {
    const { results } = await env.DB.prepare("SELECT uid, day, start, end, title, phone, treatment, notes, deleted, created_at FROM cal_events WHERE day >= ? AND day < ?")
      .bind(from, to).all<Record<string, string | number>>();
    return results;
  } catch { return []; }
}
