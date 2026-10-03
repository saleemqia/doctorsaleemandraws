// Search-engine settings for each language version of the home page.
// Each language has its own address (/, /ar, /ku) so Google can index all three.

export type SeoLanguage = "en" | "ar" | "ku";

const SITE = "https://www.doctorsaleem.com";

export const LANGUAGE_PATHS: Record<SeoLanguage, string> = {
  en: "/",
  ar: "/ar",
  ku: "/ku",
};

export const SEO: Record<SeoLanguage, { title: string; description: string; locale: string; htmlLang: string }> = {
  en: {
    title: "Dentist in Duhok | Dental Clinic, Implants & Veneers | Dr. Saleem Andraws",
    description:
      "Dr. Saleem Andraws Dental Clinic, a dentist in Duhok, Kurdistan, Iraq: dental implants, veneers and Hollywood smile, orthodontics (braces), fillings, root canal treatment, zircon and E-max crowns, whitening and children's dentistry. Qazi Mohammad Road. Call 0750 781 6500.",
    locale: "en_US",
    htmlLang: "en",
  },
  ar: {
    title: "طبيب أسنان في دهوك | زراعة وتقويم وفينير | عيادة د. سليم أندراوس",
    description:
      "عيادة الدكتور سليم أندراوس لطب الأسنان في دهوك: زراعة الأسنان، فينير وابتسامة هوليود، تقويم الأسنان، حشو الأسنان، حشو العصب، تيجان (كراس) زركون وإيماكس، تبييض وطب أسنان الأطفال. شارع قاضي محمد. للحجز 07507816500",
    locale: "ar_IQ",
    htmlLang: "ar",
  },
  ku: {
    title: "دکتورێ ددانا ل دهوکێ | چاندنا ددانا، حەشو، کراس | د. سەلیم ئەندراوس",
    description:
      "کلینیکا ددانا یا دکتۆر سەلیم ئەندراوس ل دهوکێ: چاندنا ددانا، ڤینیر و بزەیا هۆلیوود، ڕێکخستنا ددانا (تقویم)، حەشوا ددانا، حەشوا دەمارێ، کراسێن زیرکۆن و ئیماکس، سپیکرنا ددانا و ددانێن زارۆکان. شەقامێ قازی محەمەد. 07507816500",
    locale: "ku_IQ",
    htmlLang: "ku",
  },
};

// Pages of the site. "" is the home page; the others are sub-pages, each in 3 languages:
// /case, /ar/case, /ku/case and /kids, /ar/kids, /ku/kids.
export type SitePage = "" | "/case" | "/kids";
const PAGES: SitePage[] = ["", "/case", "/kids"];

export const parsePath = (pathname: string): { lang: SeoLanguage; page: SitePage } | null => {
  let lang: SeoLanguage = "en";
  let rest = pathname;
  if (pathname === "/ar" || pathname.startsWith("/ar/")) { lang = "ar"; rest = pathname.slice(3); }
  else if (pathname === "/ku" || pathname.startsWith("/ku/")) { lang = "ku"; rest = pathname.slice(3); }
  rest = rest.replace(/\/+$/, "");
  return (PAGES as string[]).includes(rest) ? { lang, page: rest as SitePage } : null;
};

// Address of a page in a language: pathFor("ar", "/case") = "/ar/case", pathFor("en", "") = "/".
export const pathFor = (lang: SeoLanguage, page: SitePage = "") =>
  lang === "en" ? page || "/" : `/${lang}${page}`;

export const pageUrl = (lang: SeoLanguage, page: SitePage = "") => `${SITE}${pathFor(lang, page)}`;

export const languageFromPath = (pathname: string): SeoLanguage | null => parsePath(pathname)?.lang ?? null;

const PAGE_SEO: Record<"/case" | "/kids", Record<SeoLanguage, { title: string; description: string }>> = {
  "/case": {
    en: { title: "Digital Implant Case & 3D Scanning | Dr. Saleem Andraws, Duhok", description: "A real dental implant case step by step: CBCT, digital implant planning, surgical guide and the final result. Plus videos of 3D intraoral scanning at our clinic in Duhok." },
    ar: { title: "حالة زراعة رقمية والمسح ثلاثي الأبعاد | د. سليم أندراوس، دهوك", description: "حالة زراعة أسنان حقيقية خطوة بخطوة: أشعة ثلاثية الأبعاد، تخطيط رقمي للزراعة، دليل جراحي والنتيجة النهائية، مع فيديوهات المسح الضوئي في عيادتنا في دهوك." },
    ku: { title: "حالەتا چاندنا دیجیتالی و سکانا ٣D | د. سەلیم ئەندراوس، دهوک", description: "حالەتەکا چاندنا ددانا یا ڕاستەقینە قۆناغ ب قۆناغ: تیشکا ٣D، پلاندانانا دیجیتالی، ڕێبەرێ نەشتەرگەری و ئەنجام، دگەل ڤیدیۆیێن سکانا ٣D ل کلینیکا مە ل دهوکێ." },
  },
  "/kids": {
    en: { title: "Children's Teeth Guide for Parents | Dr. Saleem Andraws, Duhok", description: "When baby teeth come in and fall out, when permanent teeth arrive, care by age, tips for parents and dental emergencies, plus colourful posters for kids." },
    ar: { title: "دليل أسنان الأطفال للأهل | د. سليم أندراوس، دهوك", description: "متى تظهر الأسنان اللبنية ومتى تسقط، ومتى تظهر الأسنان الدائمة، والعناية في كل عمر، ونصائح للأهل والحالات الطارئة، مع ملصقات توعوية ملونة للأطفال." },
    ku: { title: "ڕێبەرێ ددانێن زارۆکان بۆ دەیک و بابان | د. سەلیم ئەندراوس، دهوک", description: "ددانێن شیری کەنگی دەردکەڤن و دکەڤن، ددانێن هەمیشەیی، چاڤدێری د هەر تەمەنەکی دا، شیرەت و حالەتێن لەز، دگەل پۆستەرێن ڕەنگین بۆ زارۆکان." },
  },
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

// Keeps the browser tab title, description and canonical link in sync with the shown language.
export const applySeo = (lang: SeoLanguage, page: SitePage = "") => {
  const s = page ? { ...SEO[lang], ...PAGE_SEO[page][lang] } : SEO[lang];
  document.title = s.title;
  setMeta('meta[name="description"]', "content", s.description);
  setMeta('meta[property="og:title"]', "content", s.title);
  setMeta('meta[property="og:description"]', "content", s.description);
  setMeta('meta[property="og:url"]', "content", pageUrl(lang, page));
  setMeta('meta[property="og:locale"]', "content", s.locale);
  setMeta('meta[name="twitter:title"]', "content", s.title);
  setMeta('meta[name="twitter:description"]', "content", s.description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", pageUrl(lang, page));
  // Language versions of this same page.
  for (const l of ["en", "ar", "ku"] as SeoLanguage[]) {
    setMeta(`link[rel="alternate"][hreflang="${l}"]`, "href", pageUrl(l, page));
  }
  setMeta('link[rel="alternate"][hreflang="x-default"]', "href", pageUrl("en", page));
};
