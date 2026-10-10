// GET  /clinic/api/requests         → latest booking requests + how many are new
// POST /clinic/api/requests {id, status:"new"|"done"} or {id, del:true}
import { Env, json } from "../../../lib/clinic";

const ENSURE = "CREATE TABLE IF NOT EXISTS booking_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now')), name TEXT, phone TEXT, service TEXT, pref_date TEXT, pref_time TEXT, notes TEXT, status TEXT DEFAULT 'new')";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    await env.DB.prepare(ENSURE).run();
    const { results } = await env.DB.prepare("SELECT * FROM booking_requests ORDER BY (status = 'new') DESC, id DESC LIMIT 100").all();
    const n = await env.DB.prepare("SELECT count(*) AS n FROM booking_requests WHERE status = 'new'").first<{ n: number }>();
    return json({ ok: true, items: results, new: n?.n ?? 0 });
  } catch (e) { return json({ ok: false, error: String((e as Error).message || e) }, 500); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await env.DB.prepare(ENSURE).run();
    const b = (await request.json()) as { id?: number; status?: string; del?: boolean };
    const id = Number(b.id); if (!id) return json({ ok: false }, 400);
    if (b.del) await env.DB.prepare("DELETE FROM booking_requests WHERE id = ?").bind(id).run();
    else await env.DB.prepare("UPDATE booking_requests SET status = ? WHERE id = ?").bind(b.status === "done" ? "done" : "new", id).run();
    return json({ ok: true });
  } catch (e) { return json({ ok: false, error: String((e as Error).message || e) }, 500); }
};
