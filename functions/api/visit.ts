interface Env { DB: D1Database }

const BOT = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|headless|lighthouse|pagespeed/i;
const DAY_COOKIE = "ds_visitor_day";
const NUMBER_COOKIE = "ds_visitor_number";
const baghdadDay = () => new Date(Date.now() + 180 * 60000).toISOString().slice(0, 10);
const cookieValue = (request: Request, name: string) => {
  const match = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
};
const cookie = (name: string, value: string, maxAge: number) =>
  `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

const visitorNumber = async (db: D1Database, request: Request) => {
  await db.prepare("CREATE TABLE IF NOT EXISTS site_visitor_ids (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  const saved = Number(cookieValue(request, NUMBER_COOKIE));
  if (Number.isSafeInteger(saved) && saved > 0) {
    const found = await db.prepare("SELECT id FROM site_visitor_ids WHERE id = ?").bind(saved).first<{ id: number }>();
    if (found) return { id: saved, setCookie: undefined };
  }
  const created = await db.prepare("INSERT INTO site_visitor_ids DEFAULT VALUES").run();
  const id = Number(created.meta.last_row_id);
  return { id, setCookie: cookie(NUMBER_COOKIE, String(id), 31536000) };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  };
  if (BOT.test(request.headers.get("User-Agent") || "")) {
    return new Response(JSON.stringify({ ok: true }), { headers });
  }

  const day = baghdadDay();
  const isNewToday = cookieValue(request, DAY_COOKIE) !== day;
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_visits (
    day TEXT PRIMARY KEY,
    visitors INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0
  )`).run();
  await env.DB.prepare(`INSERT INTO site_visits (day, visitors, views) VALUES (?, ?, 1)
    ON CONFLICT(day) DO UPDATE SET
      visitors = visitors + excluded.visitors,
      views = views + 1`).bind(day, isNewToday ? 1 : 0).run();

  const visitor = await visitorNumber(env.DB, request);
  const out = new Headers(headers);
  if (isNewToday) out.append("Set-Cookie", cookie(DAY_COOKIE, day, 172800));
  if (visitor.setCookie) out.append("Set-Cookie", visitor.setCookie);
  return new Response(JSON.stringify({ ok: true }), { headers: out });
};
