// Private clinic tools: shared helpers for /clinic (Outlook calendar → today's visits + archive).
// The Outlook ICS link and the access-key hashes live in the D1 database, never in this code.

export interface Env { DB: D1Database }

export interface Appt {
  uid: string; day: string; start: string; end: string; allDay: boolean;
  title: string; phone: string; treatment: string; description: string;
}

const TZ_OFFSET_MIN = 180; // Asia/Baghdad, UTC+3, no daylight saving
export const COOKIE = "clinic_key";

/* ---------- access ---------- */

export async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function cookieValue(req: Request, name: string): string {
  const m = (req.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : "";
}
export async function keyValid(env: Env, key: string): Promise<boolean> {
  if (!key || key.length < 20) return false;
  const row = await env.DB.prepare("SELECT 1 FROM clinic_keys WHERE hash = ?").bind(await sha256(key)).first();
  return !!row;
}

/* ---------- dates ---------- */

export const localDay = (d: Date) => new Date(d.getTime() + TZ_OFFSET_MIN * 60000).toISOString().slice(0, 10);
export const todayLocal = () => localDay(new Date());
export function addDays(day: string, n: number): string {
  const d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}
/** Local day "YYYY-MM-DD" → UTC instant of its local midnight. */
const dayStartUtc = (day: string) => new Date(Date.parse(day + "T00:00:00Z") - TZ_OFFSET_MIN * 60000);

/* ---------- ICS parsing (Outlook) ---------- */

interface Prop { name: string; params: Record<string, string>; value: string }
function unfold(text: string): string[] {
  return text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
}
function parseLine(line: string): Prop | null {
  const i = line.indexOf(":"); if (i < 0) return null;
  const head = line.slice(0, i), value = line.slice(i + 1);
  const parts = head.split(";"); const params: Record<string, string> = {};
  for (const p of parts.slice(1)) { const j = p.indexOf("="); if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, ""); }
  return { name: parts[0].toUpperCase(), params, value };
}
const unescape = (s: string) => s.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");

function offsetMin(s: string): number { // "+0300"
  const m = s.match(/^([+-])(\d\d)(\d\d)$/); if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (parseInt(m[2]) * 60 + parseInt(m[3]));
}
function toDate(p: Prop, tz: Record<string, number>): { date: Date; allDay: boolean } | null {
  const v = p.value.trim();
  let m = v.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m || p.params.VALUE === "DATE") {
    m = m || v.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!m) return null;
    return { date: new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]) - TZ_OFFSET_MIN * 60000), allDay: true };
  }
  m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return null;
  const base = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  if (m[7] === "Z") return { date: new Date(base), allDay: false };
  const off = p.params.TZID && p.params.TZID in tz ? tz[p.params.TZID] : TZ_OFFSET_MIN;
  return { date: new Date(base - off * 60000), allDay: false };
}

const PHONE = /(?:\+?964|0)\s?7\d{2}[\s-]?\d{3}[\s-]?\d{4}/;
export function splitDescription(desc: string): { phone: string; treatment: string } {
  const d = desc.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c)));
  const m = d.match(PHONE);
  const phone = m ? m[0].replace(/[\s-]/g, "") : "";
  const treatment = (m ? d.replace(m[0], " ") : d).replace(/\s+/g, " ").replace(/\s+([,،.])/g, "$1").replace(/^[,،.\s]+/, "").trim();
  return { phone, treatment };
}

interface RawEvent { uid: string; start: Date; end: Date | null; allDay: boolean; summary: string; description: string;
  rrule?: string; exdates: number[]; recurrenceId?: number; status?: string }

