// GET /clinic/api/day?from=YYYY-MM-DD&days=N  (auth by the /clinic middleware)
// Reads the Outlook calendar live, adds older archived visits for past days, and keeps the archive up to date:
// the visible range is saved on every load, and the whole calendar at most every 6 hours.
import { Appt, Env, addDays, archive, archivedBetween, eventsBetween, fullSync, json, loadCalendar, todayLocal } from "../../../lib/clinic";
import { autoCopy, pageEvents } from "../../../lib/calendars";

// Visits typed in or changed on this page in the last 6 hours: shown at once, because Outlook's published link updates later.
async function withPageEdits(env: Env, list: Appt[], from: string, to: string): Promise<Appt[]> {
  const page = (await pageEvents(env, from, to)).filter((p) => Date.now() - Date.parse(String(p.created_at) + "Z") < 6 * 3600000);
  if (!page.length) return list;
  const gone = new Set(page.filter((p) => Number(p.deleted)).flatMap((p) => [String(p.uid), p.start + "|" + p.title]));
  const edits = new Map(page.filter((p) => !Number(p.deleted)).map((p) => [String(p.uid), p]));
  const out = list.filter((a) => !gone.has(a.uid) && !gone.has(a.start + "|" + a.title)).map((a) => {
    const p = edits.get(a.uid); if (!p) return a; edits.delete(a.uid);
    return { ...a, day: String(p.day), start: String(p.start), end: String(p.end), title: String(p.title), phone: String(p.phone || ""), treatment: String(p.treatment || "") };
  });
  const seen = new Set(out.map((a) => a.start + "|" + a.title));
  for (const p of edits.values()) if (!seen.has(p.start + "|" + p.title)) out.push({ uid: String(p.uid), day: String(p.day), start: String(p.start), end: String(p.end), allDay: false,
    title: String(p.title), phone: String(p.phone || ""), treatment: String(p.treatment || ""), description: [p.phone, p.treatment, p.notes].filter(Boolean).join(" ") });
  return out.sort((a, b) => a.start.localeCompare(b.start));
}


const DAY = /^\d{4}-\d{2}-\d{2}$/;

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const u = new URL(request.url);
  const from = DAY.test(u.searchParams.get("from") || "") ? u.searchParams.get("from")! : todayLocal();
  const days = Math.min(Math.max(parseInt(u.searchParams.get("days") || "1") || 1, 1), 62);
  const to = addDays(from, days);
  try {
    const raw = await loadCalendar(env, { waitUntil });
    const live = eventsBetween(raw, from, to);
    const old = await archivedBetween(env, from, to, new Set(live.map((a) => a.uid)));
    const appts = await withPageEdits(env, [...live, ...old].sort((a, b) => a.start.localeCompare(b.start)), from, to);
    waitUntil(archive(env, live, from, to).then(() => fullSync(env, raw)).then(() => autoCopy(env)).catch(() => {}));
    return json({ source: "outlook", today: todayLocal(), from, to, appts });
  } catch (e) {
    const { results } = await env.DB.prepare(
      `SELECT uid, day, start, end, title, phone, treatment, description, all_day AS allDay
       FROM appointments WHERE day >= ? AND day < ? AND removed = 0 ORDER BY start`,
    ).bind(from, to).all();
    const appts = await withPageEdits(env, (results as Record<string, unknown>[]).map((r) => ({ ...r, allDay: !!r.allDay }) as unknown as Appt), from, to);
    return json({ source: "archive", error: String((e as Error).message || e), today: todayLocal(), from, to, appts });
  }
};
