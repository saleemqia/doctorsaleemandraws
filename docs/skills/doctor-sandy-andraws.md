---
name: "doctor-sandy-andraws"
description: "Create or change Dr. Sandy Andraws' business card (oral surgeon, Duhok Masike): horizontal teal-and-gold design with emblem and WhatsApp QR, print-ready PDF."
---

# Dr. Sandy Andraws business card

Only for Dr. Sandy Andraws' card (brother of Dr. Saleem Andraws). Do not mix with Dr. Saleem's tooth card, Rx or other designs.

Source in repo saleemqia/doctorsaleemandraws: `print/sandy/card-v2.html` (fonts in `print/f/`), output `print/out/Business-Card-Dr-Sandy-Andraws-v2.pdf`. Start from that file; change only what is asked. (`print/sandy/card.html`, the arch-top design, was rejected; don't use it.)

## Card details (approved content)
- Name: Dr. Sandy Andraws / د. ساندي أندراوس
- Degree: B.D.S. | M.Sc. Oral Surgery / ماجستير جراحة الفم والأسنان (always "الفم والأسنان", not only "الفم")
- Job: Lecturer · College of Dentistry · University of Duhok / تدريسي في كلية طب الأسنان - جامعة دهوك
- Phone (call & WhatsApp): 0750 432 5923; QR opens https://wa.me/9647504325923
- Location: Duhok – Masike – In front of Dollar Center / دهوك - ماسيكي - مقابل دولار سنتر
- Label on the front panel: ORAL SURGEON / جراح فم وأسنان

## Design
- Size: standard horizontal 90 × 55 mm, rounded corners (4 mm), on a 96 × 61 mm PDF page (3 mm space around). SVG viewBox units: 10 = 1 mm.
- Colours: teal #0E4D5C to #072F38 (gradient from #14687A), gold #C9A24A with a metallic gold gradient (#B8893A → #E8D193 → #B8893A), light gold #E8D193, ivory #FBFAF6, ink #123B45.
- Front: ivory background; teal panel on the left with a curved gold right edge plus a thin second gold curve; emblem = gold double ring with a tooth outline and the letters "SA"; faint gold arcs in the top-right corner. Right side centred at x=625: English name (Playfair Display 700, 56), Arabic name (Noto Naskh Arabic 700, 54, gold-brown #A87E2E), gold bar, degree lines (Montserrat 700 and Noto Kufi Arabic 700), job lines (Montserrat 500 and Noto Kufi Arabic 500, #4A6870).
- Back: teal gradient; WhatsApp QR (segno, teal) in a white rounded tile with a gold border on the left, "SCAN · WHATSAPP" and "امسح للتواصل عبر واتساب"; gold vertical divider; right side: gold round icons with phone (large white number), WhatsApp line, location (English two lines + Arabic line), name in light gold; gold strip along the bottom.
- Fonts: always give a fallback, e.g. `font-family="Kufi, Mont"`, so hyphens and spaces in Arabic lines do not fall back to a system font (check `pdffonts`: no Liberation/DejaVu).
- Right-to-left SVG text aligned to the right edge: use `direction="rtl"` with `text-anchor="start"` (with rtl, "start" is the right side; "end" breaks it).

## Build and check
1. Render with Playwright Chromium after `document.fonts.ready` (`body[data-ok]`): `page.pdf({width:'96mm',height:'61mm',printBackground:true,preferCSSPageSize:true})`, page 1 front, page 2 back.
2. PNG per side at about 900 dpi (`deviceScaleFactor` ≈ 9.3, viewport 363 × 231).
3. Check: look at both PNGs, QR decodes to the WhatsApp link (OpenCV), no fallback fonts, nothing outside the rounded rectangle.
4. Send PDF + 2 PNGs with SendUserFile; save the source in `print/sandy/` and push. Reply in the owner's language (Arabic or English), briefly.