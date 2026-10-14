---
name: "clinic-stamp"
description: "Design a clinic or doctor rubber/self-inking stamp (round or rectangular) as print-ready vector PDF/SVG in Arabic, Kurdish and English, e.g. for Dr. Saleem Andraws' dental clinic."
---

# Clinic stamp

## Ask first (one short question if unknown)
Shape and size (round 40 mm is common for clinics; rectangular 58 × 22 mm or 47 × 18 mm self-inking), text lines and languages, ink colour (blue or violet are common; one colour only).

## Method
1. One-colour vector only: build an SVG in mm (e.g. viewBox 0 0 400 400 = 40 mm), all shapes and text in one ink colour, no gradients, no shading, no thin hairlines (lines ≥ 0.25 mm, text ≥ 2 mm cap height).
2. Round stamp: outer ring (stroke ~0.6 mm) and inner ring (~0.3 mm) with circular text between them using `<textPath>` on two arcs: top arc English (Montserrat 700, letter-spacing), bottom arc Arabic or Kurdish (Noto Kufi Arabic 700; draw the bottom arc counter-clockwise so the text reads upright). Separate the two texts with small stars or dots. Centre: the traced logo (`print/logo.svg` in the repo) or the doctor's name, specialty and registration number in 2–3 lines.
3. Rectangular stamp: border with rounded corners, lines: Arabic name (Noto Naskh Arabic 700), specialty, English name (Playfair/Montserrat), registration number and phone. Right-to-left lines aligned right, English centred.
4. Content for Dr. Saleem (confirm before use): د. سليم أندراوس · أخصائي أشعة الفم والوجه والفكين · Dr. Saleem Andraws · Dental Clinic · Duhok · Reg. No. 933 · 0750 781 6500. Kurdish: نوژدارا ددانا تایبەتمەند.
5. Output: SVG + PDF at exact size (Playwright `page.pdf` with the stamp size), plus a preview PNG; NOT mirrored (stamp makers mirror it themselves; say so). Also an "ink impression" preview (slight roughness) only if the owner asks, never in the production file.
6. Check: fonts embedded (`pdffonts`), text not touching the rings, legible at real size (look at a 100% render).

## Delivery
Send SVG, PDF and preview PNG; save sources in `print/` of the repo and push. Kurdish/Arabic wording you wrote: ask the owner to check it.