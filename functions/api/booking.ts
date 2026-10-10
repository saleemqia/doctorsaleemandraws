// Receives a booking request from the website form and keeps it in D1 so the clinic sees it in /clinic ("طلبات الحجز").
// The patient is also sent to WhatsApp by the site, so a failed save never loses the request.
interface Env { DB: D1Database }

const txt = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "");

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const b = (await request.json()) as Record<string, unknown>;
    if (b.website) return new Response(null, { status: 204 }); // honeypot
    const name = txt(b.name, 80), phone = txt(b.phone, 30).replace(/[^\d+ ]/g, "");
    if (name.length < 2 || phone.replace(/\D/g, "").length < 7) return new Response(JSON.stringify({ ok: false }), { status: 400 });
    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS booking_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT DEFAULT (datetime('now')), name TEXT, phone TEXT, service TEXT, pref_date TEXT, pref_time TEXT, notes TEXT, status TEXT DEFAULT 'new')",
    ).run();
    const recent = await env.DB.prepare("SELECT count(*) AS n FROM booking_requests WHERE created_at > datetime('now','-10 minutes')").first<{ n: number }>();
    if ((recent?.n ?? 0) >= 30) return new Response(JSON.stringify({ ok: false }), { status: 429 });
    await env.DB.prepare("INSERT INTO booking_requests (name, phone, service, pref_date, pref_time, notes) VALUES (?,?,?,?,?,?)")
      .bind(name, phone, txt(b.service, 80), txt(b.date, 12), txt(b.time, 12), txt(b.notes, 400)).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
};
