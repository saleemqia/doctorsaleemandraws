# doctorsaleem.com — instructions for Claude

Start by reading `docs/HANDOFF.md` (accounts, IDs, features, open items) and `docs/clinic-website-guide.md` (how each part works). Skills for this work are in `docs/SKILL-dental-clinic-website.md` and `docs/skills/`.

- Owner: Dr. Saleem Andraws (dr.saleemo@gmail.com), dentist in Duhok. Reply in his language (Arabic or English), briefly; he approves with short answers.
- Push to `main` deploys (Cloudflare Pages `doctorsaleem-site`). Verify: `npx tsc --noEmit -p tsconfig.app.json`, `npx eslint <files>`, `npx vite build`; test /clinic locally with `npx wrangler pages dev dist --port 8799 --d1 DB=localtest`; check the live site after deploying.
- Never put keys, secrets, the PIN or patient data in the repo or in chat. Never type passwords/secrets into web forms; the owner pastes them himself. Ask before accepting agreements or changing account settings he did not ask for.
- Every visible text in three languages (en, ar, ku). Medical wording cautious, never a diagnosis.
- Print materials live in `print/`; when the owner sends a finished design and asks a small change, edit only that (don't redesign).
- Dr. Sally's site (drsallycare.com) is a different repo: hercules84/drsallycare.
