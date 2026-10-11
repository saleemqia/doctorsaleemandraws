// GET /api/dental-news → latest dentistry headlines from a few public news feeds (English), newest first.
// Only headline, short excerpt, date and a link back to the source are shown; nothing is copied in full.
// The answer is cached for an hour, so the site makes at most a few feed requests per hour. No database is used.

const FEEDS = [
  { id: "Dentistry.co.uk", url: "https://www.dentistry.co.uk/feed/", host: "dentistry.co.uk", kind: "clinic" },
  { id: "Dentistry Today", url: "https://www.dentistrytoday.com/feed/", host: "dentistrytoday.com", kind: "clinic" },
  { id: "News-Medical", url: "https://www.news-medical.net/tag/feed/Dentistry.aspx", host: "news-medical.net", kind: "research" },
  { id: "ScienceDaily", url: "https://www.sciencedaily.com/rss/health_medicine/dentistry.xml", host: "sciencedaily.com", kind: "research" },
];

// News-Medical and ScienceDaily also carry general medicine under their dentistry tags: keep only dental stories.
const DENTAL = /\b(dent|tooth|teeth|oral\b|gum\b|gums\b|gingiv|periodon|enamel|jaw|maxillo|orthodon|implant|caries|cavit|mouth|endodon|root canal|saliva|molar|veneer|bruxism|fluorid|orofacial|craniofacial)/i;

interface Item { title: string; link: string; source: string; kind: string; date: string; excerpt: string }

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…" };
const decode = (s: string) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const text = (s: string) => decode(s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const tag = (block: string, name: string) => { const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };

function parse(xml: string, f: (typeof FEEDS)[number]): Item[] {
  const out: Item[] = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const b = m[0], title = text(tag(b, "title")), link = text(tag(b, "link")), t = Date.parse(text(tag(b, "pubDate")));
    let host = ""; try { const u = new URL(link); host = u.protocol === "https:" ? u.hostname.replace(/^www\./, "") : ""; } catch { /* bad link */ }
    if (!title || title.length < 12 || !host.endsWith(f.host) || Number.isNaN(t)) continue;
    if (f.kind === "research" && !DENTAL.test(title + " " + text(tag(b, "description")))) continue;
    let ex = text(tag(b, "description")).replace(/\s*The post .{0,200}? appeared first on .*$/i, "").replace(/\s*The post appeared first\.?.*$/i, "").replace(/\s*Read more.*$/i, "").trim();
    if (ex.length > 170) ex = ex.slice(0, 170).replace(/\s+\S*$/, "") + "…";
    out.push({ title: title.slice(0, 180), link, source: f.id, kind: f.kind, date: new Date(t).toISOString(), excerpt: ex });
  }
  return out;
}

export const onRequestGet: PagesFunction = async ({ request, waitUntil }) => {
  const cache = (caches as unknown as { default: Cache }).default, key = new Request(new URL("/api/dental-news?v=4", request.url).toString());
  const hit = await cache.match(key); if (hit) return hit;
  const lists = await Promise.all(FEEDS.map(async (f) => {
    try { const r = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; doctorsaleem.com news reader)", Accept: "application/rss+xml, application/xml, text/xml, */*" }, cf: { cacheTtl: 1800 } } as RequestInit); return r.ok ? parse(await r.text(), f) : []; } catch { return []; }
  }));
  const seen = new Set<string>(), items = lists.flat().sort((a, b) => b.date.localeCompare(a.date)).filter((i) => { const k = i.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
  // keep the mix balanced: at most 7 from one source among the latest 21
  const per: Record<string, number> = {}, picked = items.filter((i) => (per[i.source] = (per[i.source] || 0) + 1) <= 7).slice(0, 21);
  const res = new Response(JSON.stringify({ ok: picked.length > 0, items: picked }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": picked.length ? "public, max-age=900, s-maxage=3600" : "public, max-age=60" },
  });
  if (picked.length) waitUntil(cache.put(key, res.clone()));
  return res;
};
