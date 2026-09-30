import { motion } from "framer-motion";
import { Quote, Star, ExternalLink, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { REVIEWS, GOOGLE_MAPS_URL, GOOGLE_WRITE_REVIEW_URL } from "@/config/clinic";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const Testimonials = () => {
  const { t, dir } = useLanguage();

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Quote className="w-4 h-4" />
            {t("testimonials.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("testimonials.title1")}{" "}
            <span className="text-gradient">{t("testimonials.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("testimonials.description")}</p>
        </motion.div>

        {/* Reviews come from REVIEWS in src/config/clinic.ts — real Google reviews only. */}
        {REVIEWS.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, index) => (
              <motion.figure
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="h-full p-6 md:p-7 rounded-2xl bg-card border border-border/50 shadow-soft flex flex-col"
              >
                <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                <blockquote dir="auto" className="text-foreground leading-relaxed mb-6 flex-1 text-start">
                  {review.text}
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div className="min-w-0 text-start">
                    <p dir="auto" className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <GoogleIcon />
                      <span>{t("testimonials.googleReview")}</span>
                      <span aria-hidden="true">·</span>
                      <span dir="ltr">{review.date}</span>
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="teal" size="lg" className="w-full gap-2">
              <GoogleIcon />
              {t("testimonials.readAll")}
              <ExternalLink className={`w-4 h-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
            </Button>
          </a>
          <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <PenLine className="w-4 h-4" />
              {t("testimonials.leaveReview")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
