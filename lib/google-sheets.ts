import type { Env } from "./clinic";

const BOOKS: Record<string, string> = {
  "2026": "1WFnlFnNSHoNQpX1ls8tratB0wPs0qF23QjuIbFiPcmo",
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const API = "https://sheets.googleapis.com/v4/spreadsheets";

type PaymentSheetRow = {
  src: string; name: string; day: string;
  paid_iqd: number; paid_usd: number; due_iqd: number; due_usd: number;
  work: string; notes: string;
};

const enc = (value: string | Uint8Array) => {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let raw = "";
  for (const b of bytes) raw += String.fromCharCode(b);
  return btoa(raw).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

function pemBytes(pem: string): ArrayBuffer {
  const raw = atob(pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, ""));
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

async function accessToken(env: Env): Promise<string> {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error("Google Sheets is not configured");
  // Cloudflare's dashboard can turn indentation spaces into non-breaking spaces
  // when a JSON secret is pasted from a browser editor. Normalize them before
  // parsing so a valid service-account key remains usable after deployment.
  const secret = env.GOOGLE_SERVICE_ACCOUNT_JSON.replace(/^\uFEFF/, "").replace(/\u00a0/g, " ");
  const account = JSON.parse(secret) as { client_email?: string; private_key?: string; token_uri?: string };
  if (!account.client_email || !account.private_key) throw new Error("Google service account secret is invalid");
  const now = Math.floor(Date.now() / 1000);
  const head = enc(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = enc(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: account.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3500,
  }));
  const unsigned = `${head}.${claim}`;
  const key = await crypto.subtle.importKey("pkcs8", pemBytes(account.private_key), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const res = await fetch(account.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${enc(new Uint8Array(signature))}` }),
  });
  const data = await res.json() as { access_token?: string; error_description?: string; error?: string };
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || `Google token error ${res.status}`);
  return data.access_token;
}

async function google(token: string, url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(body.error?.message || `Google Sheets error ${res.status}`);
  }
  return res.status === 204 ? {} : res.json();
}

function target(day: string) {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(day);
  if (!match || !BOOKS[match[1]]) throw new Error("Automatic sheet editing is configured for 2026 only. Other years can be exported as Excel.");
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) throw new Error("Invalid payment month");
  return { spreadsheetId: BOOKS[match[1]], month };
}

const values = (r: PaymentSheetRow) => [[r.name, Math.round(Date.parse(r.day + "T00:00:00Z") / 86400000) + 25569, r.paid_iqd, r.paid_usd, r.due_iqd, r.due_usd, r.work, r.notes, r.src]];
const rangeUrl = (spreadsheetId: string, range: string, suffix = "") => `${API}/${spreadsheetId}/values/${encodeURIComponent(range)}${suffix}`;
const clearUrl = (spreadsheetId: string, range: string) => `${API}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;

async function ensureSyncHeader(token: string, spreadsheetId: string, month: string) {
  await google(token, rangeUrl(spreadsheetId, `${month}!I4`, "?valueInputOption=RAW"), { method: "PUT", body: JSON.stringify({ values: [["Clinic Sync ID"]] }) });
}

async function findRow(token: string, spreadsheetId: string, month: string, src: string): Promise<number | null> {
  const data = await google(token, rangeUrl(spreadsheetId, `${month}!I5:I`)) as { values?: unknown[][] };
  const i = (data.values || []).findIndex((r) => String(r?.[0] || "") === src);
  return i < 0 ? null : i + 5;
}

export async function appendPaymentToSheet(env: Env, row: PaymentSheetRow) {
  const token = await accessToken(env), { spreadsheetId, month } = target(row.day);
  await writeNewPayment(token, spreadsheetId, month, row);
}

async function writeNewPayment(token: string, spreadsheetId: string, month: string, row: PaymentSheetRow) {
  // Keep new payments inside the income table so the existing totals and import
  // parser include them. Appending at the bottom would enter the expense area.
  const existing = await findRow(token, spreadsheetId, month, row.src);
  const data = await google(token, rangeUrl(spreadsheetId, `${month}!A5:I`, "?valueRenderOption=FORMULA")) as { values?: unknown[][] };
  const rows = data.values || [];
  const end = rows.findIndex(r => /TOTAL\s+INCOME/i.test(String(r[0] || "")));
  if (end < 0) throw new Error("The monthly income table was not found; payment remains saved in the clinic.");
  const empty = rows.slice(0, end).findIndex(r => r.every(v => v === "" || v === null));
  const destination = existing || (empty < 0 ? 0 : empty + 5);
  if (!destination) throw new Error("The monthly income table is full. Add empty rows above TOTAL INCOME, then retry.");
  await ensureSyncHeader(token, spreadsheetId, month);
  await google(token, rangeUrl(spreadsheetId, `${month}!A${destination}:I${destination}`, "?valueInputOption=RAW"), {
    method: "PUT", body: JSON.stringify({ values: values(row) }),
  });
}

export async function updatePaymentInSheet(env: Env, oldDay: string, row: PaymentSheetRow) {
  const token = await accessToken(env), oldTarget = target(oldDay), nextTarget = target(row.day);
  const oldRow = await findRow(token, oldTarget.spreadsheetId, oldTarget.month, row.src);
  if (oldTarget.spreadsheetId === nextTarget.spreadsheetId && oldTarget.month === nextTarget.month && oldRow) {
    await google(token, rangeUrl(nextTarget.spreadsheetId, `${nextTarget.month}!A${oldRow}:I${oldRow}`, "?valueInputOption=RAW"), {
      method: "PUT", body: JSON.stringify({ values: values(row) }),
    });
    return;
  }
  await writeNewPayment(token, nextTarget.spreadsheetId, nextTarget.month, row);
  if (oldRow) await google(token, clearUrl(oldTarget.spreadsheetId, `${oldTarget.month}!A${oldRow}:I${oldRow}`), { method: "POST", body: "{}" });
}

export async function deletePaymentFromSheet(env: Env, day: string, src: string) {
  const token = await accessToken(env), { spreadsheetId, month } = target(day);
  const row = await findRow(token, spreadsheetId, month, src);
  if (row) await google(token, clearUrl(spreadsheetId, `${month}!A${row}:I${row}`), { method: "POST", body: "{}" });
}

export async function checkPaymentSheets(env: Env) {
  const token = await accessToken(env);
  const out: Record<string, boolean> = {};
  for (const [year, spreadsheetId] of Object.entries(BOOKS)) {
    await google(token, `${API}/${spreadsheetId}?fields=spreadsheetId,properties.title`);
    out[year] = true;
  }
  return out;
}
