---
name: clinic-business-card
description: Create or change a print-ready business card PDF (including die-cut shapes like Dr. Saleem's tooth card) from a picture or from scratch, with vector logo, QR and Arabic/Kurdish/English text.
---

# Business card

Reference build: repo saleemqia/doctorsaleemandraws, `print/card.html` (+ `logo.svg`, `qr.svg`, `f/`, `build.cjs`). Start from it for Dr. Saleem.

## First: small change or new design?
- If the owner sends his finished card picture and asks for a small change (e.g. "just change the email"), DO NOT rebuild or restyle anything: keep the shape, QR, fonts, colours and every detail. Edit only the changed text in the picture itself:
  1. Find the old text box (dark pixels, OpenCV), note its colour (navy RGB 27,37,73 on the tooth card), left edge, ascender top and width.
  2. Erase it: mask of dark pixels dilated 2x (5x5), `cv2.inpaint(..., 9, cv2.INPAINT_TELEA)`.
  3. Re-type with the closest font (the tooth card uses an Arial/Helvetica Bold look: Liberation Sans Bold 48px at the original 2576 px wide picture, stretched horizontally ×1.078, stroke 1, rendered 4x and downsampled). First re-type the OLD text and compare it side by side with the original until they match, then type the new text at the same left edge and top.
  4. Deliver the edited PNG at the original resolution and a PDF made losslessly with `img2pdf` (300 dpi). If the new text is longer, offer alternatives (e.g. info@ fits the old width exactly, clinic@ is a little longer).
- Only rebuild as vector (below) when the owner asks for a new design, a cleaner version or print-ready die-cut files.

## Method (new design / vector rebuild)
1. Rebuild as one SVG per side inside an HTML page (never upscale the picture). Page per side; two pages in one PDF: page 1 front, page 2 back.
2. Shape: for a die-cut card draw the outline as one SVG path (the tooth: viewBox 600 × 720 = 60 × 72 mm, page 66 × 78 mm so 3 mm space around). Use the same path for `clipPath` (background) and for the navy outline (stroke 10) with a white inner line; tell the owner/printer that the navy outline is the cut line. Keep all text inside the safe area: check the notch between the roots and the top dip.
3. Background: white centre radial gradient to light blue (#E2EBF9 → #B5CAEC) at the edges, a soft diagonal sheen and a white curved highlight line, matching the owner's original look.
4. Text: Playfair Display 700 for the English name, Noto Naskh Arabic 700 for the Arabic name, Montserrat 700 for numbers/emails/website, Noto Kufi Arabic 700 for Arabic/Kurdish addresses. Curved phone line with `<textPath>` on a quadratic arc. Icon + text rows are centred by a small script (`getBBox`) that runs after `document.fonts.ready` and sets `body[data-ok]`; wait for that before printing.
5. QR in a navy ring with circular text (`textPath` on two half-circle arcs): "SCAN ME · امسح الرمز" on top, "www.doctorsaleem.com" at the bottom. Regenerate the QR with segno; decode-check the final PNG with OpenCV. Correct spelling mistakes from the old picture (e.g. "SCAH ME").
6. Render: Playwright `page.pdf({width:'66mm',height:'78mm',printBackground:true,preferCSSPageSize:true})`; PNGs per side at about 900 dpi (`deviceScaleFactor` ≈ 9.3) for preview/printers that want images.

## Dr. Saleem's card content (current)
- Front: logo; Dr. Saleem Andraws; د. سليم أندراوس; arched 0750 781 6500 • 0778 166 5000 with phone icon; B.D.S. • M.Sc. Oral Radiology.
- Back: QR ring (https://www.doctorsaleem.com/links, the owner wants the ORIGINAL QR look kept); WWW.DOCTORSALEEM.COM; one email line (was dr.saleemo@gmail.com; now info@doctorsaleem.com or clinic@doctorsaleem.com); phones; دهوك - كي ار او - فوق جرزات شيركو; Kurdish دهوك كي ار او سەر جرزاتێ شيركو.

## Delivery
Send the PDF and both PNGs, save sources in `print/`, push. Remind: die-cut along the navy outline, print at actual size.
