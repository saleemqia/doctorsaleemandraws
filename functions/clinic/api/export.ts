// GET /clinic/api/export?from=YYYY-MM-DD&to=YYYY-MM-DD[&sync=1][&format=json]   (auth by the /clinic middleware)
// Exports the archive of appointments. sync=1 first reads Outlook (last 35 days → next 60) into the archive,
// so a scheduled export is complete even if nobody opened the page. Default output: CSV for Excel (with BOM).
import { Env, addDays, archive, eventsBetween, loadCalendar, todayLocal } from "../../../lib/clinic";

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const HEAD = ["التاريخ", "من", "إلى", "المريض", "الهاتف", "العلاج", "الوصف الكامل", "حُذف من التقويم"];
const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const time = (iso: unknown) => iso ? new Date(Date.parse(String(iso)) + 180 * 60000).toISOString().slice(11, 16) : "";

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const u = new URL(request.url);
  const from = DAY.test(u.searchParams.get("from") || "") ? u.searchParams.get("from")! : "2000-01-01";
  const to = DAY.test(u.searchParams.get("to") || "") ? u.searchParams.get("to")! : "2100-01-01";

  let synced: string | null = null;
  if (u.searchParams.get("sync") === "1") {
    try {
      const a = addDays(todayLocal(), -35), b = addDays(todayLocal(), 60);
      const appts = eventsBetween(await loadCalendar(env, { waitUntil }), a, b);
      await archive(env, appts, a, b);
      await env.DB.prepare("INSERT INTO clinic_settings (key, value, updated_at) VALUES ('last_sync', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
        .bind(new Date().toISOString()).run();
      synced = "ok";
    } catch (e) { synced = "failed: " + String((e as Error).message || e); }
  }

  const { results } = await env.DB.prepare(
    `SELECT day, start, end, title, phone, treatment, description, removed FROM appointments
     WHERE day >= ? AND day <= ? ORDER BY start`,
  ).bind(from, to).all<Record<string, unknown>>();
  const rows = results.map((r) => [r.day, time(r.start), time(r.end), r.title, r.phone, r.treatment, r.description, r.removed ? "نعم" : ""] as string[]);

  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if (u.searchParams.get("format") === "json") {
    return new Response(JSON.stringify({ synced, from, to, head: HEAD, rows }), { headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
  }
  const csv = "﻿" + [HEAD, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, { headers: { ...headers,
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="appointments-${from}-${to}.csv"`,
  } });
};
