# Change log

## 2026-11-13 — Public lucky wheel

- Added a multilingual “Try your luck” section to the Doctor Saleem homepage.
- The public gift is server counted in Cloudflare D1, not decided in the browser.
- Every 100th valid daily device spin receives a claim code for one free consultation or scaling and polishing.
- No patient record, name, or telephone number is collected by the wheel. A winner can choose to contact the clinic through WhatsApp.
- One device can create one spin per Baghdad calendar day. Claim codes are presented to staff when booking.
- Changed files: `src/components/dental/LuckyWheel.tsx`, `src/components/dental/HomeContent.tsx`, and `functions/api/luck.ts`.
- Rollback: remove the component from `HomeContent.tsx` and delete `functions/api/luck.ts`. Existing anonymous spin records remain in D1 but are not public.
