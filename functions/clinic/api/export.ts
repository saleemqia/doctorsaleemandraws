// GET /clinic/api/export?from=YYYY-MM-DD&to=YYYY-MM-DD → CSV (opens in Excel, Arabic-safe with BOM)
// Exports the archive of every appointment the dashboard has seen. Auth by the /clinic middleware.
import { Env } from "../../../lib/clinic";

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const u = new URL(request.url);
  const from = DAY.test(u.searchParams.get("from") || "") ? u.searchParams.get("from")! : "2000-01-01";
  const to = DAY.test(u.searchParams.get("to") || "") ? u.searchParams.get("to")! : "2100-01-01";
  const { results } = await env.DB.prepare(
    `SELECT day, start, end, title, phone, treatment, description, removed FROM appointments
     WHERE day >= ? AND day <= ? ORDER BY start`,
  ).bind(from, to).all<Record<string, unknown>>();
  const time = (iso: unknown) => iso ? new Date(Date.parse(String(iso)) + 180 * 60000).toISOString().slice(11, 16) : "";
  const rows = [["التاريخ", "من", "إلى", "المريض", "الهاتف", "العلاج", "الوصف الكامل", "حُذف من التقويم"]];
  for (const r of results) rows.push([r.day, time(r.start), time(r.end), r.title, r.phone, r.treatment, r.description, r.removed ? "نعم" : ""] as string[]);
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, { headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="appointments-${from}-${to}.csv"`,
    "Cache-Control": "no-store", "X-Robots-Tag": "noindex",
  } });
};
