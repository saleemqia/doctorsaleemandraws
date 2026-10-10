// Google Sheets link for the accounts workbooks, so the owner edits online and the clinic page pulls the latest.
//   GET  /clinic/api/sheet?action=links          → {links:[url], synced_at}
//   POST /clinic/api/sheet?action=links {links}  → saves the (≤4) Google Sheets links
//   POST /clinic/api/sheet?action=synced         → remembers "synced now"
//   GET  /clinic/api/sheet?id=<sheetId>          → the sheet downloaded as .xlsx (the browser reads it with the same code as a file upload)
// Only docs.google.com spreadsheets are fetched, and the export URL is built here from the id, never taken from the request.
import { Env, ensureSchema, json, setSetting } from "../../../lib/clinic";

const ID = /^[A-Za-z0-9_-]{20,120}$/;
export interface SheetLink { label: string; url: string; id: string }
// A saved link is {label, url}; older saves are plain URL strings. A typed line may be "2025 | https://…" or "2025 https://…".
export function parseLink(x: unknown): SheetLink | null {
  const raw = typeof x === "string" ? x.trim() : String((x as { url?: string })?.url || "").trim();
  const m = raw.match(/^(.*?)[\s|]*(https:\/\/docs\.google\.com\/spreadsheets\/d\/\S+)$/);
  const url = m ? m[2] : raw, id = sheetId(url);
  if (!id) return null;
  const label = (typeof x === "object" && x ? String((x as { label?: string }).label || "") : "") || (m ? m[1].replace(/[|]/g, "").trim() : "");
  return { label: label.slice(0, 40), url: `https://docs.google.com/spreadsheets/d/${id}/edit`, id };
}
export const sheetId = (url: string) => (url.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/(?:e\/)?([A-Za-z0-9_-]{20,120})/) || [])[1] || "";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const u = new URL(request.url);
    if (u.searchParams.get("action") === "links") {
      const rows = await env.DB.prepare("SELECT key, value FROM clinic_settings WHERE key IN ('sheet_links','sheet_synced_at')").all<{ key: string; value: string }>();
      const m = Object.fromEntries(rows.results.map((r) => [r.key, r.value]));
      const links = (m.sheet_links ? (JSON.parse(m.sheet_links) as unknown[]) : []).map(parseLink).filter(Boolean);
      return json({ ok: true, links, synced_at: m.sheet_synced_at || "" });
    }
    const id = u.searchParams.get("id") || "";
    if (!ID.test(id)) return json({ ok: false, error: "bad id" }, 400);
    // A native Google Sheet exports through the Sheets URL; an Excel file kept in Drive (the link shows "rtpof=true") downloads through Drive.
    const tryUrls = [`https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`, `https://drive.google.com/uc?export=download&confirm=t&id=${id}`];
    let r: Response | null = null;
    for (const u of tryUrls) {
      const x = await fetch(u, { redirect: "follow" });
      if (x.ok && !/text\/html/i.test(x.headers.get("content-type") || "")) { r = x; break; }
    }
    if (!r) return json({ ok: false, error: "تعذّر تحميل الجدول. تأكد أن المشاركة: «أي شخص لديه الرابط — مشاهد»." }, 502);
    const buf = await r.arrayBuffer();
    if (buf.byteLength > 15 * 1024 * 1024) return json({ ok: false, error: "الملف كبير جدًا" }, 413);
    return new Response(buf, { headers: { "Content-Type": "application/octet-stream", "Cache-Control": "no-store" } });
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    await ensureSchema(env);
    const action = new URL(request.url).searchParams.get("action");
    if (action === "links") {
      const body = (await request.json()) as { links?: unknown[] };
      const given = (body.links || []).filter((x) => String(typeof x === "string" ? x : (x as { url?: string })?.url || "").trim()).slice(0, 4);
      const links = given.map(parseLink);
      if (links.some((l) => !l)) return json({ ok: false, error: "الرابط يجب أن يكون رابط Google Sheets (docs.google.com/spreadsheets/d/…)" }, 400);
      await setSetting(env, "sheet_links", JSON.stringify(links));
      return json({ ok: true, links });
    }
    if (action === "synced") { await setSetting(env, "sheet_synced_at", new Date().toISOString()); return json({ ok: true }); }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return json({ ok: false, error: String((e as Error)?.message || e) }, 500); }
};
