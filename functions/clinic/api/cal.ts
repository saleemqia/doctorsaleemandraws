// Calendar connections for the /clinic page (auth by the /clinic middleware; config and disconnect also need the owner's PIN).
//   GET  /clinic/api/cal                                   → {ms:{configured,connected,account}, g:{…}}
//   POST /clinic/api/cal?action=config     {provider:"ms"|"g", clientId, secret, tenant?}
//   POST /clinic/api/cal?action=disconnect {provider}
//   POST /clinic/api/cal?action=copy       {from, to}      → copies Outlook appointments in that range to Google (in batches)
//   POST /clinic/api/cal?action=auto       {on: boolean}   → keep copying new Outlook appointments to Google automatically
import { Env, json, setSetting } from "../../../lib/clinic";
import { Provider, copyToGoogle, disconnect, ensureCalSchema, saveConfig, status } from "../../../lib/calendars";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try { await ensureCalSchema(env); return json({ ok: true, ...(await status(env)) }); }
  catch (e) { return json({ ok: false, error: String((e as Error).message || e) }, 500); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const action = new URL(request.url).searchParams.get("action");
  let b: Record<string, unknown> = {};
  try { b = await request.json(); } catch { /* empty */ }
  const p = b.provider === "ms" || b.provider === "g" ? (b.provider as Provider) : null;
  try {
    await ensureCalSchema(env);
    if (action === "config") {
      if (!p || !String(b.clientId || "").trim()) return json({ ok: false, error: "client id required" }, 400);
      await saveConfig(env, p, String(b.clientId), String(b.secret || ""), String(b.tenant || ""));
      return json({ ok: true, ...(await status(env)) });
    }
    if (action === "disconnect" && p) { await disconnect(env, p); return json({ ok: true, ...(await status(env)) }); }
    if (action === "copy") {
      const from = String(b.from || ""), to = String(b.to || "");
      if (!DAY.test(from) || !DAY.test(to)) return json({ ok: false, error: "bad range" }, 400);
      return json(await copyToGoogle(env, from, to, 30));
    }
    if (action === "auto") { await setSetting(env, "cal_g_auto", b.on ? "1" : "0"); return json({ ok: true }); }
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return json({ ok: false, error: String((e as Error).message || e) }, 500); }
};
