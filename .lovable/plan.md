# Clinic location, reviews, booking, and SEO fixes

## Scope
- Replace every old clinic address and map reference with the supplied Qazi Mohammad Road address, coordinates, and Google listing in English, Arabic, and Kurdish.
- Update the Contact section with the responsive map and both requested map actions; make the Footer address open the listing.
- Remove fabricated ratings and testimonials. Keep one clearly marked empty real-review array and show localized Google review actions until real entries are added.
- Replace the splash sound and emoji with the clinic logo, shorten it below one second, and bypass it for reduced-motion users.
- Remove advertised prices and the price shortcut. Price questions will receive a localized case-dependent consultation response; hours and location replies will be corrected.
- Remove the public page-export feature and its now-unused dependency.
- Make WhatsApp open immediately when booking, preserve the form on save errors, and reject Fridays with localized feedback.
- Point canonical, social, structured data, robots, sitemap, and clinic image references to `https://www.doctorsaleem.com`.

## Technical details
- Preserve the current React/Tailwind design system and existing language direction handling.
- Use the supplied static Google Maps embed URL; no Maps API key or connector is required.
- Keep the database save after WhatsApp navigation is initiated, so clinic delivery does not depend on storage success.
- Add only the homepage to the sitemap because it is the sole public indexable content route; omit login, admin, OAuth consent, and catch-all pages.
- Verify obsolete strings are absent, the app builds, and desktop/mobile English and RTL views render without overlap.
