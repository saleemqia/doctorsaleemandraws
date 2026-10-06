// POST /clinic/api/import  {appts:[{uid?,start,end,allDay,title,description}]}  (max 500 per call; auth by middleware)
// Adds visits from a file exported from Outlook (parsed in the browser) to the archive. Never marks anything removed.
import { Appt, Env, archive, json, localDay, splitDescription } from "../../../lib/clinic";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { appts?: Record<string, unknown>[] };
  try { body = await request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const list = Array.isArray(body.appts) ? body.appts.slice(0, 500) : [];
  const appts: Appt[] = [];
  for (const r of list) {
    const start = Date.parse(String(r.start || "")); if (!Number.isFinite(start)) continue;
    const endP = Date.parse(String(r.end || "")); const end = Number.isFinite(endP) && endP >= start ? endP : start;
    const title = String(r.title || "").trim().slice(0, 200);
    const description = String(r.description || "").replace(/\r\n/g, "\n").trim().slice(0, 2000);
    const s = new Date(start).toISOString();
    const { phone, treatment } = splitDescription(description);
    appts.push({ uid: String(r.uid || `imp|${s}|${title}`).slice(0, 300), day: localDay(new Date(start)), start: s,
      end: new Date(end).toISOString(), allDay: !!r.allDay, title, phone, treatment, description });
  }
  await archive(env, appts, "2100-01-01", "2100-01-01"); // empty range: nothing gets marked removed
  return json({ ok: true, saved: appts.length, skipped: list.length - appts.length });
};
