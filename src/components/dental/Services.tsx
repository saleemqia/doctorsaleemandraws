import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t, dir } = useLanguage();

  const services = [
    {
      icon: "🦷",
      titleKey: "services.teethWhitening",
      descKey: "services.teethWhiteningDesc",
      price: "$150",
    },
    {
      icon: "🔧",
      titleKey: "services.dentalImplants",
      descKey: "services.dentalImplantsDesc",
      price: "$800",
    },
    {
      icon: "✨",
      titleKey: "services.cosmeticDentistry",
      descKey: "services.cosmeticDentistryDesc",
      price: "$300",
    },
    {
      icon: "🛡️",
      titleKey: "services.rootCanal",
      descKey: "services.rootCanalDesc",
      price: "$250",
    },
    {
      icon: "📐",
      titleKey: "services.orthodontics",
      descKey: "services.orthodonticsDesc",
      price: "$1000",
    },
    {
      icon: "🔬",
      titleKey: "services.oralRadiology",
      descKey: "services.oralRadiologyDesc",
      price: "$50",
    },
    {
      icon: "🧹",
      titleKey: "services.dentalCleaning",
      descKey: "services.dentalCleaningDesc",
      price: "$75",
    },
    {
      icon: "👶",
      titleKey: "services.pediatricDentistry",
      descKey: "services.pediatricDentistryDesc",
      price: "$50",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-center max-w-2xl mx-auto mb-16 ${dir === "rtl" ? "text-center" : ""}`}
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Sparkles className="w-4 h-4" />
            {t("services.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("services.title1")}{" "}
            <span className="text-gradient">{t("services.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`group h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300 ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {t(service.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {t(service.descKey)}
                </p>
                <p className="text-primary font-semibold text-sm">
                  {t("services.startingFrom")} {service.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;