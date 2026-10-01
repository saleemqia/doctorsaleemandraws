import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import treatmentRoom from "@/assets/clinic/treatment-room.webp";
import reception from "@/assets/clinic/reception.webp";
import waitingRoom from "@/assets/clinic/waiting-room.webp";
import doctorOffice from "@/assets/clinic/doctor-office.webp";
import entrance from "@/assets/clinic/entrance.webp";

type L = "en" | "ar" | "ku";

const TEXT: Record<L, { badge: string; title1: string; title2: string; intro: string; close: string }> = {
  en: {
    badge: "Our clinic",
    title1: "Inside",
    title2: "Our Clinic",
    intro: "A clean, calm and modern place for your treatment, on Qazi Mohammad Road in Duhok.",
    close: "Close",
  },
  ar: {
    badge: "عيادتنا",
    title1: "من داخل",
    title2: "عيادتنا",
    intro: "مكان نظيف وهادئ وحديث لعلاجك، في شارع قاضي محمد في دهوك.",
    close: "إغلاق",
  },
  ku: {
    badge: "کلینیکا مە",
    title1: "ژ ناڤ",
    title2: "کلینیکا مە",
    intro: "جهەکێ پاقژ، هێمن و نوی بۆ چارەسەریا تە، ل شەقامێ قازی محەمەد ل دهوکێ.",
    close: "گرتن",
  },
};

// Photos of the clinic. "tall" photos are portrait and take two rows in the grid.
const PHOTOS: { src: string; tall?: boolean; wide?: boolean; mobileWide?: boolean; caption: Record<L, string> }[] = [
  { src: treatmentRoom, tall: true, caption: { en: "Treatment room", ar: "غرفة العلاج", ku: "ژوورا چارەسەریێ" } },
  { src: reception, wide: true, caption: { en: "Reception", ar: "الاستقبال", ku: "پێشوازی" } },
  { src: entrance, tall: true, mobileWide: true, caption: { en: "Clinic entrance", ar: "مدخل العيادة", ku: "دەرگەهێ کلینیکێ" } },
  { src: waitingRoom, caption: { en: "Waiting room", ar: "غرفة الانتظار", ku: "ژوورا چاڤەڕێبوونێ" } },
  { src: doctorOffice, caption: { en: "Doctor's office", ar: "غرفة الطبيب", ku: "ژوورا دکتۆری" } },
];

const ClinicTour = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const c = TEXT[lang];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="clinic" className="py-16 md:py-24 lg:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Building2 className="w-4 h-4" />
            {c.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {c.title1} <span className="text-gradient">{c.title2}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{c.intro}</p>
        </motion.div>

        <div className="grid grid-flow-dense grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[230px] gap-3 md:gap-4">
          {PHOTOS.map((p, i) => (
            <motion.button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${
                p.tall ? "row-span-2" : ""
              } ${p.wide ? "col-span-2" : ""} ${p.mobileWide ? "col-span-2 md:col-span-1" : ""}`}
            >
              <img
                src={p.src}
                alt={p.caption[lang]}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent text-white text-sm sm:text-base font-semibold p-3 pt-8 text-start">
                {p.caption[lang]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Full-size view */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-label={PHOTOS[open].caption[lang]}
            className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              aria-label={c.close}
              className="absolute top-4 end-4 p-2 rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={() => setOpen(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={PHOTOS[open].src} alt={PHOTOS[open].caption[lang]} className="w-full max-h-[80vh] object-contain rounded-xl" />
              <figcaption className="text-center text-white mt-3 font-semibold">{PHOTOS[open].caption[lang]}</figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ClinicTour;