export function parseIcs(text: string): RawEvent[] {
  const lines = unfold(text);
  const tz: Record<string, number> = {};
  const events: RawEvent[] = [];
  let inTz = false, tzid = "", inStd = false, cur: Record<string, Prop[]> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VTIMEZONE") { inTz = true; tzid = ""; continue; }
    if (line === "END:VTIMEZONE") { inTz = false; continue; }
    if (inTz) {
      if (line.startsWith("TZID:")) tzid = line.slice(5).trim();
      else if (line === "BEGIN:STANDARD") inStd = true;
      else if (line === "END:STANDARD") inStd = false;
      else if (inStd && line.startsWith("TZOFFSETTO:") && tzid) tz[tzid] = offsetMin(line.slice(11).trim());
      continue;
    }
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT" && cur) {
      const g = (n: string) => cur![n]?.[0];
      const s = g("DTSTART") && toDate(g("DTSTART")!, tz);
      if (s) {
        const e = g("DTEND") ? toDate(g("DTEND")!, tz) : null;
        const ex: number[] = [];
        for (const p of cur["EXDATE"] || []) for (const v of p.value.split(",")) { const d = toDate({ ...p, value: v }, tz); if (d) ex.push(d.date.getTime()); }
        const rid = g("RECURRENCE-ID") ? toDate(g("RECURRENCE-ID")!, tz) : null;
        events.push({
          uid: g("UID")?.value || crypto.randomUUID(), start: s.date, end: e ? e.date : null, allDay: s.allDay,
          summary: unescape(g("SUMMARY")?.value || ""), description: unescape(g("DESCRIPTION")?.value || ""),
          rrule: g("RRULE")?.value, exdates: ex, recurrenceId: rid ? rid.date.getTime() : undefined, status: g("STATUS")?.value,
        });
      }
      cur = null; continue;
    }
    if (cur) { const p = parseLine(line); if (p) (cur[p.name] ||= []).push(p); }
  }
  return events;
}

const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
/** Expands simple DAILY / WEEKLY recurrences (INTERVAL, COUNT, UNTIL, BYDAY) inside [from, to). */
function occurrences(ev: RawEvent, from: Date, to: Date): Date[] {
  if (!ev.rrule) return [ev.start];
  const r: Record<string, string> = {};
  ev.rrule.split(";").forEach((kv) => { const [k, v] = kv.split("="); r[k] = v; });
  const freq = r.FREQ, interval = parseInt(r.INTERVAL || "1"), count = r.COUNT ? parseInt(r.COUNT) : Infinity;
  const until = r.UNTIL ? (toDate({ name: "U", params: {}, value: r.UNTIL }, {})?.date.getTime() ?? Infinity) : Infinity;
  if (freq !== "DAILY" && freq !== "WEEKLY") return [ev.start];
  const byday = r.BYDAY ? r.BYDAY.split(",").map((d) => DAYS.indexOf(d.slice(-2))) : null;
  const out: Date[] = []; let n = 0;
  const step = 86400000;
  for (let t = ev.start.getTime(), i = 0; t <= Math.min(until, to.getTime()) && n < count && i < 3000; t += step, i++) {
    const local = new Date(t + TZ_OFFSET_MIN * 60000);
    const daysFrom = Math.round((t - ev.start.getTime()) / step);
    let hit = false;
    if (freq === "DAILY") hit = daysFrom % interval === 0;
    else {
      const week = Math.floor(daysFrom / 7);
      const dow = local.getUTCDay();
      hit = week % interval === 0 && (byday ? byday.includes(dow) : dow === new Date(ev.start.getTime() + TZ_OFFSET_MIN * 60000).getUTCDay());
    }
    if (!hit) continue;
    n++;
    if (t >= from.getTime() && !ev.exdates.includes(t)) out.push(new Date(t));
  }
  return out;
}

