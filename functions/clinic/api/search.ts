// GET /clinic/api/search?q=text  → archived visits whose name, phone or treatment contains the text (newest first).
import { Env, json } from "../../../lib/clinic";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const q = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 60);
  const stats = await env.DB.prepare("SELECT count(*) AS n, min(day) AS first, max(day) AS last FROM appointments WHERE removed = 0").first();
  if (q.length < 2) return json({ q, stats, appts: [] });
  const digits = q.replace(/[٠-٩]/g, (c) => String("٠١٢٣٤٥٦٧٨٩".indexOf(c))).replace(/\D/g, "");
  const like = "%" + q.replace(/[%_]/g, "") + "%";
  const { results } = await env.DB.prepare(
    `SELECT uid, day, start, end, title, phone, treatment, description, all_day AS allDay FROM appointments
     WHERE removed = 0 AND (title LIKE ?1 OR treatment LIKE ?1 OR description LIKE ?1 OR (?2 <> '' AND phone LIKE ?2))
     ORDER BY start DESC LIMIT 300`,
  ).bind(like, digits.length >= 4 ? "%" + digits + "%" : "").all();
  return json({ q, stats, appts: results });
};
