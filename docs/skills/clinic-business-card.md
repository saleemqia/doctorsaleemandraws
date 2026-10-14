---
name: clinic-business-card
description: Create or change a print-ready business card PDF (including die-cut shapes like Dr. Saleem's tooth card) from a picture or from scratch, with vector logo, QR and Arabic/Kurdish/English text.
---

# Business card

Reference build: repo saleemqia/doctorsaleemandraws, `print/card.html` (+ `logo.svg`, `qr.svg`, `f/`, `build.cjs`). Start from it for Dr. Saleem.

## Method
1. Rebuild as one SVG per side inside an HTML page (never upscale the picture). Page per side; two pages in one PDF: page 1 front, page 2 back.
2. Shape: for a die-cut card draw the outline as one SVG path (the tooth: viewBox 600 × 720 = 60 × 72 mm, page 66 × 78 mm so 3 mm space around). Use the same path for `clipPath` (background) and for the navy outline (stroke 10) with a white inner line; tell the owner/printer that the navy outline is the cut line. Keep all text inside the safe area: check the notch between the roots and the top dip.
3. Background: white centre radial gradient to light blue (#E2EBF9 → #B5CAEC) at the edges, a soft diagonal sheen and a white curved highlight line, matching the owner's original look.
4. Text: Playfair Display 700 for the English name, Noto Naskh Arabic 700 for the Arabic name, Montserrat 700 for numbers/emails/website, Noto Kufi Arabic 700 for Arabic/Kurdish addresses. Curved phone line with `<textPath>` on a quadratic arc. Icon + text rows are centred by a small script (`getBBox`) that runs after `document.fonts.ready` and sets `body[data-ok]`; wait for that before printing.
5. QR in a navy ring with circular text (`textPath` on two half-circle arcs): "SCAN ME · امسح الرمز" on top, "www.doctorsaleem.com" at the bottom. Regenerate the QR with segno; decode-check the final PNG with OpenCV. Correct spelling mistakes from the old picture (e.g. "SCAH ME").
6. Render: Playwright `page.pdf({width:'66mm',height:'78mm',printBackground:true,preferCSSPageSize:true})`; PNGs per side at about 900 dpi (`deviceScaleFactor` ≈ 9.3) for preview/printers that want images.

## Dr. Saleem's card content (current)
- Front: logo; Dr. Saleem Andraws; د. سليم أندراوس; arched 0750 781 6500 • 0778 166 5000 with phone icon; B.D.S. • M.Sc. Oral Radiology.
- Back: QR ring (https://www.doctorsaleem.com/links); WWW.DOCTORSALEEM.COM; clinic@doctorsaleem.com and info@doctorsaleem.com (replaced dr.saleemo@gmail.com); phones; دهوك - كي ار او - فوق جرزات شيركو; Kurdish دهوك كي ار او سەر جرزاتێ شيركو.

## Delivery
Send the PDF and both PNGs, save sources in `print/`, push. Remind: die-cut along the navy outline, print at actual size.
