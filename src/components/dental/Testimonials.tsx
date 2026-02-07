import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const { t, dir } = useLanguage();

  const testimonials = [
    {
      name: "Ahmed Hassan",
      roleKey: "testimonials.businessOwner",
      contentKey: "testimonials.review1",
      rating: 5,
    },
    {
      name: "Sara Mohammed",
      roleKey: "testimonials.teacher",
      contentKey: "testimonials.review2",
      rating: 5,
    },
    {
      name: "Omar Ali",
      roleKey: "testimonials.engineer",
      contentKey: "testimonials.review3",
      rating: 5,
    },
    {
      name: "Layla Ibrahim",
      roleKey: "testimonials.student",
      contentKey: "testimonials.review4",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Quote className="w-4 h-4" />
            {t("testimonials.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("testimonials.title1")}{" "}
            <span className="text-gradient">{t("testimonials.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("testimonials.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`h-full p-6 md:p-8 rounded-2xl bg-card border border-border/50 shadow-soft ${dir === "rtl" ? "text-right" : ""}`}>
                {/* Rating */}
                <div className={`flex gap-1 mb-4 ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-6 italic">
                  "{t(testimonial.contentKey)}"
                </p>

                {/* Author */}
                <div className={`flex items-center gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className={dir === "rtl" ? "text-right" : ""}>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{t(testimonial.roleKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;