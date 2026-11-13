interface Env { DB: D1Database }

const COOKIE = "ds_luck_device";
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
const response = (body: Record<string, unknown>, cookie?: string) => {
  const out = new Headers(headers());
  if (cookie) out.set("Set-Cookie", cookie);
  return new Response(JSON.stringify(body), { headers: out });
};
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
  ]);
};
const device = (request: Request) => {
  const existing = cookieValue(request, COOKIE);
  if (existing && /^[a-f0-9-]{36}$/i.test(existing)) return { id: existing, cookie: undefined };
  const id = crypto.randomUUID();
  return { id, cookie: `${COOKIE}=${id}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax` };
};
const status = async (db: D1Database, id: string, day: string) => {
  const total = await db.prepare("SELECT count(*) AS count FROM lucky_wheel_spins").first<{ count: number }>();
  const existing = await db.prepare("SELECT winner, claim_code FROM lucky_wheel_spins WHERE device_id = ? AND day = ?").bind(id, day).first<{ winner: number; claim_code: string | null }>();
  const count = total?.count ?? 0;
  return {
    canSpin: !existing,
    spinsUntilGift: 100 - (count % 100),
    winner: existing?.winner === 1,
    claimCode: existing?.claim_code ?? undefined,
  };
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  await ensureSchema(env.DB);
  const visitor = device(request);
  return response({ ok: true, ...(await status(env.DB, visitor.id, baghdadDay())) }, visitor.cookie);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  await ensureSchema(env.DB);
  const visitor = device(request);
  const day = baghdadDay();
  const insert = await env.DB.prepare("INSERT OR IGNORE INTO lucky_wheel_spins (device_id, day) VALUES (?, ?)").bind(visitor.id, day).run();
  const changed = insert.meta.changes ?? 0;
  if (!changed) return response({ ok: true, ...(await status(env.DB, visitor.id, day)) }, visitor.cookie);

  const spin = await env.DB.prepare("SELECT id FROM lucky_wheel_spins WHERE device_id = ? AND day = ?").bind(visitor.id, day).first<{ id: number }>();
  const winner = Boolean(spin?.id && spin.id % 100 === 0);
  let claimCode: string | undefined;
  if (winner && spin?.id) {
    claimCode = `DS-GIFT-${String(spin.id).padStart(6, "0")}`;
    await env.DB.prepare("UPDATE lucky_wheel_spins SET winner = 1, claim_code = ? WHERE id = ?").bind(claimCode, spin.id).run();
  }
  const current = await status(env.DB, visitor.id, day);
  return response({ ok: true, ...current, winner, claimCode }, visitor.cookie);
};
