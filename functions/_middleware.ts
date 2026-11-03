// Gives every page its own title, description, canonical and language links in the HTML that is sent,
// so Google and social networks see them without running the page's scripts (the app sets the same values again in the browser).
import { SEO, pageSeo, pageUrl, parsePath, type BasePage, type SeoLanguage, type SitePage } from "../src/config/seo";
import { serviceBySlug } from "../src/config/services";
import { EXTRA_PAGES } from "../src/config/extraPages";
import { DETAILS } from "../src/config/serviceDetails";
import { socialBySlug } from "../src/config/social";

const NAMES: Record<BasePage, Record<SeoLanguage, string>> = {
  ...Object.fromEntries(EXTRA_PAGES.map(p=>[p.path,p.title])) as Record<BasePage,Record<SeoLanguage,string>>,
  "": { en: "Home", ar: "الرئيسية", ku: "سەرەکی" },
  "/case": { en: "Digital implant case", ar: "حالة زراعة رقمية", ku: "حالەتا چاندنا دیجیتالی" },
  "/kids": { en: "Children's teeth", ar: "أسنان الأطفال", ku: "ددانێن زارۆکان" },
  "/treatments": { en: "How treatments are done", ar: "كيف يتم علاج الأسنان", ku: "چارەسەری چاوا دئێتە کرن" },
  "/infographics": { en: "Infographics", ar: "إنفوجرافيك", ku: "ئینفۆگرافیک" },
  "/news": { en: "Dental news", ar: "أخبار الأسنان", ku: "هەوالێن ددانان" },
  "/services": { en: "Services", ar: "الخدمات", ku: "خزمەتگوزاری" },
  "/social": { en: "Social media", ar: "مواقع التواصل", ku: "تۆڕێن جڤاکی" },
};

const ld = (o: unknown) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

