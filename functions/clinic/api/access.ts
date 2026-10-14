// Who may sign in to /clinic with Google (owner PIN required, see needsPin).
import type { Env } from "../../../lib/clinic";
import { allowedEmails, sessions, setAllowedEmails, signOutEmail } from "../../../lib/googleLogin";

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json({ ok: true, emails: await allowedEmails(env), sessions: await sessions(env) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get("action") || "";
  const b = await request.json<{ emails?: string[]; email?: string }>().catch(() => ({} as { emails?: string[]; email?: string }));
  if (action === "save") return json({ ok: true, emails: await setAllowedEmails(env, b.emails || []), sessions: await sessions(env) });
  if (action === "signout" && b.email) { await signOutEmail(env, b.email); return json({ ok: true, sessions: await sessions(env) }); }
  return json({ ok: false, error: "unknown action" }, 400);
};
