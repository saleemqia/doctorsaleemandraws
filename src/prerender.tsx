import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { EXTRA_PAGES } from "./config/extraPages";
import { pageSeo, pageUrl } from "./config/seo";
import { DAYS, T as HOURS } from "./components/dental/WeeklyHours";
import { TEXT as DUHOK } from "./components/dental/DuhokBand";

type Lang = "en" | "ar" | "ku";
type Page = "/about" | "/faq" | "/opening-hours" | "/duhok";
const order = [1, 14, 5, 15, 2, 7, 3, 8, 9, 13, 17, 11, 12, 16, 10, 6, 18, 4];

function Content({ lang, page }: { lang: Lang; page: Page }) {
  const { t } = useLanguage();
  const info = EXTRA_PAGES.find((p) => p.path === page)!;
  const d = DUHOK[lang], h = HOURS[lang];
  return <main style={{ fontFamily: "system-ui,sans-serif", maxWidth: 760, margin: "40px auto", padding: "0 16px", color: "#0d3550", lineHeight: 1.6 }}>
    <h1>{info.title[lang]}</h1><p>{info.description[lang]}</p>
    {page === "/faq" && <section><h2>{t("faq.title1")} {t("faq.title2")}</h2><p>{t("faq.description")}</p>{order.map((n) => <section key={n}><h3>{t(`faq.q${n}`)}</h3><p>{t(`faq.a${n}`)}</p></section>)}</section>}
    {page === "/about" && <section><h2>{t("about.title1")} {t("about.title2")}</h2><p>{t("about.description1")}</p><p>{t("about.description2")}</p><h3>{t("about.credTitle")}</h3><ul>{["bds", "msc", "years", "syndicate", "languages"].map((k) => <li key={k}>{t(`about.cred.${k}`)}</li>)}</ul></section>}
    {page === "/opening-hours" && <section><h2>{h.title1} {h.title2}</h2><ul>{DAYS.map((day) => <li key={day.idx}>{day.name[lang]}: {day.idx === 5 ? h.off : h.hours}</li>)}</ul><p>{h.sameDay}</p></section>}
    {page === "/duhok" && <section><h2>{d.title1} {d.title2}</h2><p>{d.text}</p><p><a href="https://maps.google.com/maps?cid=12832058961737231247">{d.directions}</a></p><p><a href="https://www.youtube.com/watch?v=ohvHzLMYa9c">{d.play}</a> · {d.credit}: RDD2022</p></section>}
    <p><a href="tel:07507816500">0750 781 6500</a> · <a href="tel:07781665000">0778 166 5000</a></p>
    <nav><a href={pageUrl("en", page)}>English</a> · <a href={pageUrl("ar", page)}>العربية</a> · <a href={pageUrl("ku", page)}>کوردی</a></nav>
  </main>;
}

export function prerender(lang: Lang, page: Page) {
  return { html: renderToStaticMarkup(<LanguageProvider initialLanguage={lang}><Content lang={lang} page={page} /></LanguageProvider>), seo: pageSeo(page)[lang], url: pageUrl(lang, page), alternates: ["en", "ar", "ku"].map((l) => ({ lang: l, url: pageUrl(l as Lang, page) })) };
}
