import { EXTRA_PAGES, type ExtraPagePath } from "./extraPages";
import { SERVICES, serviceBySlug } from "./services";
import { SOCIALS, SOCIAL_INDEX, socialBySlug, socialTitle } from "./social";

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
    title: "Dr. Saleem Andraws — Dentist in Duhok | Dental Clinic",
    description:
      "Dr. Saleem Andraws Dental Clinic, a dentist in Duhok, Kurdistan, Iraq: dental implants, veneers and Hollywood smile, orthodontics (braces), fillings, root canal treatment, zircon and E-max crowns, whitening and children's dentistry. Qazi Mohammad Road. Call 0750 781 6500.",
    locale: "en_US",
    htmlLang: "en",
  },
  ar: {
    title: "د. سليم أندراوس — طبيب أسنان في دهوك | زراعة وفينير وتقويم",
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
// "/services" lists all treatments; "/services/<slug>" is one treatment (see services.ts).
export type BasePage = ExtraPagePath | "" | "/case" | "/kids" | "/treatments" | "/infographics" | "/news" | "/services" | "/social";
export type SitePage = BasePage | `/services/${string}` | `/social/${string}`;
export const PAGES: SitePage[] = [...EXTRA_PAGES.map(p=>p.path), "", "/case", "/kids", "/treatments", "/infographics", "/news", "/services", ...SERVICES.map((s) => `/services/${s.slug}` as SitePage), "/social", ...SOCIALS.map((s) => `/social/${s.slug}` as SitePage)];

export const parsePath = (pathname: string): { lang: SeoLanguage; page: SitePage } | null => {
  let lang: SeoLanguage = "en";
  let rest = pathname;
  if (pathname === "/ar" || pathname.startsWith("/ar/")) { lang = "ar"; rest = pathname.slice(3); }
  else if (pathname === "/ku" || pathname.startsWith("/ku/")) { lang = "ku"; rest = pathname.slice(3); }
  rest = rest.replace(/\/+$/, "");
  return (PAGES as string[]).includes(rest) ? { lang, page: rest as SitePage } : null;
};

// Treatment page address for a language: servicePath("ar", "dental-implants") = "/ar/services/dental-implants".
export const servicePath = (lang: SeoLanguage, slug: string) => pathFor(lang, `/services/${slug}`);

// Address of a page in a language: pathFor("ar", "/case") = "/ar/case", pathFor("en", "") = "/".
export const pathFor = (lang: SeoLanguage, page: SitePage = "") =>
  lang === "en" ? page || "/" : `/${lang}${page}`;

export const pageUrl = (lang: SeoLanguage, page: SitePage = "") => `${SITE}${pathFor(lang, page)}`;

export const languageFromPath = (pathname: string): SeoLanguage | null => parsePath(pathname)?.lang ?? null;

type PageText = Record<SeoLanguage, { title: string; description: string }>;

// Title and description of any sub-page (fixed pages below, plus one per treatment from services.ts).
export const pageSeo = (page: Exclude<SitePage, "">): PageText => {
  const svc = page.startsWith("/services/") ? serviceBySlug(page.slice(10)) : undefined;
  if (svc) return { en: { title: svc.title.en, description: svc.description.en }, ar: { title: svc.title.ar, description: svc.description.ar }, ku: { title: svc.title.ku, description: svc.description.ku } };
  const so = page.startsWith("/social/") ? socialBySlug(page.slice(8)) : undefined;
  if (so) { const t = socialTitle(so); return { en: { title: t.en, description: so.text.en }, ar: { title: t.ar, description: so.text.ar }, ku: { title: t.ku, description: so.text.ku } }; }
  return PAGE_SEO[page as Exclude<BasePage, "">];
};

const extraSeo = Object.fromEntries(EXTRA_PAGES.map(p=>[p.path, Object.fromEntries((["en","ar","ku"] as const).map(l=>[l,{title:p.title[l]+" | "+(l==="en"?"Dr. Saleem Andraws, Duhok":l==="ar"?"د. سليم أندراوس، دهوك":"د. سەلیم ئەندراوس، دهوک"),description:p.description[l]}]))])) as Record<ExtraPagePath,PageText>;
export const PAGE_SEO: Record<Exclude<BasePage, "">, PageText> = {
  ...extraSeo,
  "/social": {
    en: { title: SOCIAL_INDEX.title.en, description: SOCIAL_INDEX.description.en },
    ar: { title: SOCIAL_INDEX.title.ar, description: SOCIAL_INDEX.description.ar },
    ku: { title: SOCIAL_INDEX.title.ku, description: SOCIAL_INDEX.description.ku },
  },
  "/services": {
    en: { title: "Dental Services in Duhok: Implants, Veneers, Braces, Root Canal | Dr. Saleem Andraws", description: "All treatments at Dr. Saleem Andraws Dental Clinic in Duhok: dental implants, veneers and Hollywood smile, whitening, root canal and fillings, zircon and E-max crowns, bridges and dentures, braces, cleaning and extraction." },
    ar: { title: "خدمات طب الأسنان في دهوك: زراعة، فينير، تقويم، حشو عصب | د. سليم أندراوس", description: "جميع علاجات عيادة د. سليم أندراوس لطب الأسنان في دهوك: زراعة الأسنان، فينير وابتسامة هوليود، تبييض، حشو العصب والحشوات، تيجان زركون وإيماكس، جسور وطقم أسنان، تقويم، تنظيف وقلع." },
    ku: { title: "خزمەتگوزاریێن ددانا ل دهوکێ: چاندن، ڤینیر، تقویم، حەشوا دەمارێ | د. سەلیم ئەندراوس", description: "هەمی چارەسەریێن کلینیکا د. سەلیم ئەندراوس ل دهوکێ: چاندنا ددانا، ڤینیر و بزەیا هۆلیوود، سپیکرن، حەشوا دەمارێ و حەشو، کراسێن زیرکۆن و ئیماکس، جسر و تەخم، تقویم، پاقژکرن و هەلکێشان." },
  },
  "/news": {
    en: { title: "Dental News & New Techniques in Dentistry | Dr. Saleem Andraws, Duhok", description: "Daily headlines about new dental techniques, technology and research, collected from trusted dental news sites, from a dentist in Duhok." },
    ar: { title: "أخبار طب الأسنان وأحدث التقنيات | د. سليم أندراوس، دهوك", description: "عناوين يومية عن تقنيات طب الأسنان وتطوراته وأبحاثه من مواقع إخبارية موثوقة، مع عيادة د. سليم أندراوس في دهوك." },
    ku: { title: "هەوالێن ددانان و تەکنیکێن نوی | د. سەلیم ئەندراوس، دهوک", description: "ناڤونیشانێن ڕۆژانە دەربارەی تەکنیک و لێکۆلینەوێن نوی یێن ددانان ژ ماڵپەڕێن باوەرپێکری، ل کلینیکا د. سەلیم ئەندراوس ل دهوکێ." },
  },
  "/case": {
    en: { title: "Digital Implant Case & 3D Scanning | Dr. Saleem Andraws, Duhok", description: "A real dental implant case step by step: CBCT, digital implant planning, surgical guide and the final result. Plus videos of 3D intraoral scanning at our clinic in Duhok." },
    ar: { title: "حالة زراعة رقمية والمسح ثلاثي الأبعاد | د. سليم أندراوس، دهوك", description: "حالة زراعة أسنان حقيقية خطوة بخطوة: أشعة ثلاثية الأبعاد، تخطيط رقمي للزراعة، دليل جراحي والنتيجة النهائية، مع فيديوهات المسح الضوئي في عيادتنا في دهوك." },
    ku: { title: "حالەتا چاندنا دیجیتالی و سکانا ٣D | د. سەلیم ئەندراوس، دهوک", description: "حالەتەکا چاندنا ددانا یا ڕاستەقینە قۆناغ ب قۆناغ: تیشکا ٣D، پلاندانانا دیجیتالی، ڕێبەرێ نەشتەرگەری و ئەنجام، دگەل ڤیدیۆیێن سکانا ٣D ل کلینیکا مە ل دهوکێ." },
  },
  "/treatments": {
    en: { title: "How Dental Treatments Are Done (Animations) | Dr. Saleem Andraws, Duhok", description: "Step-by-step animations of root canal treatment, dental implants, crowns with a 3D scanner and tooth extraction, explained simply in English, Arabic and Kurdish." },
    ar: { title: "كيف يتم علاج الأسنان (رسوم متحركة) | د. سليم أندراوس، دهوك", description: "رسوم متحركة خطوة بخطوة تشرح علاج العصب وزراعة الأسنان والتيجان بالماسح الضوئي وقلع الأسنان بلغة بسيطة." },
    ku: { title: "چارەسەریا ددانا چاوا دئێتە کرن (ئەنیمەیشن) | د. سەلیم ئەندراوس، دهوک", description: "ئەنیمەیشنێن قۆناغ ب قۆناغ بۆ چارەسەریا دەمارێ، چاندنا ددانا، کراس ب سکانەرا ٣D و هەلکێشانا ددانی ب زمانەکێ سادە." },
  },
  "/infographics": {
    en: { title: "Dental Health Infographics | Dr. Saleem Andraws, Duhok", description: "Clear one-page infographics on daily brushing, gum disease, tooth decay, tooth sensitivity, food for healthy teeth and children's smiles." },
    ar: { title: "إنفوجرافيك صحة الأسنان | د. سليم أندراوس، دهوك", description: "صور توضيحية في صفحة واحدة عن التفريش اليومي وأمراض اللثة والتسوس وحساسية الأسنان والغذاء الصحي وابتسامات الأطفال." },
    ku: { title: "ئینفۆگرافیکێن ساخلەمیا ددانا | د. سەلیم ئەندراوس، دهوک", description: "وێنەیێن ڕوونکەر ل سەر فلچەکرنا ڕۆژانە، نەخۆشیێن پوکێ، کڕمبوون، هەستیاریا ددانا، خوارنا ساخلەم و بزەیێن زارۆکان." },
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
  const s = page ? { ...SEO[lang], ...pageSeo(page)[lang] } : SEO[lang];
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
