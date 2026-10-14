# Print materials (vector, print-ready)

- `rx.html` → `out/Rx-Dr-Saleem-Andraws.pdf`: A4 prescription pad (one page).
- `card.html` → `out/Business-Card-Dr-Saleem-Andraws.pdf`: tooth-shaped (die-cut) business card, page 1 front, page 2 back, 66 × 78 mm page with the 60 × 72 mm tooth centred; the navy outline is the cut line.
- `logo.svg`: the clinic logo traced to vector (tooth with "عيادة الدكتور سليم أندراوس"). Use `fill` to recolour.
- `qr.svg`: QR code to https://www.doctorsaleem.com/links (made with Python `segno`).
- `f/`: fonts (OFL): Noto Naskh Arabic (Arabic names), Noto Kufi Arabic (Arabic/Kurdish text), Playfair Display (English name), Montserrat (English text, numbers).
- Build: `node print/build.cjs` (needs playwright-core and Chromium). Print at 100% / actual size.

- `sandy/card.html` → `out/Business-Card-Dr-Sandy-Andraws.pdf`: card for Dr. Sandy Andraws (brother; oral surgery, Masike clinic), arch-top shape 55 × 85 mm on a 61 × 91 mm page, teal + gold; QR opens WhatsApp 0750 432 5923.
- `sandy/card-v2.html` → `out/Business-Card-Dr-Sandy-Andraws-v2.pdf`: second design (preferred after the owner disliked the arch shape): standard horizontal 90 × 55 mm with rounded corners on a 96 × 61 mm page; front ivory with a curved teal panel and gold emblem, back teal with WhatsApp QR. Arabic degree: ماجستير جراحة الفم والأسنان.
