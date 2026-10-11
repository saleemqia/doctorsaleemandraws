// GET /clinic/api/cal/callback?code=…&state=… → Microsoft / Google send the owner back here after signing in.
// The one-time state (saved when the sign-in started, valid 15 minutes) proves the request came from the clinic page.
import { Env } from "../../../../lib/clinic";
import { callback } from "../../../../lib/calendars";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const u = new URL(request.url);
  const back = (msg: string) => Response.redirect(`https://www.doctorsaleem.com/clinic/#cal=${encodeURIComponent(msg)}`, 302);
  if (u.searchParams.get("error")) return back(u.searchParams.get("error_description") || u.searchParams.get("error") || "cancelled");
  try { const p = await callback(env, u.searchParams.get("code") || "", u.searchParams.get("state") || ""); return back(p === "ms" ? "ok-ms" : "ok-g"); }
  catch (e) { return back(String((e as Error).message || e)); }
};
