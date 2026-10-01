import { motion } from "framer-motion";
import { Award, GraduationCap, Users, Heart, CheckCircle2, Star } from "lucide-react";
import { GOOGLE_MAPS_URL } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import drSaleem from "@/assets/dr-saleem.jpg";

const About = () => {
  const { t, dir } = useLanguage();

  const achievements = [
    { icon: GraduationCap, value: "M.Sc.", labelKey: "about.oralRadiology" },
    { icon: Award, value: "B.D.S.", labelKey: "about.univBaghdad" },
    { icon: Users, value: "500+", labelKey: "about.happyPatients" },
    { icon: Heart, value: "15+", labelKey: "about.yearsExperience" },
  ];

  const credentials = ["about.cred.bds", "about.cred.msc", "about.cred.years", "about.cred.syndicate", "about.cred.languages"];

  return (
    <section id="about" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${dir === "rtl" ? "" : ""}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "" : ""}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={drSaleem}
                alt={t("about.photoCaption")}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                <p className="text-white font-semibold">{t("about.photoCaption")}</p>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-white/90 hover:underline">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 5.0 · Google
                </a>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className={`absolute -bottom-6 ${dir === "rtl" ? "-left-6" : "-right-6"} w-48 h-48 bg-primary/10 rounded-3xl -z-10`} />
            <div className={`absolute -top-6 ${dir === "rtl" ? "-right-6" : "-left-6"} w-32 h-32 bg-primary/5 rounded-3xl -z-10`} />
          </motion.div>

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