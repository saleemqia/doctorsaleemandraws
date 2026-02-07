import { motion } from "framer-motion";
import { Award, GraduationCap, Users, Heart } from "lucide-react";
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

  return (
    <section id="about" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "lg:col-start-2" : ""}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={drSaleem}
                alt="Dr. Saleem Andraws"
                className="w-full h-auto object-cover"
              />
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
            className={dir === "rtl" ? "lg:col-start-1 lg:row-start-1 text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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

            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("about.description2")}
            </p>

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