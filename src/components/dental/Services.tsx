import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHONES } from "@/config/clinic";
import Reveal from "@/components/dental/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";

// Import service images
import teethWhiteningImg from "@/assets/services/teeth-whitening.jpg";
import dentalImplantsImg from "@/assets/services/dental-implants.jpg";
import cosmeticDentistryImg from "@/assets/services/cosmetic-dentistry.jpg";
import rootCanalImg from "@/assets/services/root-canal.jpg";
import orthodonticsImg from "@/assets/services/orthodontics.jpg";
import oralRadiologyImg from "@/assets/services/oral-radiology.jpg";
import dentalCleaningImg from "@/assets/services/dental-cleaning.jpg";
import pediatricDentistryImg from "@/assets/services/pediatric-dentistry.jpg";

interface ServicesProps {
  onBookingClick: () => void;
}

const Services = ({ onBookingClick }: ServicesProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);

  const services = [
    {
      image: teethWhiteningImg,
      faq: "faq.a10",
      titleKey: "services.teethWhitening",
      descKey: "services.teethWhiteningDesc",
    },
    {
      image: dentalImplantsImg,
      faq: "faq.a8",
      titleKey: "services.dentalImplants",
      descKey: "services.dentalImplantsDesc",
    },
    {
      image: cosmeticDentistryImg,
      faq: "faq.a9",
      titleKey: "services.cosmeticDentistry",
      descKey: "services.cosmeticDentistryDesc",
    },
    {
      image: rootCanalImg,
      faq: "faq.a11",
      titleKey: "services.rootCanal",
      descKey: "services.rootCanalDesc",
    },
    {
      image: orthodonticsImg,
      faq: "faq.a17",
      titleKey: "services.orthodontics",
      descKey: "services.orthodonticsDesc",
    },
    {
      image: oralRadiologyImg,
      faq: "faq.a4",
      titleKey: "services.oralRadiology",
      descKey: "services.oralRadiologyDesc",
    },
    {
      image: dentalCleaningImg,
      faq: "faq.a16",
      titleKey: "services.dentalCleaning",
      descKey: "services.dentalCleaningDesc",
    },
    {
      image: pediatricDentistryImg,
      faq: "faq.a6",
      titleKey: "services.pediatricDentistry",
      descKey: "services.pediatricDentistryDesc",
    },
  ];

  const TINTS = ["hsl(187 70% 48%)", "hsl(41 100% 62%)", "hsl(12 100% 70%)", "hsl(160 60% 55%)", "hsl(262 80% 72%)", "hsl(202 87% 44%)", "hsl(187 70% 48%)", "hsl(340 90% 72%)"];
  const cur = services[open];
  const curTitle = t(cur.titleKey);

  return (
    <section id="services" className="relative bg-background py-16 md:py-24">
      <div className="container px-4 sm:px-6 lg:px-14">
        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="mb-3 inline-flex rounded-full bg-[hsl(var(--sun)/0.25)] px-4 py-1 text-sm font-semibold text-[hsl(var(--ink))]">{t("services.badge")}</p>
            <h2 className="mb-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("services.title1")} <span className="text-gradient">{t("services.title2")}</span>
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{t("services.description")}</p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          {/* Treatment picker: tap one, the big card changes */}
          <div role="tablist" aria-label={t("services.badge")} className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
            {services.map((service, i) => {
              const active = open === i;
              return (
                <button
                  key={service.titleKey}
                  role="tab"
                  type="button"
                  id={`svc-tab-${i}`}
                  aria-selected={active}
                  aria-controls="svc-panel"
                  onClick={() => setOpen(i)}
                  className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-2 pe-4 text-start transition-all lg:p-2.5 ${active ? "border-transparent bg-white shadow-elevated lg:-translate-x-0 lg:scale-[1.02]" : "border-border bg-white/60 hover:bg-white hover:shadow-card"}`}
                  style={active ? { boxShadow: `0 14px 34px -14px ${TINTS[i]}`, outline: `2px solid ${TINTS[i]}` } : undefined}
                >
                  <img src={service.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover lg:h-14 lg:w-14" />
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap font-display text-base font-semibold leading-snug lg:whitespace-normal lg:text-lg">{t(service.titleKey)}</span>
                    <span className="hidden text-xs leading-snug text-muted-foreground lg:line-clamp-1 lg:block">{t(service.descKey)}</span>
                  </span>
                  <ArrowRight className={`ms-auto hidden h-4 w-4 shrink-0 rtl:rotate-180 lg:block ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} style={{ color: TINTS[i] }} />
                </button>
              );
            })}
          </div>

          <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${open}`} className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={open}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-elevated"
              >
                <div className="relative">
                  <img src={cur.image} alt={curTitle} className="aspect-[16/10] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
                  <span className="absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-[hsl(var(--ink))]" style={{ background: TINTS[open] }}>{String(open + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
                  <h3 className="absolute inset-x-5 bottom-4 text-2xl font-semibold text-white sm:text-3xl">{curTitle}</h3>
                </div>
                <div className="p-5 sm:p-7">
                  <p className="mb-4 text-base leading-relaxed text-foreground">{t(cur.descKey)}</p>
                  <div className="mb-5 rounded-2xl bg-secondary p-4">
                    <h4 className="mb-1 text-sm font-semibold text-primary">{t(cur.faq.replace("faq.a", "faq.q"))}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t(cur.faq)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={onBookingClick} className="gap-2 rounded-full bg-[hsl(var(--sun))] text-[hsl(var(--ink))] hover:bg-[hsl(41_100%_68%)]">
                      <Calendar className="h-4 w-4" />
                      {t("nav.bookAppointment")}
                    </Button>
                    <Button asChild variant="outline" className="gap-2 rounded-full">
                      <a href={`https://wa.me/${PHONES[0].whatsapp}?text=${encodeURIComponent(`${t("nav.bookAppointment")}: ${curTitle}`)}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* The names patients actually search for */}
        <div className="mt-12 rounded-3xl bg-secondary/70 p-6 md:p-8">
          <h3 className="mb-3 text-base font-semibold">{t("services.allTitle")}</h3>
          <ul className="flex flex-wrap gap-2 text-sm">
            {t("services.allList").split("|").map((name) => (
              <li key={name} className="rounded-full border border-border bg-white px-3 py-1 text-foreground">{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
