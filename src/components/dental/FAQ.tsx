import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { t, dir } = useLanguage();

  const faqs = [
    { qKey: "faq.q1", aKey: "faq.a1" },
    { qKey: "faq.q2", aKey: "faq.a2" },
    { qKey: "faq.q3", aKey: "faq.a3" },
    { qKey: "faq.q4", aKey: "faq.a4" },
    { qKey: "faq.q5", aKey: "faq.a5" },
    { qKey: "faq.q6", aKey: "faq.a6" },
  ];

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
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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
                <AccordionTrigger className={`text-sm md:text-base font-semibold hover:text-primary transition-colors py-4 md:py-5 ${dir === "rtl" ? "text-right flex-row-reverse" : ""}`}>
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
