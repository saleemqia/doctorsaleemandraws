import { useState } from "react";
import { motion } from "framer-motion";
import { Baby, Smile, Lightbulb, Stethoscope, Siren, Info, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { KIDS_TEETH } from "@/config/kidsTeeth";

interface KidsTeethProps {
  onBookingClick: () => void;
}

// Parents' guide: baby and permanent teeth (when they come in and fall out), care by age,
// tips, warning signs and dental emergencies. Text lives in src/config/kidsTeeth.ts.
const KidsTeeth = ({ onBookingClick }: KidsTeethProps) => {
  const { language } = useLanguage();
  const c = KIDS_TEETH[language];
  const [tab, setTab] = useState<"baby" | "permanent">("baby");
  const rows = tab === "baby" ? c.baby : c.permanent;

  const fade = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <section id="kids" className="py-16 md:py-24 lg:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="container">
        {/* Heading */}
        <motion.div {...fade} className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Baby className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        {/* Eruption / shedding table */}
        <motion.div {...fade} className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-card p-4 sm:p-6 mb-12 md:mb-16">
          <div role="tablist" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-secondary mb-5">
            {(["baby", "permanent"] as const).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`py-2.5 px-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                  tab === key ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key === "baby" ? c.tabBaby : c.tabPermanent}
              </button>
            ))}
          </div>

          <p className="text-sm sm:text-base text-foreground mb-4">{tab === "baby" ? c.babySummary : c.permanentSummary}</p>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-secondary text-foreground">
                <tr>
                  <th className="text-start font-semibold px-3 sm:px-4 py-2.5">{c.colTooth}</th>
                  <th className="text-start font-semibold px-3 sm:px-4 py-2.5 whitespace-nowrap">{c.colErupt}</th>
                  {tab === "baby" && <th className="text-start font-semibold px-3 sm:px-4 py-2.5 whitespace-nowrap">{c.colShed}</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-t border-border even:bg-secondary/30">
                    <td className="px-3 sm:px-4 py-2.5 text-foreground">{r.name}</td>
                    <td className="px-3 sm:px-4 py-2.5 text-primary font-semibold whitespace-nowrap">{r.erupt}</td>
                    {tab === "baby" && <td className="px-3 sm:px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{r.shed}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2.5 mt-4 p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">{c.sixYearMolar}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{c.normalNote}</p>
        </motion.div>

        {/* Care by age */}
        <motion.h3 {...fade} className="font-display text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          {c.careTitle}
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
          {c.ages.map((step, i) => (
            <motion.div
              key={step.age}
              {...fade}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-soft"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold mb-3">
                {step.age}
              </span>
              <h4 className="font-semibold text-foreground mb-3">{step.title}</h4>
              <ul className="space-y-2">
                {step.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Tips, when to visit, emergencies */}
        <div className="grid lg:grid-cols-3 gap-4 mb-10">
          <motion.div {...fade} className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              {c.tipsTitle}
            </h3>
            <ul className="space-y-2.5">
              {c.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                  <Smile className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fade} className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <Stethoscope className="w-5 h-5 text-primary" />
              {c.visitTitle}
            </h3>
            <ul className="space-y-2.5">
              {c.visit.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fade} className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6 dark:bg-red-950/30 dark:border-red-900">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-4 text-red-800 dark:text-red-300">
              <Siren className="w-5 h-5" />
              {c.emergencyTitle}
            </h3>
            <ul className="space-y-3">
              {c.emergency.map((e) => (
                <li key={e} className="text-sm text-red-900 dark:text-red-200 leading-relaxed">
                  {e}
                </li>
              ))}
            </ul>
            <a
              href="tel:07507816500"
              className="mt-4 inline-flex items-center justify-center w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 transition-colors"
              dir="ltr"
            >
              0750 781 6500
            </a>
          </motion.div>
        </div>

        <div className="text-center">
          <Button variant="teal" size="lg" onClick={onBookingClick} className="gap-2">
            <Calendar className="w-5 h-5" />
            {c.cta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KidsTeeth;
