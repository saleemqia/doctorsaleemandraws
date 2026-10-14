---
name: dental-clinic-website
description: Build or change Dr. Saleem Andraws' dental clinic website (doctorsaleem.com), its private /clinic page and the clinic's print materials: services, social, smile design, calendars, PIN-locked accounts, patient cards, domain emails, Rx pad, business card, EN/AR/KU.
---

# Dental clinic website and /clinic system

Owner: Dr. Saleem Andraws, dental clinic in Duhok, Iraq (dr.saleemo@gmail.com). Repo: saleemqia/doctorsaleemandraws (push to main = deploy on Cloudflare Pages).
Read first in the repo: `docs/HANDOFF.md` (accounts, IDs, emails, calendar setup, open items) and `docs/clinic-website-guide.md` (how each part works).

## Stack
- Vite + React + TypeScript + Tailwind + shadcn + framer-motion. Languages: English, Arabic (RTL), Kurdish Badini (RTL). Texts in `src/contexts/LanguageContext.tsx` or local `T(en, ar, ku)` objects; every new text in all three.
- Cloudflare Pages + Pages Functions (`functions/`), D1 `doctorsaleem-analytics` (binding DB, id a3cdd29c-e2b1-411e-8918-a48f537296f1). Cloudflare account 669c04c975d3e6bf5af1e4cd8ec06fca, zone 979cc071be4ad6addcbcd45b6c065d4d. Booking also saves to Supabase.
- Never store keys, tokens, client secrets, the PIN or patient data in the repo. Never type passwords or secrets into fields; the owner pastes them. Do not use pasted GitHub tokens; tell him to revoke.

## Public site
- Contact data and emails only in `src/config/clinic.ts` (phones 0750 781 6500, 0778 166 5000; EMAILS info@/booking@/clinic@doctorsaleem.com with EMAIL_LABELS).
- Services: `src/config/services.ts` (8 slugs, Q&A, SEO) + `src/config/serviceDetails.ts` (what, who, steps, aftercare, YouTube IDs) + `src/pages/ServicePages.tsx`. Social: `src/config/social.ts` + `src/pages/SocialPages.tsx` (embeds; TikTok needs video IDs). Extra pages: `src/config/extraPages.ts`.
- SEO: `src/config/seo.ts` (SitePage type, PAGE_SEO) and `functions/_middleware.ts` (HTMLRewriter titles, canonical, hreflang, Breadcrumb/MedicalProcedure/FAQPage JSON-LD, no-JS fallback with H1, old-URL 301s). Add new URLs to `public/sitemap.xml`; every page needs one H1.
- SmilePreview: on-device only; modes whiten and design (Hollywood smile drawing). Chat helper: approved text only, cautious, never a diagnosis.
- Booking: WhatsApp + Supabase + POST /api/booking (D1 booking_requests). Stats events in both `src/lib/track.ts` and `functions/api/track.ts`.

## /clinic (private)
- One vanilla JS Arabic RTL file `public/clinic/index.html`; guard `functions/clinic/_middleware.ts` (clinic_key cookie, SHA-256 in clinic_keys) plus owner PIN: `lib/clinic.ts` needsPin/pinUnlocked, `/clinic/api/pin`, hash sha256("fin:"+PIN) in clinic_settings.fin_pin, cookie clinic_fin 30 min. Without PIN only quick-entry forms show.
- Appointments from Outlook ICS archived in D1; WhatsApp reminder button 2h before, review request after; no automatic sending.
- Calendars: `lib/calendars.ts` (Microsoft Graph + Google OAuth, tokens in clinic_settings cal_ms_*/cal_g_*; cal_events page edits shown 6h; cal_copy Outlook→Google mirror; autoCopy from day.ts). Endpoints `/clinic/api/cal`, `/cal/connect`, `/cal/callback` (redirect https://www.doctorsaleem.com/clinic/api/cal/callback), `/clinic/api/appt` (create/update/delete, Duhok +03:00). Google project doctor-saleem-clinic, client "Clinic page".
- Accounts: payments, expenses, other_income; manual rows src `m:` survive re-imports; Drive Excel sync; Excel export in 2026 layout; IQD totals must match the workbook. Printing uses the LH letterhead (keep clinic@ and dr.saleemo@gmail.com).

## Email
- Cloudflare Email Routing (free, unlimited addresses): info@/booking@ → duhokresearches@gmail.com, clinic@ → dr_saanha@hotmail.com, alqoshi@ → saleem.hana84@gmail.com, samuel@/sireen@/santos@ → saleem.sally.sireen@gmail.com. New destinations must be verified by the owner.

## Print materials (`print/` in the repo)
- Vector sources rendered to PDF with Chromium (`node print/build.cjs`): `rx.html` (A4 Rx pad), `card.html` (tooth-shaped business card, front + back), `logo.svg` (traced clinic logo), `qr.svg` (to https://www.doctorsaleem.com/links), fonts in `print/f/`. See the skills clinic-rx-pad, clinic-business-card and clinic-stamp.
- Contact data on print: phones 0750 781 6500 and 0778 166 5000 (WhatsApp, Telegram, Viber), emails clinic@doctorsaleem.com and info@doctorsaleem.com (owner replaced dr.saleemo@gmail.com on the Rx and card), www.doctorsaleem.com, address دهوك - شارع قاضي محمد - بناية جرزات شيركو، الطابق الأول - مقابل صيدلية هناسة, hours ٣:٠٠ – ٩:٠٠ مساءً except Friday, Reg. No. 933 (15 April 2009).

## Working method
1. Say what you will do, then work; design changes on a branch, shown before merging.
2. Verify: `npx tsc --noEmit -p tsconfig.app.json`, `npx eslint <files>`, `npx vite build`; /clinic: `npx wrangler pages dev dist --port 8799 --d1 DB=localtest` with a test key, Playwright (`/opt/pw-browsers/chromium`), intercept Google/CDN requests; preview with `npx vite preview --host 127.0.0.1`. Stop servers with `kill $(lsof -ti :PORT)`, never `pkill -f`.
3. Git: `git push origin HEAD:main`; `npm install --no-package-lock`; stale 'unpushed' warnings: check `git ls-remote` and refresh the tracking ref.
4. Production D1 edits via the Cloudflare D1 tool, carefully. Dashboards (Cloudflare, Google Cloud, Search Console, Entra): the owner signs in; ask before accepting agreements or changing settings he did not request; in Cloudflare dropdowns click step by step with screenshots.
5. After deploying, check the live site (all sitemap URLs 200, no JS errors, phone width).
6. Reply in the owner's language (Arabic or English), briefly, with what changed and what he must check.

## Building a similar clinic site
Gather name, doctor, address, phones, services, real reviews and consented photos. One config file and one translations file, then sections, sticky action bar, booking to WhatsApp plus a database, Maps and review links, service pages with FAQ, social pages, SEO data and sitemap. Add a key-protected private page (calendar, PIN-locked accounts, patient cards, letterhead printing). Deploy to Cloudflare Pages with D1, one canonical host (www), Email Routing for domain addresses. Check phone layout, RTL, build and all links before showing the owner.
