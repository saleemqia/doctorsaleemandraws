import { Env, setSetting } from "../../../lib/clinic";

const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });

// Clinic middleware verifies the clinic login and owner PIN before this handler.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const row = await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'homepage_design_mode'").first<{ value: string }>();
  return json({ mode: row && ["auto", "approved", "refined"].includes(row.value) ? row.value : "auto" });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.headers.get("Origin") !== new URL(request.url).origin) return json({ error: "طلب غير مسموح" }, 403);
  const body = await request.json<{ mode?: string }>().catch(() => ({}));
  if (!["auto", "approved", "refined"].includes(body.mode || "")) return json({ error: "اختر تصميمًا صالحًا" }, 400);
  await setSetting(env, "homepage_design_mode", body.mode!);
  return json({ ok: true, mode: body.mode });
};
