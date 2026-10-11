import { useParams } from "react-router-dom";
import { ChevronRight, ExternalLink, ArrowRight } from "lucide-react";
import SubPage from "./SubPage";
import NotFound from "./NotFound";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor, type SitePage } from "@/config/seo";
import type { L3 } from "@/config/services";
import { OTHER_LINKS, SOCIALS, SOCIAL_INDEX, socialBySlug, type SocialInfo } from "@/config/social";

// /social (all accounts) and /social/<slug> (one account shown inside the page), in English, Arabic and Kurdish.
const T = (en: string, ar: string, ku: string): L3 => ({ en, ar, ku });
const TX = {
  home: T("Home", "الرئيسية", "سەرەکی"),
  intro: T("Follow the clinic and see our work without leaving the website. Tap an account to open it here.", "تابع العيادة وشاهد أعمالنا دون مغادرة الموقع. اضغط على أي حساب لفتحه هنا.", "کلینیکێ بشوێن کەڤە و کارێن مە ببینە بێی ژ ماڵپەڕی دەرکەڤی. کلیک ل سەر هەژمارەکێ بکە دا ل ڤێرە ڤەبیت."),
  view: T("View here", "شاهد هنا", "ل ڤێرە ببینە"),
  open: T("Open in", "افتح في", "ڤەکە ل"),
  other: T("Other links", "روابط أخرى", "لینکێن دی"),
  all: T("All links of the clinic", "كل روابط العيادة", "هەمی لینکێن کلینیکێ"),
  more: T("More accounts", "حسابات أخرى", "هەژمارێن دی"),
  fallback: T("If the account does not appear here, it may be blocked by your browser or network; use the button to open it directly.", "إذا لم يظهر الحساب هنا فقد يكون محجوباً في متصفحك أو شبكتك؛ استخدم الزر لفتحه مباشرة.", "ئەگەر هەژمار ل ڤێرە دیار نەبوو، دبیت د وێبگەڕ یان تۆڕا تە دا گرتی بیت؛ دوگمێ بکاربینە دا ڕاستەوخۆ ڤەبیت."),
};

const Crumbs = ({ items }: { items: { label: string; href?: string }[] }) => (
  <nav aria-label="Breadcrumb" className="container mt-4">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />}
          {it.href ? <a href={it.href} className="hover:text-primary">{it.label}</a> : <span aria-current="page" className="text-foreground">{it.label}</span>}
        </li>
      ))}
    </ol>
  </nav>
);

const socialPath = (l: keyof L3, slug: string) => pathFor(l, `/social/${slug}` as SitePage);
const dot = (s: SocialInfo) => <span className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: s.color }} aria-hidden="true" />;

