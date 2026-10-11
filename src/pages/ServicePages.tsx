import { useParams } from "react-router-dom";
import { Calendar, MessageCircle, Phone, ChevronRight, ArrowRight } from "lucide-react";
import SubPage from "./SubPage";
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor, servicePath, type SitePage } from "@/config/seo";
import { SERVICES, serviceBySlug, SERVICES_INDEX_NAME, type L3 } from "@/config/services";
import { PHONES } from "@/config/clinic";
import kidsImg from "@/assets/services/pediatric-dentistry.jpg";

// /services (all treatments) and /services/<slug> (one treatment), in English, Arabic and Kurdish.
const IMAGES = import.meta.glob("@/assets/services/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const imageFor = (name: string) => Object.entries(IMAGES).find(([k]) => k.endsWith(`/${name}.jpg`))?.[1] ?? "";

const T = (en: string, ar: string, ku: string): L3 => ({ en, ar, ku });
const TX = {
  home: T("Home", "الرئيسية", "سەرەکی"),
  inDuhok: T("in Duhok", "في دهوك", "ل دهوکێ"),
  indexTitle: T("Dental services in Duhok", "خدمات طب الأسنان في دهوك", "خزمەتگوزاریێن ددانا ل دهوکێ"),
  indexIntro: T(
    "Every treatment at Dr. Saleem Andraws Dental Clinic, Qazi Mohammad Road, Duhok. Open a treatment to read about it, then book an examination: the doctor checks your teeth first and explains the options that suit you.",
    "جميع العلاجات في عيادة د. سليم أندراوس لطب الأسنان، شارع قاضي محمد، دهوك. افتح أي علاج لتقرأ عنه، ثم احجز موعد فحص: يفحص الطبيب أسنانك أولاً ويشرح لك الخيارات المناسبة لك.",
    "هەمی چارەسەریێن کلینیکا ددانان یا د. سەلیم ئەندراوس، شەقامێ قازی محەمەد، دهوک. چارەسەریەکێ ڤەکە دا دەربارە بخوینی، پاشی ڤەکۆلینەکێ ببژێرە: دکتۆر پێشی ددانێن تە دپشکنیت و ڕێکێن گونجای بۆ تە ڕوون دکەت.",
  ),
  kids: T("Children's dentistry", "طب أسنان الأطفال", "ددانێن زارۆکان"),
  kidsText: T("A guide for parents: baby teeth, permanent teeth and care at every age.", "دليل للأهل: الأسنان اللبنية والدائمة والعناية في كل عمر.", "ڕێبەر بۆ دەیک و بابان: ددانێن شیری و هەمیشەیی و چاڤدێری د هەر تەمەنەکی دا."),
  read: T("Read more", "اقرأ المزيد", "زێدەتر بخوینە"),
  steps: T("What happens at your visit", "ماذا يحدث في زيارتك", "د سەردانا تە دا چ دبیت"),
  step: [
    T("Examination", "الفحص", "پشکنین"),
    T("Your plan", "خطتك", "پلانا تە"),
    T("Treatment", "العلاج", "چارەسەری"),
  ],
  stepText: [
    T("The doctor examines your teeth and takes an X-ray when needed.", "يفحص الطبيب أسنانك ويأخذ صورة أشعة عند الحاجة.", "دکتۆر ددانێن تە دپشکنیت و ئەگەر پێدڤی بیت تیشکێ دگریت."),
    T("The doctor explains the treatment options and how long they take, so you can choose.", "يشرح لك الطبيب خيارات العلاج والمدة المتوقعة لتختار ما يناسبك.", "دکتۆر ڕێکێن چارەسەریێ و دەمێ پێدڤی بۆ تە ڕوون دکەت دا تو هەلبژێری."),
    T("Treatment at the clinic in Duhok, with advice on caring for your teeth afterwards.", "العلاج في العيادة في دهوك، مع نصائح العناية بأسنانك بعد ذلك.", "چارەسەری ل کلینیکێ ل دهوکێ، دگەل شیرەتێن چاڤدێریا ددانان پاشی."),
  ],
  alsoKnown: T("Also searched as", "يبحث عنه الناس أيضاً باسم", "خەلک ب ڤان ناڤان ژی لێ دگەڕن"),
  related: T("Related pages", "صفحات ذات صلة", "پەڕێن پەیوەندیدار"),
  others: T("Other treatments", "علاجات أخرى", "چارەسەریێن دی"),
  book: T("Book an appointment", "احجز موعداً", "ژڤانەکێ بگرە"),
  call: T("Call", "اتصل", "تەلەفۆن"),
  allServices: T("All services", "كل الخدمات", "هەمی خزمەتگوزاری"),
};
const PAGE_NAMES: Record<string, L3> = {
  "/treatments": T("How treatments are done (animations)", "كيف يتم العلاج (رسوم متحركة)", "چارەسەری چاوا دئێتە کرن (ئەنیمەیشن)"),
  "/case": T("A real digital implant case", "حالة زراعة رقمية حقيقية", "حالەتەکا چاندنا دیجیتالی"),
  "/kids": T("Children's teeth guide", "دليل أسنان الأطفال", "ڕێبەرێ ددانێن زارۆکان"),
  "/infographics": T("Dental health infographics", "إنفوجرافيك صحة الأسنان", "ئینفۆگرافیکێن ساخلەمیا ددانان"),
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

const ServiceCard = ({ href, img, title, text, more }: { href: string; img: string; title: string; text: string; more: string }) => (
  <a href={href} className="group overflow-hidden rounded-3xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated">
    <img src={img} alt={title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
    <div className="p-5">
      <h2 className="mb-2 font-display text-xl font-semibold">{title}</h2>
      <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{text}</p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {more} <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
    </div>
  </a>
);

export const ServicesIndexPage = () => {
  const { language: l } = useLanguage();
  return (
    <SubPage name="services">
      {(openBooking) => (
        <>
          <Crumbs items={[{ label: TX.home[l], href: pathFor(l, "") }, { label: SERVICES_INDEX_NAME[l] }]} />
          <section className="container pt-6">
            <h1 className="text-center font-display text-3xl font-bold md:text-5xl">{TX.indexTitle[l]}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">{TX.indexIntro[l]}</p>
          </section>
          <section className="container py-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <ServiceCard key={s.slug} href={servicePath(l, s.slug)} img={imageFor(s.image)} title={s.name[l]} text={(s.intro?.[l] || s.a[l]).replace(/^(Yes|نعم|بەلێ)\.\s*/, "")} more={TX.read[l]} />
              ))}
              <ServiceCard href={pathFor(l, "/kids")} img={kidsImg} title={TX.kids[l]} text={TX.kidsText[l]} more={TX.read[l]} />
            </div>
            <div className="mt-10 flex justify-center">
              <Button onClick={openBooking("services_index")} className="gap-2 rounded-full bg-[hsl(var(--sun))] px-6 text-[hsl(var(--ink))] hover:bg-[hsl(41_100%_68%)]">
                <Calendar className="h-4 w-4" /> {TX.book[l]}
              </Button>
            </div>
          </section>
        </>
      )}
    </SubPage>
  );
};

