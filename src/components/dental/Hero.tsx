import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, MapPin, GraduationCap, Sparkles, Images, MessageSquareHeart, Baby, Stethoscope, Mail, Play, Star, ChevronDown } from "lucide-react";
import { PHONES, GOOGLE_MAPS_URL } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor, type SitePage } from "@/config/seo";
import HeroSlideshow from "@/components/dental/HeroSlideshow";

interface HeroProps {
  onBookingClick: () => void;
}

const WA = "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41";

// Colourful "doors" into the rest of the site: the first screen shows a visitor everything there is to explore.
const DOORS = [
  { key: "services", href: "#services", icon: Stethoscope, tint: "from-[hsl(187_70%_48%)] to-[hsl(202_87%_40%)]", text: "text-white" },
  { key: "gallery", href: "#gallery", icon: Images, tint: "from-[hsl(41_100%_66%)] to-[hsl(30_100%_62%)]", text: "text-[hsl(var(--ink))]" },
  { key: "testimonials", href: "#testimonials", icon: MessageSquareHeart, tint: "from-[hsl(12_100%_72%)] to-[hsl(340_90%_68%)]", text: "text-white" },
  { key: "kids", href: "/kids", icon: Baby, tint: "from-[hsl(160_60%_62%)] to-[hsl(187_70%_48%)]", text: "text-[hsl(var(--ink))]" },
  { key: "treatments", href: "/treatments", icon: Play, tint: "from-[hsl(262_80%_72%)] to-[hsl(222_85%_62%)]", text: "text-white" },
  { key: "contact", href: "#contact", icon: Mail, tint: "from-[hsl(202_87%_34%)] to-[hsl(202_80%_20%)]", text: "text-white" },
] as const;

