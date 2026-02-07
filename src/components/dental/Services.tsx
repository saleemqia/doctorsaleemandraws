import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
  const { t, dir } = useLanguage();

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
    <section id="services" className="py-16 md:py-24 lg:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-52 md:w-80 h-52 md:h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-center max-w-2xl mx-auto mb-10 md:mb-16 ${dir === "rtl" ? "text-center" : ""}`}
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Sparkles className="w-4 h-4" />
            {t("services.badge")}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t("services.title1")}{" "}
            <span className="text-gradient">{t("services.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg px-4">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className={`h-full rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 overflow-hidden ${dir === "rtl" ? "text-right" : ""}`}>
                {/* Service Image */}
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                
                {/* Service Content */}
                <div className="p-4 md:p-5">
                  <h3 className="font-display text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
