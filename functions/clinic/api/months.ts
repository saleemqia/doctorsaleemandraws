// GET /clinic/api/months            → visits per month across the whole archive (for the year/month browser)
// GET /clinic/api/months?ym=YYYY-MM → all archived visits of that month, oldest first
import { Env, json } from "../../../lib/clinic";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const ym = new URL(request.url).searchParams.get("ym") || "";
  if (/^\d{4}-\d{2}$/.test(ym)) {
    const { results } = await env.DB.prepare(
      `SELECT uid, day, start, end, title, phone, treatment, description, all_day AS allDay FROM appointments
       WHERE removed = 0 AND day >= ? AND day < ? ORDER BY start`,
    ).bind(ym + "-01", ym + "-32").all();
    return json({ ym, appts: results });
  }
  const { results } = await env.DB.prepare(
    "SELECT substr(day, 1, 7) AS ym, count(*) AS n FROM appointments WHERE removed = 0 GROUP BY ym ORDER BY ym DESC",
  ).all();
  return json({ months: results });
};
