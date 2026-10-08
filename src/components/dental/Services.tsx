import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Calendar, MessageCircle } from "lucide-react";
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
  const [open, setOpen] = useState<number | null>(0);

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

  return (
    <section id="services" className="relative bg-background py-16 md:py-24 lg:py-28">
      <div className="container px-4 sm:px-6 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Heading stays in view while the list scrolls */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 flex items-center gap-3 text-sm font-medium text-[hsl(var(--gold))]">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {t("services.badge")}
            </p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {t("services.title1")} {t("services.title2")}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">{t("services.description")}</p>

            {/* The names patients actually search for */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="mb-3 text-base font-semibold">{t("services.allTitle")}</h3>
              <ul className="flex flex-wrap gap-x-1 gap-y-1.5 text-sm text-muted-foreground">
                {t("services.allList").split("|").map((name, i, all) => (
                  <li key={name}>{name}{i < all.length - 1 && <span className="mx-1.5 text-[hsl(var(--gold))]" aria-hidden="true">/</span>}</li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="border-t border-border">
            {services.map((service, i) => {
              const isOpen = open === i;
              const title = t(service.titleKey);
              const q = service.faq.replace("faq.a", "faq.q");
              return (
                <li key={service.titleKey} className="border-b border-border">
                  <Reveal delay={i * 50}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`svc-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group grid w-full grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-5 text-start transition-colors hover:bg-card sm:grid-cols-[8rem_1fr_auto] sm:gap-6 sm:px-3"
                    >
                      <span className="film block aspect-[4/3] overflow-hidden rounded-[0.25rem] bg-secondary">
                        <img src={service.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </span>
                      <span className="min-w-0">
                        <span className="mb-1 block font-display text-lg font-semibold leading-snug sm:text-xl">{title}</span>
                        <span className="block text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{t(service.descKey)}</span>
                      </span>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full border border-border text-[hsl(var(--gold))] transition-all duration-300 group-hover:border-[hsl(var(--gold))] ${isOpen ? "rotate-45 bg-[hsl(var(--ink))] text-white" : ""}`} aria-hidden="true">
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </Reveal>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`svc-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-5 pb-7 pt-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:px-3">
                          <div className="film overflow-hidden rounded-[0.3rem] bg-secondary">
                            <img src={service.image} alt={title} className="aspect-[16/10] w-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-between gap-4">
                            <div>
                              <h4 className="mb-2 text-base font-semibold">{t(q)}</h4>
                              <p className="leading-relaxed text-muted-foreground">{t(service.faq)}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <Button onClick={onBookingClick} className="gap-2 bg-[hsl(40_48%_62%)] text-[hsl(var(--ink))] hover:bg-[hsl(40_52%_70%)]">
                                <Calendar className="h-4 w-4" />
                                {t("nav.bookAppointment")}
                              </Button>
                              <Button asChild variant="outline" className="gap-2">
                                <a href={`https://wa.me/${PHONES[0].whatsapp}?text=${encodeURIComponent(`${t("nav.bookAppointment")}: ${title}`)}`} target="_blank" rel="noopener noreferrer">
                                  <MessageCircle className="h-4 w-4" />
                                  WhatsApp
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