const Hero = ({ onBookingClick }: HeroProps) => {
  const { t, language } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30]);
  const hrefFor = (h: string) => (h.startsWith("/") ? pathFor(language, h as SitePage) : h);

  return (
    <section id="home" ref={ref} className="bg-mesh relative overflow-hidden pt-24 sm:pt-28">
      {/* floating colour blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-[-6rem] h-72 w-72 rounded-full bg-[hsl(var(--sun)/0.35)] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-24 start-[-5rem] h-72 w-72 rounded-full bg-[hsl(var(--aqua)/0.28)] blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            {/* The page's main heading (H1) names what we are and where: what people search for. */}
            <h1 className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--aqua)/0.4)] bg-white/80 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur [font-family:inherit]">
              <Sparkles className="h-4 w-4 text-[hsl(var(--sun))]" />
              {t("hero.badge")}
            </h1>

            <h2 className="mb-5 text-[2.6rem] font-semibold leading-[1.08] text-foreground text-balance sm:text-6xl lg:text-[4.2rem]">
              <span className="text-gradient">{t("hero.title1")}</span> {t("hero.title2")}
            </h2>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("hero.description")}</p>

            <p className="mb-7 flex flex-wrap gap-2 text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm"><GraduationCap className="h-4 w-4 text-primary" />{t("hero.credential1")}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm"><GraduationCap className="h-4 w-4 text-primary" />{t("hero.credential2")}</span>
            </p>

            <div className="grid max-w-xl grid-cols-2 gap-3">
              <Button onClick={onBookingClick} size="lg" className="col-span-2 justify-self-start gap-2 rounded-full bg-[hsl(var(--sun))] px-7 text-[hsl(var(--ink))] shadow-[0_10px_30px_-8px_hsl(var(--sun)/0.9)] hover:-translate-y-0.5 hover:bg-[hsl(41_100%_68%)]">
                <Calendar className="h-5 w-5" />
                {t("hero.bookBtn")}
              </Button>
              {PHONES.map((n) => (
                <div key={n.tel} className="col-span-2 flex min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:col-span-1">
                  <a href={`tel:${n.tel}`} className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 px-4 py-2 transition-colors hover:bg-secondary">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Phone className="h-4 w-4" /></span>
                    <span className="flex min-w-0 flex-col items-start leading-tight">
                      <span className="text-xs text-muted-foreground">{t("hero.callBtn")}</span>
                      <span dir="ltr" className="whitespace-nowrap text-base font-semibold tabular-nums text-foreground">{n.shown}</span>
                    </span>
                  </a>
                  <a href={`https://wa.me/${n.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${n.shown}`} title="WhatsApp"
                    className="flex w-12 shrink-0 items-center justify-center bg-[#25D366] text-white transition-colors hover:bg-[#1ebe5a]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d={WA} /></svg>
                  </a>
                </div>
              ))}
            </div>

            <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(160_70%_28%)]">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              </span>
              {t("hero.sameDay")}
            </p>
          </div>

          {/* Portrait in an arch, with floating chips that drift as you scroll */}
          <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-sm lg:max-w-none lg:px-6">
            <div aria-hidden="true" className="absolute inset-x-3 -bottom-3 top-6 rotate-3 rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--sun))] opacity-80" />
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-4 border-white shadow-[0_30px_60px_-20px_hsl(var(--ocean)/0.55)]">
              <HeroSlideshow />
            </div>
            <motion.a style={{ y: yA }} href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="absolute -start-2 top-[18%] flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-elevated sm:-start-6">
              <Star className="h-5 w-5 fill-[hsl(var(--sun))] text-[hsl(var(--sun))]" />
              <span className="leading-tight"><span className="block text-sm font-bold text-foreground">5.0 ★★★★★</span><span className="text-[11px] text-muted-foreground">{t("hero.googleRating")}</span></span>
            </motion.a>
            <motion.div style={{ y: yB }} className="absolute -end-2 top-[46%] rounded-2xl bg-[hsl(var(--primary))] px-4 py-2.5 text-white shadow-elevated sm:-end-4">
              <span className="block font-display text-2xl font-semibold leading-none">{t("hero.years")}</span>
              <span className="text-[11px] opacity-90">{t("hero.experience")}</span>
            </motion.div>
            <motion.div style={{ y: yC }} className="absolute -bottom-3 start-4 flex items-center gap-2 rounded-full bg-[hsl(var(--sun))] px-4 py-2 text-xs font-bold text-[hsl(var(--ink))] shadow-elevated sm:start-8">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden="true" />{t("hero.sameDay")}
            </motion.div>
          </div>
        </div>

        {/* Doors into the rest of the site */}
        <nav aria-label="Explore" className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-20 lg:grid-cols-6">
          {DOORS.map((d, i) => (
            <motion.a
              key={d.key}
              href={hrefFor(d.href)}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
              whileHover={reduce ? undefined : { y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
              className={`group relative flex min-h-[7.5rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-4 shadow-card ${d.tint} ${d.text}`}
            >
              <d.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-125" />
              <span className="text-base font-bold leading-tight">{t(`nav.${d.key}`)}<span className="ms-1 inline-block transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true">→</span></span>
              <span aria-hidden="true" className="absolute -end-4 -top-4 h-16 w-16 rounded-full bg-white/20" />
            </motion.a>
          ))}
        </nav>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#hours" className="flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-4 backdrop-blur transition-shadow hover:shadow-card">
            <Clock className="h-5 w-5 shrink-0 text-primary" />
            <span><span className="block text-sm font-semibold">{t("hero.workingHours")}</span><span className="text-sm text-muted-foreground">{t("hero.workingHoursValue")}</span></span>
          </a>
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-4 backdrop-blur transition-shadow hover:shadow-card">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <span><span className="block text-sm font-semibold">{t("hero.location")}</span><span className="text-sm text-muted-foreground">{t("hero.locationValue")} · <span className="underline underline-offset-2">{t("contact.openInMaps")}</span></span></span>
          </a>
        </div>

        <a href="#services" aria-label={t("nav.services")} className="mx-auto mt-8 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-card motion-safe:animate-bob">
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
      {/* curved edge into the next section */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" className="mt-0 block h-8 w-full text-background sm:h-14"><path fill="currentColor" d="M0 60V30Q360 0 720 25T1440 20V60Z" /></svg>
    </section>
  );
};

export default Hero;