export const ServiceDetailPage = () => {
  const { slug = "" } = useParams();
  const { language: l } = useLanguage();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;
  const relatedHref = (r: string) => (serviceBySlug(r.slice(1)) ? servicePath(l, r.slice(1)) : pathFor(l, r as SitePage));
  const relatedName = (r: string) => serviceBySlug(r.slice(1))?.name[l] ?? PAGE_NAMES[r]?.[l] ?? r;
  return (
    <SubPage name={`service:${s.slug}`}>
      {(openBooking) => (
        <>
          <Crumbs items={[{ label: TX.home[l], href: pathFor(l, "") }, { label: SERVICES_INDEX_NAME[l], href: pathFor(l, "/services") }, { label: s.name[l] }]} />
          <article className="container grid gap-8 py-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                {s.name[l]} <span className="text-gradient">{TX.inDuhok[l]}</span>
              </h1>
              {s.intro?.[l] && <p className="mt-4 text-lg text-muted-foreground">{s.intro[l]}</p>}
              <div className="mt-6 rounded-2xl bg-secondary p-5">
                <h2 className="mb-2 text-lg font-semibold text-primary">{s.q[l]}</h2>
                <p className="leading-relaxed">{s.a[l]}</p>
              </div>
              <h2 className="mb-4 mt-8 font-display text-2xl font-semibold">{TX.steps[l]}</h2>
              <ol className="grid gap-3 sm:grid-cols-3">
                {TX.step.map((st, i) => (
                  <li key={i} className="rounded-2xl border border-border bg-white p-4">
                    <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                    <h3 className="font-semibold">{st[l]}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{TX.stepText[i][l]}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={openBooking(`service:${s.slug}`)} className="gap-2 rounded-full bg-[hsl(var(--sun))] text-[hsl(var(--ink))] hover:bg-[hsl(41_100%_68%)]">
                  <Calendar className="h-4 w-4" /> {TX.book[l]}
                </Button>
                <Button asChild variant="outline" className="gap-2 rounded-full">
                  <a href={`https://wa.me/${PHONES[0].whatsapp}?text=${encodeURIComponent(`${TX.book[l]}: ${s.name[l]}`)}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2 rounded-full">
                  <a href={`tel:${PHONES[0].tel}`}>
                    <Phone className="h-4 w-4" /> <span dir="ltr">{PHONES[0].shown}</span>
                  </a>
                </Button>
              </div>
            </div>
            <aside className="space-y-6">
              <img src={imageFor(s.image)} alt={s.name[l]} className="aspect-[16/10] w-full rounded-3xl object-cover shadow-elevated" />
              <div>
                <h2 className="mb-2 text-sm font-semibold">{TX.alsoKnown[l]}</h2>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {s.search[l].split(/,|،/).map((x) => x.trim()).filter(Boolean).map((x) => (
                    <li key={x} className="rounded-full border border-border bg-white px-3 py-1">{x}</li>
                  ))}
                </ul>
              </div>
              {s.related.length > 0 && (
                <div>
                  <h2 className="mb-2 text-sm font-semibold">{TX.related[l]}</h2>
                  <ul className="space-y-2">
                    {s.related.map((r) => (
                      <li key={r}><a href={relatedHref(r)} className="font-medium text-primary hover:underline">{relatedName(r)}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </article>
          <section className="container pb-14">
            <h2 className="mb-4 font-display text-2xl font-semibold">{TX.others[l]}</h2>
            <div className="flex flex-wrap gap-3">
              {SERVICES.filter((o) => o.slug !== s.slug).map((o) => (
                <a key={o.slug} href={servicePath(l, o.slug)} className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">{o.name[l]}</a>
              ))}
              <a href={pathFor(l, "/kids")} className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">{TX.kids[l]}</a>
              <a href={pathFor(l, "/services")} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{TX.allServices[l]}</a>
            </div>
          </section>
        </>
      )}
    </SubPage>
  );
};
