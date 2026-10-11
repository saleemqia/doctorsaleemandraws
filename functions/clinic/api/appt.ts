// Appointments typed in on the /clinic page, written into Outlook and Google (auth by the /clinic middleware).
//   POST /clinic/api/appt                  {name, phone, treatment, notes, day:"YYYY-MM-DD", time:"HH:MM", minutes}
//   POST /clinic/api/appt?action=update    {uid, …same fields}
//   POST /clinic/api/appt?action=delete    {uid}
import { Env, json } from "../../../lib/clinic";
import { NewAppt, createAppt, deleteAppt, ensureCalSchema, updateAppt } from "../../../lib/calendars";

const clean = (v: unknown, n = 200) => String(v ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);

function parse(b: Record<string, unknown>): NewAppt | string {
  const title = clean(b.name, 120), day = String(b.day || ""), time = String(b.time || "");
  if (!title) return "اكتب اسم المريض";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time)) return "اختر اليوم والوقت";
  const minutes = Math.min(Math.max(parseInt(String(b.minutes)) || 30, 5), 480);
  const start = new Date(Date.parse(`${day}T${time}:00+03:00`));           // Duhok time
  if (isNaN(start.getTime())) return "وقت غير صحيح";
  return { title, phone: clean(b.phone, 40), treatment: clean(b.treatment), notes: clean(b.notes, 400),
    start: start.toISOString(), end: new Date(start.getTime() + minutes * 60000).toISOString() };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get("action") || "create";
  let b: Record<string, unknown> = {};
  try { b = await request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  try {
    await ensureCalSchema(env);
    if (action === "delete") {
      const uid = String(b.uid || ""); if (!uid) return json({ ok: false, error: "uid" }, 400);
      return json(await deleteAppt(env, uid));
    }
    const a = parse(b); if (typeof a === "string") return json({ ok: false, error: a }, 400);
    if (action === "update") {
      const uid = String(b.uid || ""); if (!uid) return json({ ok: false, error: "uid" }, 400);
      return json(await updateAppt(env, uid, a));
    }
    const r = await createAppt(env, a);
    if (!r.uid) return json({ ok: false, error: r.errors.join(" · ") || "لا يوجد تقويم مربوط بعد" }, 400);
    return json({ ok: true, ...r });
  } catch (e) { return json({ ok: false, error: String((e as Error).message || e) }, 500); }
};
