interface Env { DB: D1Database }

const BOT = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|headless|lighthouse|pagespeed/i;
const COOKIE = "ds_visitor_day";
const baghdadDay = () => new Date(Date.now() + 180 * 60000).toISOString().slice(0, 10);
const cookieValue = (request: Request, name: string) => {
  const match = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
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
  const isNewToday = cookieValue(request, COOKIE) !== day;
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_visits (
    day TEXT PRIMARY KEY,
    visitors INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0
  )`).run();
  await env.DB.prepare(`INSERT INTO site_visits (day, visitors, views) VALUES (?, ?, 1)
    ON CONFLICT(day) DO UPDATE SET
      visitors = visitors + excluded.visitors,
      views = views + 1`).bind(day, isNewToday ? 1 : 0).run();

  const out = new Headers(headers);
  if (isNewToday) out.set("Set-Cookie", `${COOKIE}=${day}; Path=/; Max-Age=172800; HttpOnly; Secure; SameSite=Lax`);
  return new Response(JSON.stringify({ ok: true }), { headers: out });
};
