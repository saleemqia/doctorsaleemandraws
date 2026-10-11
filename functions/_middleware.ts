// Gives every page its own title, description, canonical and language links in the HTML that is sent,
// so Google and social networks see them without running the page's scripts (the app sets the same values again in the browser).
import { PAGE_SEO, PAGES, SEO, pageUrl, parsePath, type SeoLanguage, type SitePage } from "../src/config/seo";

const NAMES: Record<SitePage, Record<SeoLanguage, string>> = {
  "": { en: "Home", ar: "الرئيسية", ku: "سەرەکی" },
  "/case": { en: "Digital implant case", ar: "حالة زراعة رقمية", ku: "حالەتا چاندنا دیجیتالی" },
  "/kids": { en: "Children's teeth", ar: "أسنان الأطفال", ku: "ددانێن زارۆکان" },
  "/treatments": { en: "How treatments are done", ar: "كيف يتم علاج الأسنان", ku: "چارەسەری چاوا دئێتە کرن" },
  "/infographics": { en: "Infographics", ar: "إنفوجرافيك", ku: "ئینفۆگرافیک" },
  "/news": { en: "Dental news", ar: "أخبار الأسنان", ku: "هەوالێن ددانان" },
};

export const onRequest: PagesFunction = async ({ request, next }) => {
  const res = await next();
  const url = new URL(request.url);
  const parsed = request.method === "GET" ? parsePath(url.pathname) : null;
  if (!parsed || !(res.headers.get("Content-Type") || "").includes("text/html")) return res;

  const { lang, page } = parsed;
  const s = page ? { ...SEO[lang], ...PAGE_SEO[page as Exclude<SitePage, "">][lang] } : SEO[lang];
  const here = pageUrl(lang, page);
  const crumbs = page
    ? `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: NAMES[""][lang], item: pageUrl(lang, "") },
          { "@type": "ListItem", position: 2, name: NAMES[page][lang], item: here },
        ],
      }).replace(/</g, "\\u003c")}</script>`
    : "";

  const setContent = (v: string) => ({ element(e: Element) { e.setAttribute("content", v); } });
  let rw = new HTMLRewriter()
    .on("html", { element(e) { e.setAttribute("lang", SEO[lang].htmlLang); if (lang !== "en") e.setAttribute("dir", "rtl"); } })
    .on("title", { element(e) { e.setInnerContent(s.title); } })
    .on('meta[name="description"]', setContent(s.description))
    .on('meta[property="og:title"]', setContent(s.title))
    .on('meta[property="og:description"]', setContent(s.description))
    .on('meta[property="og:url"]', setContent(here))
    .on('meta[property="og:locale"]', setContent(SEO[lang].locale))
    .on('meta[name="twitter:title"]', setContent(s.title))
    .on('meta[name="twitter:description"]', setContent(s.description))
    .on("head", { element(e) { e.append(`<link rel="canonical" href="${here}" />${crumbs}`, { html: true }); } });
  for (const l of ["en", "ar", "ku"] as SeoLanguage[]) {
    rw = rw.on(`link[rel="alternate"][hreflang="${l}"]`, { element(e) { e.setAttribute("href", pageUrl(l, page)); } });
  }
  rw = rw.on('link[rel="alternate"][hreflang="x-default"]', { element(e) { e.setAttribute("href", pageUrl("en", page)); } });
  void PAGES;
  return rw.transform(res);
};
