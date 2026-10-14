# Print materials (vector, print-ready)

- `rx.html` → `out/Rx-Dr-Saleem-Andraws.pdf`: A4 prescription pad (one page).
- `card.html` → `out/Business-Card-Dr-Saleem-Andraws.pdf`: tooth-shaped (die-cut) business card, page 1 front, page 2 back, 66 × 78 mm page with the 60 × 72 mm tooth centred; the navy outline is the cut line.
- `logo.svg`: the clinic logo traced to vector (tooth with "عيادة الدكتور سليم أندراوس"). Use `fill` to recolour.
- `qr.svg`: QR code to https://www.doctorsaleem.com/links (made with Python `segno`).
- `f/`: fonts (OFL): Noto Naskh Arabic (Arabic names), Noto Kufi Arabic (Arabic/Kurdish text), Playfair Display (English name), Montserrat (English text, numbers).
- Build: `node print/build.cjs` (needs playwright-core and Chromium). Print at 100% / actual size.
