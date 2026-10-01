// Receives anonymous click counts from the website and stores them in the
// "doctorsaleem-analytics" D1 database. No cookies, no IP addresses, no names
// or phone numbers: only what was clicked, where on the page, language, device type,
// which website the visitor came from, and the country Cloudflare sees.

interface Env {
  DB: D1Database;
}

const EVENTS = new Set([
  "page_view", "call", "whatsapp", "book_open", "book_submit",
  "directions", "map", "instagram", "review", "chat_open", "chat_question",
]);

const clean = (v: unknown, max = 40): string | null =>
  typeof v === "string" && v.length > 0 ? v.replace(/[^\p{L}\p{N}._:/ -]/gu, "").slice(0, max) : null;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const event = clean(body.event);
    if (!event || !EVENTS.has(event)) return new Response(null, { status: 204 });
    const country = (request as unknown as { cf?: { country?: string } }).cf?.country ?? null;
    await env.DB.prepare(
      "INSERT INTO events (event, place, lang, device, source, country) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(event, clean(body.place), clean(body.lang, 4), clean(body.device, 10), clean(body.source, 60), country)
      .run();
  } catch {
    // Never break the website because of statistics.
  }
  return new Response(null, { status: 204 });
};