// Breadcrumbs (Home > Services > Dental implants) and, on a treatment page, what the treatment is and its question and answer.
const structuredData = (lang: SeoLanguage, page: SitePage) => {
  if (!page) return "";
  const svc = page.startsWith("/services/") ? serviceBySlug(page.slice(10)) : undefined;
  const trail: { name: string; item: string }[] = [{ name: NAMES[""][lang], item: pageUrl(lang, "") }];
  const so = page.startsWith("/social/") ? socialBySlug(page.slice(8)) : undefined;
  if (so) trail.push({ name: NAMES["/social"][lang], item: pageUrl(lang, "/social") }, { name: so.name, item: pageUrl(lang, page) });
  else if (svc) trail.push({ name: NAMES["/services"][lang], item: pageUrl(lang, "/services") }, { name: svc.name[lang], item: pageUrl(lang, page) });
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

// Old addresses Google still knows (e.g. /home/ from the previous site) go to the right page instead of showing a copy of it.
const OLD: Record<string, string> = { "/home": "/", "/ar/home": "/ar", "/ku/home": "/ku", "/index.html": "/" };

const HOME_SUMMARY = {
  ar: `<h1>عيادة الدكتور سليم اندراوس حنا — طبيب أسنان في دهوك</h1><p>زراعة الأسنان، الفينير وابتسامة هوليود، تقويم الأسنان، حشو الأسنان وعلاج العصب، التيجان، التبييض وطب أسنان الأطفال.</p><p>بكالوريوس طب الأسنان من جامعة بغداد عام ٢٠٠٧، وماجستير أشعة الفم والأسنان في دهوك عام ٢٠٢٣، وعضو نقابة أطباء أسنان كوردستان فرع دهوك منذ ٢٠١٤.</p><p>شارع قاضي محمد، بناية جرزات شيركو، الطابق الأول، مقابل صيدلية هناسة. الدوام السبت إلى الخميس، ٣–٩ مساءً؛ الجمعة مغلق. تتوفر مواقف مجانية ومدفوعة، وحوالي ٢٠ درجة قبل الوصول إلى المصعد.</p><p><a href="tel:07507816500">0750 781 6500</a> · <a href="tel:07781665000">0778 166 5000</a></p>`,
  ku: `<h1>کلینیکا ددانا یا د. سليم اندراوس حنا — دکتورێ ددانا ل دهوکێ</h1><p>چاندنا ددانا، ڤینیر و بزەیا هۆلیوود، تقویم، حەشوا ددانا و دەمارێ، کراس، سپیکرنا ددانا و چاڤدێریا ددانێن زارۆکان.</p><p>بەکالۆریۆس ل زانکۆیا بەغدا، ٢٠٠٧؛ ماستەر ل تیشکێن دەڤ و ددانان، دهوک، ٢٠٢٣؛ ئەندامێ سەندیکایا دکتورێن ددانا یا کوردستانێ، لقێ دهوکێ ژ ٢٠١٤ـێ ڤە.</p><p>شەقامێ قازی محەمەد، بینایێ شیرکۆ، قاتێ ئێکێ، بەرامبەر دەرمانخانا هەناسا. شەمبی هەتا پێنجشەمبی، ٣–٩ ئێڤاری؛ ئینی گرتیە. پارکینگێ بێبها و ب پارە هەیە؛ نێزیکی ٢٠ پەیژە بەری ئاسانسۆری هەنە.</p><p><a href="tel:07507816500">0750 781 6500</a> · <a href="tel:07781665000">0778 166 5000</a></p>`,
};

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const old = OLD[url.pathname.replace(/\/+$/, "") || "/"];
  if (old && request.method === "GET") return Response.redirect(`${url.origin}${old}`, 301);
  const res = await next();
  const parsed = request.method === "GET" || request.method === "HEAD" ? parsePath(url.pathname) : null;
  const isHtml = (res.headers.get("Content-Type") || "").includes("text/html");
  if (!parsed && isHtml && res.ok && /^(GET|HEAD)$/.test(request.method) && !/^\/(?:clinic|p|api|privacy|links|admin|login|versions|\.lovable)(?:\/|$)/.test(url.pathname)) {
    const lang = /^\/ar(?:\/|$)/.test(url.pathname) ? "ar" : /^\/ku(?:\/|$)/.test(url.pathname) ? "ku" : "en";
    const text = { en: ["Page not found", "Return to the clinic homepage", "/"], ar: ["الصفحة غير موجودة", "العودة إلى الصفحة الرئيسية", "/ar"], ku: ["لاپەڕە نەهاتە دیتن", "ڤەگەڕ بۆ لاپەڕەیا سەرەکی", "/ku"] }[lang];
    const body = `<!doctype html><html lang="${lang}" dir="${lang === "en" ? "ltr" : "rtl"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${text[0]}</title></head><body><main><h1>404 — ${text[0]}</h1><p><a href="${text[2]}">${text[1]}</a></p></main></body></html>`;
    return new Response(request.method === "HEAD" ? null : body, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } });
  }
  if (!parsed || !isHtml) return res;

  const { lang, page } = parsed;
  const s = page ? { ...SEO[lang], ...pageSeo(page)[lang] } : SEO[lang];
  const here = pageUrl(lang, page);
  const crumbs = structuredData(lang, page);
  const svc = page.startsWith("/services/") ? serviceBySlug(page.slice(10)) : undefined;
  const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const extra = EXTRA_PAGES.find(x=>x.path===page);
  const detail = svc ? DETAILS[svc.slug] : undefined;
  // Visitors and crawlers without JavaScript receive the same treatment explanation as the app.
  const treatmentHtml = svc ? `<h1>${esc(svc.name[lang])} — ${lang === "en" ? "Dr. Saleem Andraws, Duhok" : lang === "ar" ? "د. سليم أندراوس، دهوك" : "د. سەلیم ئەندراوس، دهوک"}</h1><p>${esc(detail?.what[lang] || svc.a[lang])}</p><h2>${esc(svc.q[lang])}</h2><p>${esc(svc.a[lang])}</p>${detail ? `<ul>${detail.who.map(x => `<li>${esc(x[lang])}</li>`).join("")}</ul>` : ""}<p>${lang === "en" ? "Treatment costs and the number of visits depend on your individual examination and plan. Ask Dr. Saleem about the proposed options before treatment." : lang === "ar" ? "تعتمد التكلفة وعدد الزيارات على الفحص والخطة الفردية. اسأل الدكتور سليم عن الخيارات قبل العلاج." : "بها و ژمارەیا سەردانان ل دویڤ پشکنین و پلانێ تە نە."}</p><p><a href="${pageUrl(lang, "") }#contact">${lang === "en" ? "Location, access and booking" : lang === "ar" ? "الموقع والوصول والحجز" : "جهـ، گەهشتن و حجز"}</a> · <a href="tel:07507816500">0750 781 6500</a></p>` : "";

  const setContent = (v: string) => ({ element(e: Element) { e.setAttribute("content", v); } });
  let rw = new HTMLRewriter()
    .on("html", { element(e) { e.setAttribute("lang", SEO[lang].htmlLang); if (lang !== "en") e.setAttribute("dir", "rtl"); } })
    .on("title", { element(e) { e.setInnerContent(s.title); } })
    .on("#root > main", { element(e) { if (!page && lang !== "en") e.setInnerContent(HOME_SUMMARY[lang], { html: true }); else if (svc) e.setInnerContent(treatmentHtml, { html: true }); else if(extra && !["/about", "/faq", "/opening-hours", "/duhok"].includes(page)) e.setInnerContent(`<h1>${esc(extra.title[lang])}</h1><p>${esc(extra.description[lang])}</p><p><a href="${pageUrl(lang, "")}#contact">Dr. Saleem Andraws · 0750 781 6500</a></p>`, {html:true}); } })
    .on('meta[name="description"]', setContent(s.description))
    .on('meta[property="og:title"]', setContent(s.title))
    .on('meta[property="og:description"]', setContent(s.description))
    .on('meta[property="og:url"]', setContent(here))
    .on('meta[property="og:locale"]', setContent(SEO[lang].locale))
    .on('meta[name="twitter:title"]', setContent(s.title))
    .on('meta[name="twitter:description"]', setContent(s.description))
    .on('link[rel="canonical"]', { element(e) { e.remove(); } })
    .on("head", { element(e) { e.append(`<link rel="canonical" href="${here}" />${crumbs}`, { html: true }); } });
  if (url.searchParams.has("previewDesign")) rw = rw.on("head", { element(e) { e.append('<meta name="robots" content="noindex, nofollow">', { html: true }); } });
  for (const l of ["en", "ar", "ku"] as SeoLanguage[]) {
    rw = rw.on(`link[rel="alternate"][hreflang="${l}"]`, { element(e) { e.setAttribute("href", pageUrl(l, page)); } });
  }
  rw = rw.on('link[rel="alternate"][hreflang="x-default"]', { element(e) { e.setAttribute("href", pageUrl("en", page)); } });
  return rw.transform(res);
};
