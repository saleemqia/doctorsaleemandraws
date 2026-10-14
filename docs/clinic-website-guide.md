# Dr. Saleem Andraws Dental Clinic: website and /clinic system

Owner: Dr. Saleem Andraws, dental clinic in Duhok (Kurdistan Region, Iraq). Site: https://www.doctorsaleem.com
This file explains how everything works, how to change it safely, and how to build the same kind of site again.

## 1. Stack
- Vite + React + TypeScript + Tailwind + shadcn/ui + framer-motion. Three languages: English, Arabic (RTL), Kurdish Badini (RTL). All text lives in `src/contexts/LanguageContext.tsx`.
- Hosting: Cloudflare Pages (project `doctorsaleem-site`). Server code is Pages Functions in `functions/`.
- Database: Cloudflare D1 `doctorsaleem-analytics` (binding `DB`, id `a3cdd29c-e2b1-411e-8918-a48f537296f1`). Free plan: 5M reads/day and 100k writes/day; it resets at 03:00 Baghdad time.
- Public booking form also saves to Supabase (older admin page `/admin`). Keep it as is.
- Never put keys, tokens or patient data in the repository.

## 2. Public website (`src/`)
- `pages/Index.tsx` order: Hero, Marquee, Services, About, Smile preview, Before/After, Gallery, Testimonials (real Google reviews), FAQ, Contact, Footer. `SectionNav` and `MobileActionBar` (Call / WhatsApp / All links / Book) sit on top.
- `config/clinic.ts`: phones (0750 781 6500 main, 0778 166 5000), WhatsApp, Google Maps and review links, real reviews. Change contact data only here.
- Chat helper (`ChatBot.tsx`, `lib/assistant.ts`): tooth icon with nudges; answers only from approved site text; symptom checker gives careful, non-diagnostic reassurance. Medical wording must stay cautious.
- Smile preview (`SmilePreview.tsx`): on-device whitening preview of an uploaded photo. It is not AI and the photo never leaves the browser.
- Before/After slider (`BeforeAfter.tsx`): add cases to the `CASES` list with two photos each.
- Booking (`BookingModal.tsx`): opens WhatsApp, saves to Supabase, and posts to `/api/booking` (D1 table `booking_requests`) so it shows in /clinic.
- Anonymous statistics: `lib/track.ts` and `functions/api/track.ts` (event names must exist in both).
- Design: bright, warm, rounded; tokens in `src/index.css`. Marquee must be wrapped in `dir="ltr"` for RTL.

## 3. Private clinic page `/clinic`
One vanilla JavaScript Arabic RTL file: `public/clinic/index.html`. Guarded by `functions/clinic/_middleware.ts`: cookie `clinic_key` or header `X-Clinic-Key`; only the SHA-256 hash is stored in table `clinic_keys`. Login link: `/clinic/login?k=KEY`.

Two sections (buttons at the top):
- **Appointments:** today, tomorrow, reminders, booking requests, yesterday, 7 days, 30 days, last week, last month, archive. On a single-day view there are buttons for day, month and year steps and a "Today" button.
- **Finance and patients:** Accounts and Patient cards.

Features:
- Calendar: read from the clinic's Outlook calendar (ICS); visits are archived into D1 (`appointments`). Appointments can also be added, edited and deleted in the page (➕ / ✏️ / 🗑), written to Outlook and/or Google once they are connected in 🔗 التقويم (`lib/calendars.ts`, `functions/clinic/api/appt.ts`, `functions/clinic/api/cal*`). Outlook appointments can be copied to Google. Setup steps and IDs: `docs/HANDOFF.md`.
- Reminders: for every appointment with a phone number, a green "send" button appears 2 hours before. It opens WhatsApp with the message ready (WhatsApp cannot be sent automatically without its paid business service). After a visit, a button sends a Google review request. Sent marks are kept in the browser.
- Booking requests: requests from the website, with call, WhatsApp, done and delete.
- Patient cards: merged by name key (`patientKey`), with phones, visits, payments, files, QR, PDF report and printing.
- Accounts (below).
- Printing: every printed report has the clinic letterhead (name, doctor, address, phones, email, website). The text lives in the `LH` constant in `index.html`.

### Accounts
- Data tables: `payments`, `expenses`, `other_income` (D1). Schema version 7, created in `lib/clinic.ts` `ensureSchema`.
- Quick entry in the page: a patient payment (pick the patient from the day's calendar), an expense, or a new patient. These rows have `src` starting with `m:` (manual); month re-imports never delete them. Never type the same payment in a sheet and in the page.
- Old data comes from the yearly Excel files kept in Google Drive (2025, 2026). Links are in `clinic_settings.sheet_links` as `{label,url}` and are synced with the "مزامنة الآن" button (the files must be shared as "Anyone with the link, Viewer"). Each year shows a card with a thumbnail and an embedded preview.
- Charts and tables: income and expenses by month, net, outstanding, expense categories, and a monthly summary against the previous month.
- Export: the "تصدير Excel" button builds a workbook in the same layout as the 2026 file (Annual Dashboard plus 12 month sheets, same cell positions, live formulas) with ExcelJS from cdnjs.
- Rule: IQD totals must match the workbook exactly (rows without a valid date go to `other_income`). USD may differ slightly where Excel ignored text like "400$".

- **Owner PIN (second lock):** accounts, statistics, patient cards, files, sheet links and account imports need the owner's PIN as well as the clinic key. Without it the finance section shows only the quick-entry forms (payment, expense, new patient). Rules in `lib/clinic.ts` `needsPin`; endpoint `/clinic/api/pin` (unlock for 30 minutes, or lock now). Only `sha256("fin:" + PIN)` is stored, in `clinic_settings` key `fin_pin`; change the PIN by updating that value. Never write the PIN itself in the repo.

## 4. Working method (always)
1. Work on a test branch, show the change, and merge to `main` only after the owner approves (for design changes).
2. Check: `npx tsc --noEmit -p tsconfig.app.json`, `npx eslint <files>`, `npx vite build`.
3. Test locally: `npx wrangler pages dev dist --port 8799 --d1 DB=localtest` with a test key in `clinic_keys`; use Playwright (Chromium is installed) and intercept Google and SheetJS/ExcelJS requests.
4. Git: `git push origin HEAD:main`. Commit trailers as required by the environment. Never commit a lockfile change; use `npm install --no-package-lock`.
5. Do not use pasted GitHub tokens. If the owner pastes one, tell him to revoke it.
6. Do not kill processes with `pkill -f "wrangler pages"` (it can kill your own shell); use the port: `kill $(lsof -ti :8799)`.

## 5. Building a similar clinic site from scratch (checklist)
1. Gather: name, doctor, address, phones, hours, services, real reviews and photos with consent, languages.
2. Create the Vite + React + Tailwind project, one `config/clinic.ts`, one translations file, sections as separate components.
3. Add the sticky action bar (call, WhatsApp, links, book), booking form to WhatsApp plus a database, Google Maps and review links, FAQ and structured data (SEO).
4. Add the private page: a key-based guard, calendar read, patient cards, accounts and printing letterhead.
5. Deploy to Cloudflare Pages with a D1 database; set the custom domain with one canonical host (www).
6. Check phone layout, RTL, build, and every link before showing it to the owner.

## 6. Open items
- The owner must revoke the GitHub tokens he pasted earlier.
- Price list: the owner will supply it later (not built yet).
- Recall list for overdue patients: suggested, not requested.
