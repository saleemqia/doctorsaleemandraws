// Gives every page its own title, description, canonical and language links in the HTML that is sent,
// so Google and social networks see them without running the page's scripts (the app sets the same values again in the browser).
import { SEO, pageSeo, pageUrl, parsePath, type BasePage, type SeoLanguage, type SitePage } from "../src/config/seo";
import { serviceBySlug } from "../src/config/services";

const NAMES: Record<BasePage, Record<SeoLanguage, string>> = {
  "": { en: "Home", ar: "الرئيسية", ku: "سەرەکی" },
  "/case": { en: "Digital implant case", ar: "حالة زراعة رقمية", ku: "حالەتا چاندنا دیجیتالی" },
  "/kids": { en: "Children's teeth", ar: "أسنان الأطفال", ku: "ددانێن زارۆکان" },
  "/treatments": { en: "How treatments are done", ar: "كيف يتم علاج الأسنان", ku: "چارەسەری چاوا دئێتە کرن" },
  "/infographics": { en: "Infographics", ar: "إنفوجرافيك", ku: "ئینفۆگرافیک" },
  "/news": { en: "Dental news", ar: "أخبار الأسنان", ku: "هەوالێن ددانان" },
  "/services": { en: "Services", ar: "الخدمات", ku: "خزمەتگوزاری" },
};

const ld = (o: unknown) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

// Breadcrumbs (Home > Services > Dental implants) and, on a treatment page, what the treatment is and its question and answer.
const structuredData = (lang: SeoLanguage, page: SitePage) => {
  if (!page) return "";
  const svc = page.startsWith("/services/") ? serviceBySlug(page.slice(10)) : undefined;
  const trail: { name: string; item: string }[] = [{ name: NAMES[""][lang], item: pageUrl(lang, "") }];
  if (svc) trail.push({ name: NAMES["/services"][lang], item: pageUrl(lang, "/services") }, { name: svc.name[lang], item: pageUrl(lang, page) });
  else trail.push({ name: NAMES[page as BasePage][lang], item: pageUrl(lang, page) });
  let out = ld({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.item })),
  });
  if (svc) {
    out += ld({
      "@context": "https://schema.org", "@type": "MedicalProcedure",
      name: svc.name[lang], description: svc.description[lang], url: pageUrl(lang, page),
      alternateName: svc.search[lang].split(/,|،/).map((x) => x.trim()).filter(Boolean),
    });
    out += ld({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: svc.q[lang], acceptedAnswer: { "@type": "Answer", text: svc.a[lang] } }],
    });
  }
  return out;
};

export const onRequest: PagesFunction = async ({ request, next }) => {
  const res = await next();
  const url = new URL(request.url);
  const parsed = request.method === "GET" ? parsePath(url.pathname) : null;
  if (!parsed || !(res.headers.get("Content-Type") || "").includes("text/html")) return res;

  const { lang, page } = parsed;
  const s = page ? { ...SEO[lang], ...pageSeo(page)[lang] } : SEO[lang];
  const here = pageUrl(lang, page);
  const crumbs = structuredData(lang, page);

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
  return rw.transform(res);
};
