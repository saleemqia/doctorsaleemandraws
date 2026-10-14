---
name: "clinic-rx-pad"
description: "Create or change a print-ready prescription (Rx) pad PDF for Dr. Saleem Andraws' clinic or any doctor, with clear Arabic/Kurdish/English fonts and vector logo."
---

# Rx pad (prescription sheet)

Reference build: repo saleemqia/doctorsaleemandraws, folder `print/` (`rx.html`, `logo.svg`, `qr.svg`, `f/` fonts, `build.cjs`). Start from `print/rx.html` when it exists; otherwise rebuild with the method below.

## Method (vector, never upscale a picture)
1. If the owner sends a picture of an existing Rx, rebuild it as HTML/SVG instead of upscaling: every text becomes real text, the logo becomes vector.
2. Logo to vector: crop the largest copy of the logo from the picture (a faint watermark copy works well), take the colour difference from the background, upscale 3x (cubic) + slight blur, threshold, then trace with Python `potracer` (`potrace.Bitmap(~mask).trace(turdsize=40, opticurve=True)`), write one SVG path with `fill="currentColor"`. Render and check it.
3. QR: decode the old QR with OpenCV `cv2.QRCodeDetector()` (try the crop at 1x/2x), then regenerate it with `segno` as SVG (`shape-rendering="crispEdges"`). Check it decodes from the final PNG.
4. Fonts (from npm @fontsource, copy the woff2 files next to the HTML): Noto Naskh Arabic 700 for the Arabic doctor name; Noto Kufi Arabic 500/700 for Arabic/Kurdish labels, specialty, address (very clear in print; supports Kurdish ە ێ ۆ ڕ); Playfair Display 700 for the English name and "Rx"; Montserrat 500/700 for English text and numbers. Add 'Mont' as fallback after 'Kufi' so Latin digits never fall back to a system font (check `pdffonts`: no Liberation/DejaVu).
5. Layout in mm on an A4 page (`@page{size:A4;margin:0}`, body 210mm × 296.8mm so it stays one page): header band (English left, logo centre, Arabic right, Kurdish line under the logo), patient fields (name, age, date, gender with dotted lines), Rx box with a faint logo watermark (opacity about .05) and a signature line, registration line, footer band with QR, phones, website, emails, address, hours. Use `print-color-adjust:exact`.
6. Render with Playwright Chromium: `page.pdf({width:'210mm',height:'297mm',printBackground:true,preferCSSPageSize:true})`, plus a 300 dpi PNG (`deviceScaleFactor: 300/96`). Check: `pdfinfo` 1 page A4, `pdffonts` all embedded, look at the PNG.
7. When the owner wants a line longer without changing its length, measure the text width in the browser and scale that line's font-size to keep the same width; say that the letters became slightly smaller and offer an abbreviation instead.

## Dr. Saleem's Rx content (current)
- English: Dr. Saleem Andraws · B.D.S. — University of Baghdad, 2007 · M.Sc. Oral Radiology · University of Duhok, 2023 (all bold).
- Arabic: د. سليم أندراوس · بكالوريوس طب وجراحة الفم والأسنان · أخصائي أشعة الفم والوجه والفكين. Kurdish under the logo (17.5pt): نوژدارا ددانا تایبەتمەند.
- Registration: Kurdish ژمارا تۆمارکرنێ: 933 · ڕێکەفت: 15 نیسانا 2009 and Arabic رقم التسجيل: 933 · بتاريخ 15 نيسان 2009.
- Footer: phones 0750 781 6500 • 0778 166 5000 (bold) with WhatsApp, Telegram, Viber icons; www.doctorsaleem.com (bold); clinic@doctorsaleem.com, info@doctorsaleem.com; address دهوك - شارع قاضي محمد - بناية جرزات شيركو، الطابق الأول - مقابل صيدلية هناسة; hours الدوام يوميًا ٣:٠٠ – ٩:٠٠ مساءً (عدا الجمعة); QR to https://www.doctorsaleem.com/links.
- Style: no top blue line; light-blue curved header; Rx box almost white (#FFFFFD) with a beige border; navy #1B2A5E, blue #1F6FD1, gold #C29A4A.

## Delivery
Send the PDF and the 300 dpi PNG with SendUserFile, save sources in `print/` and push. Tell the owner to print at 100% / actual size. Translations into Kurdish are drafts: ask the owner to check the wording.