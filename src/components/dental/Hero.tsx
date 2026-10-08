import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, MapPin, GraduationCap } from "lucide-react";
import { PHONES, GOOGLE_MAPS_URL } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSlideshow from "@/components/dental/HeroSlideshow";
import radiograph from "@/assets/services/oral-radiology.jpg";

interface HeroProps {
  onBookingClick: () => void;
}

const WA = "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41";

// The opening view is a light-box: the radiograph is what Dr. Saleem reads every day (M.Sc. in oral radiology).
const Hero = ({ onBookingClick }: HeroProps) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-[hsl(var(--ink))] text-[hsl(40_30%_96%)] pt-20 sm:pt-24">
      {/* Radiograph behind everything, faded into the ink */}
      <img src={radiograph} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.28] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,hsl(var(--ink))_75%)]" aria-hidden="true" />

      <div className="container relative z-10 lg:px-14 pb-10 pt-8 sm:pt-12 lg:pb-14">
        <div className="film border-gold/30 border-y border-s border-e px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16 [border-color:hsl(var(--gold)/0.28)]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <div>
              {/* The page's main heading (H1) names what we are and where: what people search for. */}
              <h1 className="mb-5 flex items-center gap-3 font-sans text-sm font-medium tracking-wide text-[hsl(40_42%_72%)] [font-family:inherit]">
                <span className="h-px w-8 bg-[hsl(var(--gold))]" aria-hidden="true" />
                {t("hero.badge")}
              </h1>

              <h2 className="mb-6 text-[2.5rem] font-semibold leading-[1.08] text-white text-balance sm:text-6xl lg:text-[4.25rem]">
                {t("hero.title1")} {t("hero.title2")}
              </h2>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-[hsl(200_20%_82%)] sm:text-lg">{t("hero.description")}</p>

              <p className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[hsl(200_20%_78%)]">
                <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[hsl(40_42%_66%)]" />{t("hero.credential1")}</span>
                <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[hsl(40_42%_66%)]" />{t("hero.credential2")}</span>
              </p>

              <div className="grid max-w-xl grid-cols-2 gap-3">
                <Button onClick={onBookingClick} size="lg" className="col-span-2 justify-self-start gap-2 bg-[hsl(40_48%_62%)] text-[hsl(var(--ink))] hover:bg-[hsl(40_52%_70%)] hover:shadow-lg">
                  <Calendar className="h-5 w-5" />
                  {t("hero.bookBtn")}
                </Button>
                {PHONES.map((n) => (
                  <div key={n.tel} className="col-span-2 flex min-w-0 overflow-hidden rounded-lg border border-white/20 sm:col-span-1">
                    <a href={`tel:${n.tel}`} className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 px-4 py-2 transition-colors hover:bg-white/10">
                      <Phone className="h-5 w-5 shrink-0 text-[hsl(40_42%_66%)]" />
                      <span className="flex min-w-0 flex-col items-start leading-tight">
                        <span className="text-xs text-[hsl(200_20%_72%)]">{t("hero.callBtn")}</span>
                        <span dir="ltr" className="whitespace-nowrap text-base font-semibold tabular-nums text-white">{n.shown}</span>
                      </span>
                    </a>
                    <a href={`https://wa.me/${n.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${n.shown}`} title="WhatsApp"
                      className="flex w-12 shrink-0 items-center justify-center border-s border-white/20 text-[#5BE08C] transition-colors hover:bg-[#25D366] hover:text-white">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d={WA} /></svg>
                    </a>
                  </div>
                ))}
              </div>

              <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#8EE6AE]">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
                </span>
                {t("hero.sameDay")}
              </p>
            </div>

            {/* Portrait, mounted like a film */}
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-md lg:max-w-none">
              <div className="film overflow-hidden rounded-[0.35rem] ring-1 ring-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
                <HeroSlideshow />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[hsl(200_20%_72%)]">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
                  <span className="text-[hsl(40_48%_62%)]" aria-hidden="true">★★★★★</span> 5.0 · {t("hero.googleRating")}
                </a>
                <span>{t("hero.years")} · {t("hero.experience")}</span>
              </div>
            </div>
          </div>

          {/* Facts strip */}
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-14">
            <a href="#hours" className="flex items-center gap-3 bg-[hsl(var(--ink))]/90 p-4 transition-colors hover:bg-[hsl(var(--ink-deep))]">
              <Clock className="h-5 w-5 shrink-0 text-[hsl(40_42%_66%)]" />
              <span><span className="block text-sm font-semibold text-white">{t("hero.workingHours")}</span><span className="text-sm text-[hsl(200_20%_78%)]">{t("hero.workingHoursValue")}</span></span>
            </a>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[hsl(var(--ink))]/90 p-4 transition-colors hover:bg-[hsl(var(--ink-deep))]">
              <MapPin className="h-5 w-5 shrink-0 text-[hsl(40_42%_66%)]" />
              <span><span className="block text-sm font-semibold text-white">{t("hero.location")}</span><span className="text-sm text-[hsl(200_20%_78%)]">{t("hero.locationValue")} · <span className="underline underline-offset-2">{t("contact.openInMaps")}</span></span></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
