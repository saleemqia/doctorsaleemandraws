// Outlook appointments → accounts. Once an appointment's start time has passed, the visit is added once to the
// payments list (and the 2026 Google sheet) with the money left empty, so the owner only fills in what was paid.
// A later payment typed for the same patient and day fills that row instead of adding a second one (finance.ts).
// Rows the owner deletes are never re-added: every handled appointment is remembered in appt_pay.
import { Env, patientKey, setSetting, todayLocal } from "./clinic";
import { appendPaymentToSheet } from "./google-sheets";
import { ensureCalSchema } from "./calendars";

const SKIP = /(لم تاتي|لم تأتي|لم ياتي|لم يأت|تاجل|تأجل|تاجيل|تأجيل|ملغي|الغاء|إلغاء|cancel)/i;
const MAX_PER_RUN = 4;          // each sheet write is ~5 requests; Cloudflare allows ~50 per page request

export const AUTO_PREFIX = "m:ap";
export const visitName = (title: string) => String(title).replace(/\s*[/(].*$/, "").trim() || String(title).trim();

async function srcFor(uid: string) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(uid)));
  return AUTO_PREFIX + [...h.slice(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function apptsToPayments(env: Env) {
  await ensureCalSchema(env);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS appt_pay (uid TEXT PRIMARY KEY, src TEXT, created_at TEXT DEFAULT (datetime('now')))").run();
  // Start from the day this feature was switched on, so years of old visits are not poured into the sheet.
  let from = (await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'appt_pay_from'").first<{ value: string }>())?.value;
  if (!from) { from = todayLocal(); await setSetting(env, "appt_pay_from", from); }
  const { results } = await env.DB.prepare(
    `SELECT a.uid, a.day, a.title, a.phone, a.treatment FROM appointments a
     WHERE a.day >= ? AND a.day <= ? AND a.start <= ? AND a.removed = 0 AND coalesce(a.all_day, 0) = 0
       AND NOT EXISTS (SELECT 1 FROM appt_pay p WHERE p.uid = a.uid)
       AND NOT EXISTS (SELECT 1 FROM cal_events c WHERE c.uid = a.uid AND c.deleted = 1)
     ORDER BY a.start LIMIT 40`,
  ).bind(from, todayLocal(), new Date().toISOString()).all<{ uid: string; day: string; title: string; phone: string; treatment: string }>();
  let written = 0;
  for (const a of results) {
    const name = visitName(a.title).slice(0, 120), key = patientKey(name);
    const src = await srcFor(a.uid);
    if (!name || key.startsWith("#") || SKIP.test(a.title)) { await env.DB.prepare("INSERT OR IGNORE INTO appt_pay (uid, src) VALUES (?, '')").bind(a.uid).run(); continue; }
    if (written >= MAX_PER_RUN) break;
    // Already entered by hand for this patient and day? Then just remember the appointment.
    const typed = await env.DB.prepare("SELECT 1 FROM payments WHERE patient_key = ? AND day = ? LIMIT 1").bind(key, a.day).first();
    await env.DB.prepare("INSERT OR IGNORE INTO appt_pay (uid, src) VALUES (?, ?)").bind(a.uid, typed ? "" : src).run();
    if (typed) continue;
    const work = String(a.treatment || "").slice(0, 300), phone = String(a.phone || "").slice(0, 40);
    await env.DB.prepare(
      `INSERT OR IGNORE INTO payments (src, sheet, patient_key, name, day, paid_iqd, paid_usd, due_iqd, due_usd, work, notes, phone, matched)
       VALUES (?,?,?,?,?,0,0,0,0,?,'',?,'manual')`,
    ).bind(src, a.day.slice(0, 7), key, name, a.day, work, phone).run();
    written++;
    try { await appendPaymentToSheet(env, { src, name, day: a.day, paid_iqd: 0, paid_usd: 0, due_iqd: 0, due_usd: 0, work, notes: "" }); }
    catch { /* stays in the clinic accounts; the next export or edit carries it to the sheet */ }
  }
  if (written) await setSetting(env, "stats_dirty", "1");
  return written;
}
