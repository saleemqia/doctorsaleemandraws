# doctorsaleem.com: full handoff (start here in any new account or tool)

Last updated: 14 Oct 2026. This file holds everything needed to continue the work in another Claude account, another computer or with another developer.
**No passwords, keys, PINs or client secrets are written here on purpose.** The owner keeps those himself.

Read next: `docs/clinic-website-guide.md` (how each part works in detail).

---

## 1. Owner and clinic
- Dr. Saleem Andraws, dentist, Duhok (Kurdistan Region, Iraq). Replies in Arabic or English, approves briefly.
- Phones: 0750 781 6500 (main, WhatsApp), 0778 166 5000.
- Personal Google account (Cloud, Search Console, calendar): **dr.saleemo@gmail.com**. Keep this email on printed reports.
- Website: https://www.doctorsaleem.com (canonical host is `www`). Languages: English `/`, Arabic `/ar`, Kurdish Badini `/ku`.

## 2. Accounts and where things live
| What | Where / ID |
|---|---|
| Source code | GitHub `saleemqia/doctorsaleemandraws`, branch `main` (push to main deploys automatically) |
| Hosting | Cloudflare Pages project `doctorsaleem-site`, Pages Functions in `functions/` |
| Cloudflare account ID | `669c04c975d3e6bf5af1e4cd8ec06fca` |
| Zone `doctorsaleem.com` | `979cc071be4ad6addcbcd45b6c065d4d` |
| Database | Cloudflare D1 `doctorsaleem-analytics`, binding `DB`, id `a3cdd29c-e2b1-411e-8918-a48f537296f1` |
| Older booking store | Supabase (used by old `/admin`; keep as is) |
| Google Cloud project | `doctor-saleem-clinic` ("Doctor Saleem Clinic") in dr.saleemo@gmail.com; Calendar API on; OAuth consent External, **In production** |
| Google OAuth client | Web client "Clinic page", Client ID `60543628402-2ea083dcmpnu2kjq7miakokuoh182fi0.apps.googleusercontent.com` (secret: owner's copy only) |
| Microsoft app (Outlook) | Microsoft Entra → App registrations (to be created, see §6) |
| OAuth redirect URI (both) | `https://www.doctorsaleem.com/clinic/api/cal/callback` |
| Search Console | Domain property `sc-domain:doctorsaleem.com`, sitemap `https://www.doctorsaleem.com/sitemap.xml` |
| Privacy page | https://www.doctorsaleem.com/privacy/ (used by Google consent screen) |

## 3. Domain emails (free, Cloudflare Email Routing)
Receive-only forwarding; DNS has MX `route1/2/3.mx.cloudflare.net`, SPF and DKIM. All destinations verified.

| Address | Forwards to | Shown on site |
|---|---|---|
| info@doctorsaleem.com | duhokresearches@gmail.com | Hero, Contact, Footer, JSON-LD, privacy page |
| booking@doctorsaleem.com | duhokresearches@gmail.com | Booking form, Contact, Footer |
| clinic@doctorsaleem.com | dr_saanha@hotmail.com | Contact, Footer, /clinic letterhead |
| alqoshi@doctorsaleem.com | saleem.hana84@gmail.com | no |
| samuel@, sireen@, santos@doctorsaleem.com | saleem.sally.sireen@gmail.com | no |

Add more in Cloudflare → doctorsaleem.com → Email → Email Routing → Routing rules (unlimited addresses, free). To *send* as these addresses, add them in Gmail "Send mail as" (needs an SMTP service; not set up).
Site emails are configured in `src/config/clinic.ts` (`EMAILS`, `EMAIL_LABELS`).

## 4. Social accounts (shown inside the site at `/social/...`)
- Instagram @dr.saleemandraws, Facebook "Diamond Dental Duhok" (doctor.saleem.diamond.dental.duhok), TikTok @salandhana, YouTube video edq1-loT6As, Snapchat doctor.saleem, Telegram @CHercules130, LinkedIn saleem-andraws-hana-71a71377.
- Config: `src/config/social.ts`. TikTok blocks profile embeds; put video IDs in `videos: []` to play them on the page.

## 5. Features (what is built)
**Public site** (Vite + React + TS + Tailwind + shadcn + framer-motion; texts in `src/contexts/LanguageContext.tsx`, always 3 languages):
- Home (blue design): hero, services, about, smile preview, before/after, gallery, real Google reviews, FAQ, contact, sticky action bar (call, WhatsApp, links, book), chat helper (approved text only, cautious medical wording).
- **Services**: `/services` + 8 pages `/services/<slug>` (implants, veneers-hollywood-smile, teeth-whitening, root-canal-fillings, crowns-bridges-dentures, orthodontics-braces, dental-cleaning, tooth-extraction). Data: `src/config/services.ts` (Q&A, SEO) + `src/config/serviceDetails.ts` (what, who, steps, aftercare, YouTube videos). Server adds MedicalProcedure, FAQPage, BreadcrumbList.
- **Smile preview**: on-device, photo never uploaded. Modes "whiten" and "design" (Hollywood smile: 10 drawn teeth with golden proportions, shade/shape/width/length/curve/tilt, move, fit to painted area). `src/components/dental/SmilePreview.tsx`.
- **Social** sub-pages, extra pages (`src/config/extraPages.ts`: case, kids, treatments, infographics, news...), `/links`, `/privacy`.
- SEO: `src/config/seo.ts` + `functions/_middleware.ts` (titles, canonical, hreflang, JSON-LD, no-JS fallback content, old-URL 301s). `public/sitemap.xml` (87 URLs).
- Booking: WhatsApp + Supabase + `/api/booking` (D1 `booking_requests`, shown in /clinic).

**Private `/clinic`** (`public/clinic/index.html`, vanilla JS, Arabic RTL):
- Login: `/clinic/login?k=KEY` (key hash in D1 `clinic_keys`; cookie `clinic_key`).
- **Owner PIN** (second lock, 30 min): accounts, statistics, patient cards, files, sheets and calendar settings. Without it only quick-entry forms show. Hash `sha256("fin:"+PIN)` in `clinic_settings.fin_pin`. Rules: `lib/clinic.ts` `needsPin`.
- Appointments from Outlook ICS (today, tomorrow, ranges, archive since 2020), WhatsApp reminders 2h before, review requests, booking requests.
- **➕ موعد جديد / ✏️ / 🗑**: add, edit, delete appointments; written to Outlook and/or Google (`functions/clinic/api/appt.ts`, `lib/calendars.ts`). Page-made changes show for 6h until the ICS catches up (`cal_events`).
- **🔗 التقويم**: connect Outlook and Google (OAuth; tokens in D1 `clinic_settings` keys `cal_ms_*`, `cal_g_*`), copy Outlook appointments to Google (button "📋 نسخ", plus auto-copy of the next 120 days, 12 per run; mirror table `cal_copy`).
- Accounts (payments, expenses, other income; Google Drive Excel sync; Excel export in the 2026 layout; charts), patient cards (QR, PDF, print with letterhead).

## 6. Connecting the calendars (do once; repeat if a connection is removed)
Open https://www.doctorsaleem.com/clinic → 🔗 التقويم → enter the PIN.

**Google Calendar**
1. https://console.cloud.google.com → project "Doctor Saleem Clinic" → Google Auth Platform → Clients → "Clinic page". Copy the Client ID; use your saved client secret (or "Add secret" to make a new one, copy it immediately, then disable old ones).
2. Paste both under Google Calendar → حفظ → ربط → sign in as dr.saleemo@gmail.com → allow calendar access.
3. Check: the dialog shows "متصل" for Google.

**Outlook (Microsoft 365 / Outlook.com)**
1. https://entra.microsoft.com → App registrations → New registration. Name "Clinic page"; account types "Any Entra ID tenant + personal Microsoft accounts"; Redirect URI type **Web** = `https://www.doctorsaleem.com/clinic/api/cal/callback`.
2. API permissions → Microsoft Graph → Delegated: `Calendars.ReadWrite`, `User.Read`, `offline_access`.
3. Certificates & secrets → New client secret (24 months) → copy the **Value**.
4. In 🔗 التقويم under Outlook paste Application (client) ID + secret value, tenant `common` (or `consumers` for a personal outlook/hotmail account) → حفظ → ربط → sign in with the clinic Outlook account.
5. A personal Microsoft account with no Entra directory may not be able to register apps; then sign in at entra.microsoft.com with a free Azure account first.

Secrets expire (Microsoft max 24 months). When a connection stops, make a new secret and paste it again.

## 7. Working on it (developer notes)
```
npm install --no-package-lock
npx tsc --noEmit -p tsconfig.app.json && npx eslint <files> && npx vite build
npx wrangler pages dev dist --port 8799 --d1 DB=localtest   # local /clinic test, add a test key to clinic_keys
npx vite preview --host 127.0.0.1 --port 4173 --strictPort
git push origin HEAD:main                                   # deploys
```
- Production database changes: Cloudflare D1 tool or `wrangler d1 execute doctorsaleem-analytics --remote`.
- Stop servers by port (`kill $(lsof -ti :8799)`), never `pkill -f`.
- Never commit secrets, tokens, PINs or patient data. Never use pasted GitHub tokens.
- Design changes: show the owner first, merge after approval.

## 8. Starting in a new Claude account
1. Connect GitHub and give access to `saleemqia/doctorsaleemandraws`; connect Cloudflare (Developer Platform) for D1.
2. Add the skill **dental-clinic-website** (SKILL.md in `docs/SKILL-dental-clinic-website.md`).
3. Tell Claude: "Read docs/HANDOFF.md and docs/clinic-website-guide.md, then continue."
4. For dashboards (Cloudflare, Google Cloud, Search Console, Entra) sign in yourself in the browser; Claude never types passwords or secrets.

## 9. Open items
- Google and Outlook calendar connection: paste IDs + secrets as in §6 (in progress).
- Disable the old Google client secret ending in `S-zv` after the new one works.
- Owner should revoke GitHub tokens pasted in earlier chats.
- Treatment price list (owner will send). Recall list for overdue patients (suggested only).
- Optional: "Send mail as" for the domain addresses.
