interface Env { DB: D1Database }

const COOKIE = "ds_luck_device";
const VISITOR_COOKIE = "ds_visitor_number";
const MILESTONE = 100;
const DAY_MS = 180 * 60 * 1000;
const baghdadDay = () => new Date(Date.now() + DAY_MS).toISOString().slice(0, 10);
const cookieValue = (request: Request, name: string) => {
  const match = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
};
const headers = () => ({
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
});
const response = (body: Record<string, unknown>, cookies: string[] = []) => {
  const out = new Headers(headers());
  cookies.forEach((item) => out.append("Set-Cookie", item));
  return new Response(JSON.stringify(body), { headers: out });
};
const secureCookie = (name: string, value: string) =>
  `${name}=${value}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;
const ensureSchema = async (db: D1Database) => {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS lucky_wheel_spins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      device_id TEXT NOT NULL,
      day TEXT NOT NULL,
      winner INTEGER NOT NULL DEFAULT 0,
      claim_code TEXT
    )`),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS lucky_wheel_one_spin_per_day ON lucky_wheel_spins(device_id, day)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS lucky_wheel_visitor_awards (
      visitor_number INTEGER PRIMARY KEY,
      spin_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE TABLE IF NOT EXISTS site_visitor_ids (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
  ]);
};
const device = (request: Request) => {
  const existing = cookieValue(request, COOKIE);
  if (existing && /^[a-f0-9-]{36}$/i.test(existing)) return { id: existing, cookie: undefined };
  const id = crypto.randomUUID();
  return { id, cookie: secureCookie(COOKIE, id) };
};
const visitorNumber = async (db: D1Database, request: Request) => {
  const saved = Number(cookieValue(request, VISITOR_COOKIE));
  if (Number.isSafeInteger(saved) && saved > 0) {
    const found = await db.prepare("SELECT id FROM site_visitor_ids WHERE id = ?").bind(saved).first<{ id: number }>();
    if (found) return { id: saved, cookie: undefined };
  }
  const created = await db.prepare("INSERT INTO site_visitor_ids DEFAULT VALUES").run();
  const id = Number(created.meta.last_row_id);
  return { id, cookie: secureCookie(VISITOR_COOKIE, String(id)) };
};
const status = async (db: D1Database, id: string, day: string) => {
  const existing = await db.prepare("SELECT winner, claim_code FROM lucky_wheel_spins WHERE device_id = ? AND day = ?").bind(id, day).first<{ winner: number; claim_code: string | null }>();
  return {
    canSpin: !existing,
    spinsUntilGift: 0,
    winner: existing?.winner === 1,
    claimCode: existing?.claim_code ?? undefined,
  };
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  await ensureSchema(env.DB);
  const visitor = device(request);
  const siteVisitor = await visitorNumber(env.DB, request);
  return response({ ok: true, ...(await status(env.DB, visitor.id, baghdadDay())) }, [visitor.cookie, siteVisitor.cookie].filter(Boolean) as string[]);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  await ensureSchema(env.DB);
  const visitor = device(request);
  const siteVisitor = await visitorNumber(env.DB, request);
  const day = baghdadDay();
  const insert = await env.DB.prepare("INSERT OR IGNORE INTO lucky_wheel_spins (device_id, day) VALUES (?, ?)").bind(visitor.id, day).run();
  const cookies = [visitor.cookie, siteVisitor.cookie].filter(Boolean) as string[];
  if (!(insert.meta.changes ?? 0)) return response({ ok: true, ...(await status(env.DB, visitor.id, day)) }, cookies);

  const spin = await env.DB.prepare("SELECT id FROM lucky_wheel_spins WHERE device_id = ? AND day = ?").bind(visitor.id, day).first<{ id: number }>();
  let winner = false;
  let claimCode: string | undefined;
  if (spin?.id && siteVisitor.id % MILESTONE === 0) {
    const awarded = await env.DB.prepare("INSERT OR IGNORE INTO lucky_wheel_visitor_awards (visitor_number, spin_id) VALUES (?, ?)").bind(siteVisitor.id, spin.id).run();
    winner = (awarded.meta.changes ?? 0) > 0;
    if (winner) {
      claimCode = `DS-LUCK-${String(spin.id).padStart(6, "0")}`;
      await env.DB.prepare("UPDATE lucky_wheel_spins SET winner = 1, claim_code = ? WHERE id = ?").bind(claimCode, spin.id).run();
    }
  }
  const current = await status(env.DB, visitor.id, day);
  return response({ ok: true, ...current, winner, claimCode }, cookies);
};
