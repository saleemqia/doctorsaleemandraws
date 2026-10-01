import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { t, dir } = useLanguage();

  // Most-asked first: when, today?, how to book, price, where. Then treatments.
  const order = [1, 14, 5, 15, 2, 7, 3, 8, 9, 13, 17, 11, 12, 16, 10, 6, 18, 4];
  const faqs = order.map((n) => ({ qKey: `faq.q${n}`, aKey: `faq.a${n}` }));

  // Tell Google about the questions shown on the page (FAQ structured data, in the current language).
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: t(f.qKey),
        acceptedAnswer: { "@type": "Answer", text: t(f.aKey) },
      })),
    };
    let el = document.getElementById("faq-jsonld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "faq-jsonld";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  });

  return (
    <section id="faq" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "" : ""}`}>
            <HelpCircle className="w-4 h-4" />
            {t("faq.badge")}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t("faq.title1")}{" "}
            <span className="text-gradient">{t("faq.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {t("faq.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/50 bg-card px-4 md:px-6 shadow-soft data-[state=open]:border-primary/30 data-[state=open]:shadow-card transition-all duration-300"
              >
                <AccordionTrigger className={`text-sm md:text-base font-semibold hover:text-primary transition-colors py-4 md:py-5 ${dir === "rtl" ? "text-right" : ""}`}>
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground text-sm md:text-base leading-relaxed pb-4 md:pb-5 ${dir === "rtl" ? "text-right" : ""}`}>
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
