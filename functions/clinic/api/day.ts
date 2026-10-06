// GET /clinic/api/day?from=YYYY-MM-DD&days=N  (auth by the /clinic middleware)
// Reads the Outlook calendar live, adds older archived visits for past days, and keeps the archive up to date:
// the visible range is saved on every load, and the whole calendar at most every 6 hours.
import { Env, addDays, archive, archivedBetween, eventsBetween, fullSync, json, loadCalendar, todayLocal } from "../../../lib/clinic";

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
    const appts = [...live, ...old].sort((a, b) => a.start.localeCompare(b.start));
    waitUntil(archive(env, live, from, to).then(() => fullSync(env, raw)).catch(() => {}));
    return json({ source: "outlook", today: todayLocal(), from, to, appts });
  } catch (e) {
    const { results } = await env.DB.prepare(
      `SELECT uid, day, start, end, title, phone, treatment, description, all_day AS allDay
       FROM appointments WHERE day >= ? AND day < ? AND removed = 0 ORDER BY start`,
    ).bind(from, to).all();
    return json({ source: "archive", error: String((e as Error).message || e), today: todayLocal(), from, to, appts: results });
  }
};