// The account itself, using each network's own embed.
const Embed = ({ s, lang }: { s: SocialInfo; lang: keyof L3 }) => {
  const frame = "mx-auto block w-full rounded-2xl border border-border bg-white";
  if (s.embed === "instagram") {
    const user = s.url.replace(/\/+$/, "").split("/").pop();
    return <iframe title={`${s.name} ${s.handle}`} src={`https://www.instagram.com/${user}/embed/`} className={frame} style={{ maxWidth: 540, height: 780 }} loading="lazy" />;
  }
  if (s.embed === "facebook") {
    const q = new URLSearchParams({ href: s.url, tabs: "timeline", width: "500", height: "800", small_header: "false", adapt_container_width: "true", hide_cover: "false", show_facepile: "true" });
    return <iframe title={`${s.name} ${s.handle}`} src={`https://www.facebook.com/plugins/page.php?${q}`} className={frame} style={{ maxWidth: 500, height: 800 }} loading="lazy" allow="encrypted-media; clipboard-write; picture-in-picture; web-share" />;
  }
  if (s.embed === "youtube") {
    return (
      <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black">
        <iframe title={s.text.en} src={`https://www.youtube-nocookie.com/embed/${s.id}?rel=0&modestbranding=1`} className="absolute inset-0 h-full w-full" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  if (s.embed === "tiktok") {
    // TikTok often refuses to show a whole profile on other sites, so single videos use TikTok's own player (ids in social.ts).
    if (s.videos?.length) return (
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.videos.map((v) => <iframe key={v} title={`TikTok ${v}`} src={`https://www.tiktok.com/player/v1/${v}?rel=0`} className="aspect-[9/16] w-full rounded-2xl border border-border bg-black" loading="lazy" allow="encrypted-media; fullscreen" allowFullScreen />)}
      </div>
    );
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl bg-[#111] p-8 text-center text-white">
        <span className="text-5xl" aria-hidden="true">♪</span>
        <b className="mt-3 text-2xl" dir="ltr">{s.handle}</b>
        <p className="mt-2 text-sm text-white/75">{s.text[lang]}</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center rounded-3xl p-6" style={{ background: s.color }}>
      <img src={`https://app.snapchat.com/web/deeplink/snapcode?username=${s.id}&type=SVG&size=320`} alt={`Snapcode ${s.handle}`} width={240} height={240} className="h-60 w-60" loading="lazy" />
      <b className="mt-3 text-lg text-black">{s.handle}</b>
    </div>
  );
};

export const SocialIndexPage = () => {
  const { language: l } = useLanguage();
  return (
    <SubPage name="social">
      {() => (
        <>
          <Crumbs items={[{ label: TX.home[l], href: pathFor(l, "") }, { label: SOCIAL_INDEX.name[l] }]} />
          <section className="container pt-6">
            <h1 className="text-center font-display text-3xl font-bold md:text-5xl">{SOCIAL_INDEX.name[l]}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{TX.intro[l]}</p>
          </section>
          <section className="container py-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SOCIALS.map((s) => (
                <a key={s.slug} href={socialPath(l, s.slug)} className="group rounded-3xl border border-border bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated" style={{ borderTop: `5px solid ${s.color}` }}>
                  <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">{dot(s)} {s.name}</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground" dir="ltr">{s.handle}</p>
                  <p className="mt-3 text-sm">{s.text[l]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {TX.view[l]} <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
            <h2 className="mb-3 mt-10 font-display text-xl font-semibold">{TX.other[l]}</h2>
            <div className="flex flex-wrap gap-3">
              {OTHER_LINKS.map((o) => (
                <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary">
                  {o.name} <span className="text-muted-foreground" dir="ltr">{o.handle}</span> <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
              <a href="/links" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{TX.all[l]}</a>
            </div>
          </section>
        </>
      )}
    </SubPage>
  );
};

export const SocialDetailPage = () => {
  const { slug = "" } = useParams();
  const { language: l } = useLanguage();
  const s = socialBySlug(slug);
  if (!s) return <NotFound />;
  return (
    <SubPage name={`social:${s.slug}`}>
      {() => (
        <>
          <Crumbs items={[{ label: TX.home[l], href: pathFor(l, "") }, { label: SOCIAL_INDEX.name[l], href: pathFor(l, "/social") }, { label: s.name }]} />
          <section className="container pt-6 text-center">
            <h1 className="inline-flex items-center gap-3 font-display text-3xl font-bold md:text-5xl">{dot(s)} {s.name}</h1>
            <p className="mt-2 font-medium text-muted-foreground" dir="ltr">{s.handle}</p>
            <p className="mx-auto mt-3 max-w-2xl">{s.text[l]}</p>
            <nav className="mt-5 flex flex-wrap justify-center gap-2" aria-label={TX.more[l]}>
              {SOCIALS.map((o) => (
                <a key={o.slug} href={socialPath(l, o.slug)} aria-current={o.slug === s.slug ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${o.slug === s.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary hover:text-primary"}`}>
                  {dot(o)} {o.name}
                </a>
              ))}
            </nav>
          </section>
          <section className="container py-8">
            <Embed key={s.slug} s={s} lang={l} />
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold shadow-sm" style={{ background: s.color, color: s.embed === "snapchat" ? "#000" : "#fff" }}>
                {TX.open[l]} {s.name} <ExternalLink className="h-4 w-4" />
              </a>
              <p className="max-w-xl text-xs text-muted-foreground">{TX.fallback[l]}</p>
            </div>
          </section>
        </>
      )}
    </SubPage>
  );
};
