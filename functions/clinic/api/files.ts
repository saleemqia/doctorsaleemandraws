// X-rays and case photos on a patient card (the browser shrinks each image to ~1600px JPEG before sending).
//   GET  /clinic/api/files?nos=12,40      → [{id,no,kind,title,taken,size}]  (no image bytes)
//   GET  /clinic/api/files?id=5           → the image itself
//   POST /clinic/api/files  {no, kind: "xray"|"photo", title, taken?, data: "data:image/jpeg;base64,..."}
//   POST /clinic/api/files?action=rename {id,title,kind?}  |  ?action=delete {id}
import { Env, ensureSchema, json } from "../../../lib/clinic";

const MAX_B64 = 1_800_000; // keeps one D1 row well under its 2 MB limit

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const u = new URL(request.url);
    const id = parseInt(u.searchParams.get("id") || "");
    if (id) {
      const r = await env.DB.prepare("SELECT mime, data FROM card_files WHERE id = ?").bind(id).first<{ mime: string; data: string }>();
      if (!r) return new Response("not found", { status: 404 });
      const bin = Uint8Array.from(atob(r.data), (c) => c.charCodeAt(0));
      return new Response(bin, { headers: { "Content-Type": r.mime, "Cache-Control": "private, max-age=86400" } });
    }
    const nos = (u.searchParams.get("nos") || "").split(",").map(Number).filter((n) => n > 0).slice(0, 30);
    if (!nos.length) return json({ files: [] });
    const { results } = await env.DB.prepare(
      "SELECT id, no, kind, title, taken, size, created_at FROM card_files WHERE no IN (SELECT value FROM json_each(?)) ORDER BY coalesce(taken, substr(created_at,1,10)) DESC, id DESC",
    ).bind(JSON.stringify(nos)).all();
    return json({ files: results });
  } catch (e) { return json({ error: String(e) }, 500); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const action = new URL(request.url).searchParams.get("action") || "add";
    const b = (await request.json()) as Record<string, unknown>;
    if (action === "delete") { await env.DB.prepare("DELETE FROM card_files WHERE id = ?").bind(Number(b.id)).run(); return json({ ok: true }); }
    if (action === "rename") {
      await env.DB.prepare("UPDATE card_files SET title = ?, kind = coalesce(?, kind) WHERE id = ?")
        .bind(String(b.title || "").slice(0, 120), b.kind === "xray" || b.kind === "photo" ? b.kind : null, Number(b.id)).run();
      return json({ ok: true });
    }
    const no = Number(b.no), kind = b.kind === "photo" ? "photo" : "xray";
    const m = String(b.data || "").match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!no || !m) return json({ ok: false, error: "bad image" }, 400);
    if (m[2].length > MAX_B64) return json({ ok: false, error: "الصورة كبيرة جدًا" }, 413);
    const taken = /^\d{4}-\d{2}-\d{2}$/.test(String(b.taken || "")) ? String(b.taken) : null;
    const r = await env.DB.prepare("INSERT INTO card_files (no, kind, title, mime, data, size, taken) VALUES (?,?,?,?,?,?,?)")
      .bind(no, kind, String(b.title || "").slice(0, 120), m[1], m[2], Math.round(m[2].length * 0.75), taken).run();
    return json({ ok: true, id: r.meta.last_row_id });
  } catch (e) { return json({ ok: false, error: String(e) }, 500); }
};
