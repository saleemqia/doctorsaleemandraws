import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, MapPin, Award, GraduationCap } from "lucide-react";
import { PHONES } from "@/config/clinic";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_MAPS_URL } from "@/config/clinic";
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
        <div className={`grid xl:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center ${dir === "rtl" ? "" : ""}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={dir === "rtl" ? "text-right" : ""}
          >
            {/* The page's main heading (H1) names what we are and where — what people search for. */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <h1 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium font-sans text-primary">
                <Award className="w-4 h-4" />
                {t("hero.badge")}
              </h1>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                <span className="relative flex w-2 h-2" aria-hidden="true">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                {t("hero.sameDay")}
              </span>
            </div>

            <h2 className="font-display text-[2.1rem] leading-[1.15] sm:text-5xl lg:text-6xl font-bold sm:leading-tight text-foreground mb-5 sm:mb-6 text-balance">
              {t("hero.title1")}{" "}
              <span className="text-gradient">{t("hero.title2")}</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {t("hero.description")}
            </p>

            {/* Credentials */}
            <div className={`flex flex-wrap gap-4 mb-8 ${dir === "rtl" ? "" : ""}`}>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${dir === "rtl" ? "" : ""}`}>
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>{t("hero.credential1")}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${dir === "rtl" ? "" : ""}`}>
                <Award className="w-4 h-4 text-primary" />
                <span>{t("hero.credential2")}</span>
              </div>
            </div>

            {/* CTA Buttons: on phones each number gets its own full-width row (call + WhatsApp) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-xl">
              <Button variant="teal" size="lg" onClick={onBookingClick} className="col-span-2 sm:justify-self-start gap-2">
                <Calendar className="w-5 h-5" />
                {t("hero.bookBtn")}
              </Button>
              {PHONES.map((n) => (
                <div key={n.tel} className="col-span-2 sm:col-span-1 flex min-w-0 rounded-xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <a
                    href={`tel:${n.tel}`}
                    className="flex flex-1 min-w-0 items-center gap-2 px-3 sm:px-4 py-2 min-h-[56px] text-foreground hover:bg-card transition-colors"
                  >
                    <Phone className="w-5 h-5 shrink-0 text-primary" />
                    <span className="flex flex-col items-start leading-tight min-w-0">
                      <span className="text-xs font-medium text-muted-foreground">{t("hero.callBtn")}</span>
                      <span dir="ltr" className="font-bold tabular-nums whitespace-nowrap text-base">{n.shown}</span>
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${n.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${n.shown}`}
                    title="WhatsApp"
                    className="flex items-center justify-center w-11 sm:w-12 shrink-0 bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41"/></svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
              <div className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border/50 shadow-soft min-w-0 ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("hero.workingHours")}</p>
                  <p className="text-xs text-muted-foreground">{t("hero.workingHoursValue")}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border/50 shadow-soft min-w-0 ${dir === "rtl" ? "text-right" : ""}`}>
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-primary/10">
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
            className="relative w-full max-w-[22rem] sm:max-w-md mx-auto xl:max-w-none"
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
                <div className={`flex items-center gap-3 ${dir === "rtl" ? "" : ""}`}>
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
                <div className={`flex items-center gap-2 ${dir === "rtl" ? "" : ""}`}>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gold">⭐</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0</span>
                </div>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className={`block text-xs text-muted-foreground mt-1 hover:text-primary hover:underline ${dir === "rtl" ? "text-right" : ""}`}>{t("hero.googleRating")}</a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;