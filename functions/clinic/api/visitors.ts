interface Env { DB: D1Database }

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  },
});
const day = (offset = 0) => new Date(Date.now() + 180 * 60000 + offset * 86400000).toISOString().slice(0, 10);

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_visits (
    day TEXT PRIMARY KEY,
    visitors INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0
  )`).run();

  const today = day();
  const { results } = await env.DB.prepare(
    "SELECT day, visitors, views FROM site_visits WHERE day >= ? ORDER BY day DESC"
  ).bind(day(-89)).all<{ day: string; visitors: number; views: number }>();
  const all = await env.DB.prepare(
    "SELECT coalesce(sum(visitors),0) visitors, coalesce(sum(views),0) views FROM site_visits"
  ).first<{ visitors: number; views: number }>();

  const sumFrom = (start: string, field: "visitors" | "views") =>
    results.filter((row) => row.day >= start).reduce((total, row) => total + Number(row[field] || 0), 0);
  const current = results.find((row) => row.day === today);

  return json({
    ok: true,
    today: { visitors: Number(current?.visitors || 0), views: Number(current?.views || 0) },
    last7: { visitors: sumFrom(day(-6), "visitors"), views: sumFrom(day(-6), "views") },
    last30: { visitors: sumFrom(day(-29), "visitors"), views: sumFrom(day(-29), "views") },
    all: { visitors: Number(all?.visitors || 0), views: Number(all?.views || 0) },
    daily: results.slice(0, 30),
    started: results.length ? results[results.length - 1].day : today,
  });
};
