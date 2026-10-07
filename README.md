# drsallycare.com

Static site for Dr. Sally Rizqo (child & adolescent mental health, online). Cloudflare Pages project `drsallycare` deploys this branch (`drsallycare`) with no build step, output directory `/`.

## Structure
- `index.html` home, `autism/`, `adhd/`, `adolescence/` topic pages (Families / Teachers / Researchers), `play/` games
- `assets/site.js` shared header, footer, language switch (ar / ku / en), WhatsApp number setting
- `assets/topic.js` topic page template, `assets/site.css` styles, `assets/logo-mark.png` logo mask

## Before launch
Set `WHATSAPP_NUMBER` in `assets/site.js`, fill every bracketed placeholder, get Kurdish reviewed, then remove `robots.txt` Disallow, the `noindex` meta tags and the `X-Robots-Tag` header in `_headers`.