export function eventsBetween(raw: RawEvent[], fromDay: string, toDayExcl: string): Appt[] {
  const from = dayStartUtc(fromDay), to = dayStartUtc(toDayExcl);
  const overrides = new Set(raw.filter((e) => e.recurrenceId).map((e) => e.uid + "|" + e.recurrenceId));
  const out: Appt[] = [];
  for (const ev of raw) {
    if ((ev.status || "").toUpperCase() === "CANCELLED") continue;
    const dur = ev.end ? ev.end.getTime() - ev.start.getTime() : 0;
    const starts = ev.recurrenceId ? [ev.start] : occurrences(ev, from, to);
    for (const s of starts) {
      if (!ev.recurrenceId && ev.rrule && overrides.has(ev.uid + "|" + s.getTime())) continue;
      if (s < from || s >= to) continue;
      const { phone, treatment } = splitDescription(ev.description);
      out.push({
        uid: ev.rrule || ev.recurrenceId ? `${ev.uid}|${s.toISOString()}` : ev.uid,
        day: localDay(s), start: s.toISOString(), end: new Date(s.getTime() + dur).toISOString(), allDay: ev.allDay,
        title: ev.summary.trim(), phone, treatment, description: ev.description.trim(),
      });
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}

/* ---------- fetch + archive ---------- */

export async function loadCalendar(env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<RawEvent[]> {
  const row = await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'ics_url'").first<{ value: string }>();
  if (!row) throw new Error("no calendar link");
  const cache = caches.default;
  const cacheKey = new Request("https://cache.doctorsaleem.internal/ics");
  let res = await cache.match(cacheKey);
  if (!res) {
    const live = await fetch(row.value, { headers: { "User-Agent": "doctorsaleem-clinic/1.0" } });
    if (!live.ok) throw new Error("calendar " + live.status);
    const body = await live.text();
    res = new Response(body, { headers: { "Cache-Control": "max-age=90" } });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
  }
  return parseIcs(await res.text());
}

/** Saves every appointment seen into the archive; marks archived ones in the range that disappeared from Outlook. */
export async function archive(env: Env, appts: Appt[], fromDay: string, toDayExcl: string) {
  const stmts = appts.map((a) => env.DB.prepare(
    `INSERT INTO appointments (uid, day, start, end, title, phone, treatment, description, all_day, last_seen, removed)
     VALUES (?,?,?,?,?,?,?,?,?, datetime('now'), 0)
     ON CONFLICT(uid) DO UPDATE SET day=excluded.day, start=excluded.start, end=excluded.end, title=excluded.title,
       phone=excluded.phone, treatment=excluded.treatment, description=excluded.description, all_day=excluded.all_day,
       last_seen=datetime('now'), removed=0
     WHERE appointments.removed = 1 OR appointments.day IS NOT excluded.day OR appointments.start IS NOT excluded.start
       OR appointments.end IS NOT excluded.end OR appointments.title IS NOT excluded.title
       OR appointments.description IS NOT excluded.description`
  ).bind(a.uid, a.day, a.start, a.end, a.title, a.phone, a.treatment, a.description, a.allDay ? 1 : 0));
  const seen = appts.map((a) => a.uid);
  stmts.push(env.DB.prepare(
    // Only today and later: Outlook drops old events from the published feed, which is not a cancellation.
    `UPDATE appointments SET removed = 1 WHERE day >= ? AND day < ? AND removed = 0 AND uid NOT IN (SELECT value FROM json_each(?))`
  ).bind(fromDay > todayLocal() ? fromDay : todayLocal(), toDayExcl, JSON.stringify(seen)));
  stmts.push(dedupeImported(env));
  for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));
}

/** Rows imported from a CSV file ("imp|…") are dropped when the same visit (same start + name) exists from Outlook. */
export const dedupeImported = (env: Env) => env.DB.prepare(
  `DELETE FROM appointments WHERE uid LIKE 'imp|%' AND EXISTS (SELECT 1 FROM appointments b
     WHERE b.uid NOT LIKE 'imp|%' AND b.start = appointments.start AND b.title = appointments.title)`);

/** Archives everything in the published calendar (from 2020 → 1 year ahead), at most every 6 hours unless forced. */
export async function fullSync(env: Env, raw: RawEvent[], force = false): Promise<{ ran: boolean; count?: number }> {
  if (!force) {
    const last = await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'last_full_sync'").first<{ value: string }>();
    if (last && Date.now() - Date.parse(last.value) < 6 * 3600 * 1000) return { ran: false };
  }
  await env.DB.prepare("INSERT INTO clinic_settings (key, value, updated_at) VALUES ('last_full_sync', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
    .bind(new Date().toISOString()).run();
  const from = "2020-01-01", to = addDays(todayLocal(), 366);
  const appts = eventsBetween(raw, from, to);
  await archive(env, appts, from, to);
  return { ran: true, count: appts.length };
}

/** Archived visits in a range that are not in the live list (older ones Outlook no longer publishes). */
export async function archivedBetween(env: Env, fromDay: string, toDayExcl: string, exclude: Set<string>): Promise<Appt[]> {
  const { results } = await env.DB.prepare(
    `SELECT uid, day, start, end, title, phone, treatment, description, all_day FROM appointments
     WHERE day >= ? AND day < ? AND removed = 0 AND day < ? ORDER BY start`,
  ).bind(fromDay, toDayExcl, todayLocal()).all<Record<string, unknown>>();
  return results.filter((r) => !exclude.has(String(r.uid))).map((r) => ({
    uid: String(r.uid), day: String(r.day), start: String(r.start), end: String(r.end), allDay: !!r.all_day,
    title: String(r.title || ""), phone: String(r.phone || ""), treatment: String(r.treatment || ""), description: String(r.description || ""),
  }));
}

export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
});
