import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, MapPin, Award, GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import drSaleem from "@/assets/dr-saleem.jpg";

interface HeroProps {
  onBookingClick: () => void;
}

const Hero = ({ onBookingClick }: HeroProps) => {
  const { t, dir } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen bg-gradient-hero overflow-hidden pt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="container relative z-10 py-12 lg:py-20">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "lg:col-start-2 text-right" : ""}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Award className="w-4 h-4" />
              {t("hero.badge")}
            </span>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              {t("hero.title1")}{" "}
              <span className="text-gradient">{t("hero.title2")}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {t("hero.description")}
            </p>

            {/* Credentials */}
            <div className={`flex flex-wrap gap-4 mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{t("hero.credential1")}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Award className="w-4 h-4 text-primary" />
                <span>{t("hero.credential2")}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-10 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
              <Button variant="teal" size="lg" onClick={onBookingClick} className={`gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Calendar className="w-5 h-5" />
                {t("hero.bookBtn")}
              </Button>
              <a href="tel:07507816500">
                <Button variant="tealOutline" size="lg" className={`w-full sm:w-auto gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <Phone className="w-5 h-5" />
                  {t("hero.callBtn")}
                </Button>
              </a>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-soft ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("hero.workingHours")}</p>
                  <p className="text-xs text-muted-foreground">{t("hero.workingHoursValue")}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-soft ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("hero.location")}</p>
                  <p className="text-xs text-muted-foreground">{t("hero.locationValue")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative ${dir === "rtl" ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={drSaleem}
                  alt="Dr. Saleem Andraws - Dental Specialist"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`absolute -bottom-6 ${dir === "rtl" ? "-right-6" : "-left-6"} p-4 rounded-xl bg-card border border-border/50 shadow-card animate-float`}
              >
                <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary">
                    <span className="text-2xl">🦷</span>
                  </div>
                  <div className={dir === "rtl" ? "text-right" : ""}>
                    <p className="font-display font-semibold">{t("hero.years")}</p>
                    <p className="text-xs text-muted-foreground">{t("hero.experience")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Rating card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className={`absolute -top-4 ${dir === "rtl" ? "-left-4" : "-right-4"} p-4 rounded-xl bg-card border border-border/50 shadow-card`}
              >
                <div className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gold">⭐</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0</span>
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${dir === "rtl" ? "text-right" : ""}`}>{t("hero.happyPatients")}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;