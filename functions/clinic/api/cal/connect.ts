// GET /clinic/api/cal/connect?p=ms|g → sends the owner to Microsoft / Google to sign in once (needs the PIN, see lib/clinic.ts needsPin).
import { Env } from "../../../../lib/clinic";
import { authUrl, ensureCalSchema } from "../../../../lib/calendars";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const p = new URL(request.url).searchParams.get("p");
  if (p !== "ms" && p !== "g") return new Response("bad provider", { status: 400 });
  try { await ensureCalSchema(env); return Response.redirect(await authUrl(env, p), 302); }
  catch (e) { return Response.redirect(`https://www.doctorsaleem.com/clinic/#cal=${encodeURIComponent(String((e as Error).message || e))}`, 302); }
};
