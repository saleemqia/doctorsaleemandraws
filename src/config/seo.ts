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

export const pageUrl = (lang: SeoLanguage) => `${SITE}${LANGUAGE_PATHS[lang] === "/" ? "/" : LANGUAGE_PATHS[lang]}`;

export const languageFromPath = (pathname: string): SeoLanguage | null => {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  if (pathname === "/ku" || pathname.startsWith("/ku/")) return "ku";
  if (pathname === "/") return "en";
  return null;
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

// Keeps the browser tab title, description and canonical link in sync with the shown language.
export const applySeo = (lang: SeoLanguage) => {
  const s = SEO[lang];
  document.title = s.title;
  setMeta('meta[name="description"]', "content", s.description);
  setMeta('meta[property="og:title"]', "content", s.title);
  setMeta('meta[property="og:description"]', "content", s.description);
  setMeta('meta[property="og:url"]', "content", pageUrl(lang));
  setMeta('meta[property="og:locale"]', "content", s.locale);
  setMeta('meta[name="twitter:title"]', "content", s.title);
  setMeta('meta[name="twitter:description"]', "content", s.description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", pageUrl(lang));
};
