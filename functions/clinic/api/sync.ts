// POST /clinic/api/sync  → saves the whole published Outlook calendar into the archive now (auth by middleware).
import { Env, fullSync, json, loadCalendar } from "../../../lib/clinic";

export const onRequestPost: PagesFunction<Env> = async ({ env, waitUntil }) => {
  try {
    const r = await fullSync(env, await loadCalendar(env, { waitUntil }), true);
    const s = await env.DB.prepare("SELECT count(*) AS n, min(day) AS first, max(day) AS last FROM appointments WHERE removed = 0").first();
    return json({ ok: true, inCalendar: r.count, archive: s });
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message || e) }, 502);
  }
};
