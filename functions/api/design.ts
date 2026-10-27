interface Env { DB: D1Database }

// Only the display preference is public; the writable endpoint is under /clinic.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  let mode = "auto";
  try {
    const row = await env.DB.prepare("SELECT value FROM clinic_settings WHERE key = 'homepage_design_mode'").first<{ value: string }>();
    if (row && ["auto", "approved", "refined"].includes(row.value)) mode = row.value;
  } catch { /* A database outage leaves the scheduled design available. */ }
  return Response.json({ mode }, { headers: { "Cache-Control": "no-store" } });
};
