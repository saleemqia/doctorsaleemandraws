# Change log

## 2026-11-19 — Outlook appointments go to the accounts automatically

- Once an Outlook appointment's start time passes, the visit is added once to the payments list and the 2026 Google sheet (name, date, treatment, phone; money empty). Runs in the background whenever the clinic page loads appointments, up to 4 visits per run. Starts from 2026-11-19; older visits are not added.
- Skipped: all-day entries, non-patient titles, titles marked as no-show/postponed/cancelled, and appointments deleted from the page. A row the owner deletes is not added again (table `appt_pay`).
- Entering a payment for the same patient and day fills the automatic row instead of adding a second one.
- Files: `lib/appt-pay.ts` (new), `functions/clinic/api/day.ts`, `functions/clinic/api/finance.ts`. Verified with a type check and a local SQLite test of the add/skip/no-re-add rules.

## 2026-11-19 — Delete appointments from the finance page

- In المالية والحسابات, each appointment chip under the payment form now has a 🗑 button that deletes the appointment after a confirmation, using the same `/clinic/api/appt?action=delete` call as the appointments view.
- Changed file: `public/clinic/index.html`. Verified with a syntax check of the page scripts; check on the live /clinic after deploy.

## 2026-11-13 — Wheel copy and privacy

- Kept the internal prize schedule private. Public visitors see only a surprise-gift wheel.
- Added a warm non-winning message in English, Arabic, and Kurdish that thanks the visitor and invites them to try again tomorrow.


## 2026-11-13 — Public lucky wheel

- Added a multilingual “Try your luck” section to the Doctor Saleem homepage.
- The public gift is server counted in Cloudflare D1, not decided in the browser.
- Selected winning spins receive a claim code for one free consultation or scaling and polishing.
- No patient record, name, or telephone number is collected by the wheel. A winner can choose to contact the clinic through WhatsApp.
- One device can create one spin per Baghdad calendar day. Claim codes are presented to staff when booking.
- Changed files: `src/components/dental/LuckyWheel.tsx`, `src/components/dental/HomeContent.tsx`, and `functions/api/luck.ts`.
- Rollback: remove the component from `HomeContent.tsx` and delete `functions/api/luck.ts`. Existing anonymous spin records remain in D1 but are not public.
