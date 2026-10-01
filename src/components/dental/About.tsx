import { motion } from "framer-motion";
import { Award, GraduationCap, Users, Heart, CheckCircle2 } from "lucide-react";
import { GRADUATION_YEAR } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, dir } = useLanguage();

  const achievements = [
    { icon: GraduationCap, value: "M.Sc.", labelKey: "about.oralRadiology" },
    { icon: Award, value: "B.D.S.", labelKey: "about.univBaghdad" },
    { icon: Users, value: "500+", labelKey: "about.happyPatients" },
    { icon: Heart, value: String(new Date().getFullYear() - GRADUATION_YEAR), labelKey: "about.yearsExperience" },
  ];

  const credentials = ["about.cred.bds", "about.cred.msc", "about.cred.years", "about.cred.syndicate", "about.cred.languages"];

  return (
    <section id="about" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "" : ""}`}>
              <Award className="w-4 h-4" />
              {t("about.badge")}
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t("about.title1")}{" "}
              <span className="text-gradient">{t("about.title2")}</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {t("about.description1")}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("about.description2")}
            </p>

            {/* Qualifications: what Google and patients look for on a doctor's page */}
            <h3 className="font-display font-semibold text-lg text-foreground mb-3">{t("about.credTitle")}</h3>
            <ul className="space-y-2.5 mb-8">
              {credentials.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            {/* Achievements */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${dir === "rtl" ? "direction-rtl" : ""}`}>
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-secondary/50"
                >
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display font-bold text-xl text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{t(item.labelKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;