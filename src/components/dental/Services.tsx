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

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      image: teethWhiteningImg,
      titleKey: "services.teethWhitening",
      descKey: "services.teethWhiteningDesc",
    },
    {
      image: dentalImplantsImg,
      titleKey: "services.dentalImplants",
      descKey: "services.dentalImplantsDesc",
    },
    {
      image: cosmeticDentistryImg,
      titleKey: "services.cosmeticDentistry",
      descKey: "services.cosmeticDentistryDesc",
    },
    {
      image: rootCanalImg,
      titleKey: "services.rootCanal",
      descKey: "services.rootCanalDesc",
    },
    {
      image: orthodonticsImg,
      titleKey: "services.orthodontics",
      descKey: "services.orthodonticsDesc",
    },
    {
      image: oralRadiologyImg,
      titleKey: "services.oralRadiology",
      descKey: "services.oralRadiologyDesc",
    },
    {
      image: dentalCleaningImg,
      titleKey: "services.dentalCleaning",
      descKey: "services.dentalCleaningDesc",
    },
    {
      image: pediatricDentistryImg,
      titleKey: "services.pediatricDentistry",
      descKey: "services.pediatricDentistryDesc",
    },
  ];

  return (
    <section id="services" className="relative bg-background py-16 md:py-24 lg:py-28">
      <div className="container px-4 sm:px-6">
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
            {services.map((service) => (
              <li key={service.titleKey} className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 border-b border-border py-5 transition-colors hover:bg-card sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-3">
                <div className="film aspect-[4/3] overflow-hidden rounded-[0.25rem] bg-secondary">
                  <img src={service.image} alt={t(service.titleKey)} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1 text-lg font-semibold leading-snug sm:text-xl">{t(service.titleKey)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{t(service.descKey)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
