import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = "en" | "ar" | "ku";

// Opening hours: every day 15:00–21:00 except Friday (day off). Times are Duhok time (Asia/Baghdad).
const OPEN_HOUR = 15;
const CLOSE_HOUR = 21;
const DAY_OFF = 5; // Friday (0 = Sunday)

// Week starts on Saturday, as in Iraq. Each day has its own colour.
const DAYS: { idx: number; name: Record<L, string>; color: string; ring: string; text: string }[] = [
  { idx: 6, name: { en: "Saturday", ar: "السبت", ku: "شەممی" }, color: "bg-sky-100 dark:bg-sky-900/40", ring: "ring-sky-400", text: "text-sky-800 dark:text-sky-200" },
  { idx: 0, name: { en: "Sunday", ar: "الأحد", ku: "یەکشەممی" }, color: "bg-emerald-100 dark:bg-emerald-900/40", ring: "ring-emerald-400", text: "text-emerald-800 dark:text-emerald-200" },
  { idx: 1, name: { en: "Monday", ar: "الإثنين", ku: "دووشەممی" }, color: "bg-violet-100 dark:bg-violet-900/40", ring: "ring-violet-400", text: "text-violet-800 dark:text-violet-200" },
  { idx: 2, name: { en: "Tuesday", ar: "الثلاثاء", ku: "سێشەممی" }, color: "bg-amber-100 dark:bg-amber-900/40", ring: "ring-amber-400", text: "text-amber-800 dark:text-amber-200" },
  { idx: 3, name: { en: "Wednesday", ar: "الأربعاء", ku: "چارشەممی" }, color: "bg-rose-100 dark:bg-rose-900/40", ring: "ring-rose-400", text: "text-rose-800 dark:text-rose-200" },
  { idx: 4, name: { en: "Thursday", ar: "الخميس", ku: "پێنجشەممی" }, color: "bg-teal-100 dark:bg-teal-900/40", ring: "ring-teal-400", text: "text-teal-800 dark:text-teal-200" },
  { idx: 5, name: { en: "Friday", ar: "الجمعة", ku: "ئینی" }, color: "bg-indigo-950", ring: "ring-indigo-400", text: "text-indigo-100" },
];

const T: Record<L, Record<string, string>> = {
  en: {
    badge: "Opening hours",
    title1: "When Are We",
    title2: "Open?",
    hours: "3:00 – 9:00 PM",
    off: "Day off",
    sleeping: "The tooth is sleeping… Zzz",
    today: "Today",
    openNow: "Open now, until 9:00 PM",
    opensToday: "Opens today at 3:00 PM",
    closedNow: "Closed now, opens tomorrow at 3:00 PM",
    closedFriday: "Today is our day off. See you Saturday at 3:00 PM",
    closedThursday: "Closed now. Tomorrow (Friday) is our day off, see you Saturday at 3:00 PM",
    sameDay: "Same-day visits available",
  },
  ar: {
    badge: "أوقات الدوام",
    title1: "متى",
    title2: "نستقبلكم؟",
    hours: "٣:٠٠ – ٩:٠٠ مساءً",
    off: "عطلة",
    sleeping: "السن نائم… Zzz",
    today: "اليوم",
    openNow: "مفتوح الآن حتى ٩:٠٠ مساءً",
    opensToday: "نفتح اليوم الساعة ٣:٠٠ مساءً",
    closedNow: "مغلق الآن، نفتح غداً الساعة ٣:٠٠ مساءً",
    closedFriday: "اليوم عطلتنا. نراكم السبت الساعة ٣:٠٠ مساءً",
    closedThursday: "مغلق الآن. غداً (الجمعة) عطلة، نراكم السبت الساعة ٣:٠٠ مساءً",
    sameDay: "مواعيد في نفس اليوم متاحة",
  },
  ku: {
    badge: "دەمێن کاری",
    title1: "کەنگی",
    title2: "ڤەکری نە؟",
    hours: "٣:٠٠ – ٩:٠٠ ئێڤاری",
    off: "بێهنڤەدان",
    sleeping: "ددان دنڤیت… Zzz",
    today: "ئەڤرۆ",
    openNow: "نوکە ڤەکری یە هەتا ٩:٠٠ ئێڤاری",
    opensToday: "ئەڤرۆ دەمژمێر ٣:٠٠ ئێڤاری ڤەدبیت",
    closedNow: "نوکە گرتی یە، سوبەهی دەمژمێر ٣:٠٠ ڤەدبیت",
    closedFriday: "ئەڤرۆ ڕۆژا بێهنڤەدانا مە یە. شەممی دەمژمێر ٣:٠٠ دبینین",
    closedThursday: "نوکە گرتی یە. سوبەهی (ئینی) بێهنڤەدانە، شەممی دەمژمێر ٣:٠٠ دبینین",
    sameDay: "سەردان د هەمان ڕۆژێ دا بەردەستە",
  },
};

// Current weekday (0 = Sunday) and hour in Duhok, whatever the visitor's own time zone.
const nowInDuhok = () => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Baghdad", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd), hour };
};

// A sleeping tooth: closed eyes, a night cap, slow breathing and floating "z"s.
const SleepingTooth = () => (
  <div className="relative w-20 h-20 mx-auto" aria-hidden="true">
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* tooth */}
      <path
        d="M28 30c0-10 9-16 22-12 13-4 22 2 22 12 0 9-3 16-5 26-2 11-3 26-9 26-5 0-5-16-8-16s-3 16-8 16c-6 0-7-15-9-26-2-10-5-17-5-26z"
        fill="#ffffff"
        stroke="#c7d2fe"
        strokeWidth="2"
      />
      {/* closed eyes */}
      <path d="M38 42c2 3 6 3 8 0M54 42c2 3 6 3 8 0" fill="none" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" />
      {/* cheeks and small smile */}
      <circle cx="36" cy="50" r="3" fill="#fda4af" opacity=".7" />
      <circle cx="64" cy="50" r="3" fill="#fda4af" opacity=".7" />
      <path d="M46 52c2 2 6 2 8 0" fill="none" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
      {/* night cap */}
      <path d="M30 26c4-14 30-20 40-8-8-2-14 2-16 8z" fill="#6366f1" />
      <path d="M30 26c6-3 18-6 24-8" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
      <circle cx="72" cy="17" r="4" fill="#fde68a" />
    </motion.svg>
    {/* floating z's */}
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute font-bold text-indigo-200 select-none"
        style={{ right: -4 - i * 6, top: 4, fontSize: 10 + i * 4 }}
        initial={{ opacity: 0, y: 0, x: 0 }}
        animate={{ opacity: [0, 1, 0], y: -26, x: 8 }}
        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
      >
        z
      </motion.span>
    ))}
    {/* moon */}
    <span className="absolute -left-2 top-0 text-lg">🌙</span>
  </div>
);

const WeeklyHours = () => {
  const { language } = useLanguage();
  const lang = language as L;
  const t = T[lang];
  const [now, setNow] = useState(nowInDuhok);

  useEffect(() => {
    const id = setInterval(() => setNow(nowInDuhok()), 60_000);
    return () => clearInterval(id);
  }, []);

  const status =
    now.day === DAY_OFF
      ? t.closedFriday
      : now.hour < OPEN_HOUR
        ? t.opensToday
        : now.hour < CLOSE_HOUR
          ? t.openNow
          : now.day === 4
            ? t.closedThursday
            : t.closedNow;
  const isOpen = now.day !== DAY_OFF && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR;

  return (
    <section id="hours" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <CalendarClock className="w-4 h-4" />
            {t.badge}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            {t.title1} <span className="text-gradient">{t.title2}</span>
          </h2>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm sm:text-base font-semibold ${
              isOpen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-muted text-foreground"
            }`}
            aria-live="polite"
          >
            <span className={`relative flex w-2.5 h-2.5`}>
              {isOpen && <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />}
              <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
            </span>
            {status}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map((d, i) => {
            const isToday = d.idx === now.day;
            const off = d.idx === DAY_OFF;
            return (
              <motion.div
                key={d.idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`relative rounded-2xl p-4 text-center ${d.color} ${isToday ? `ring-4 ${d.ring} shadow-card` : ""} ${
                  off ? "col-span-2 sm:col-span-4 lg:col-span-1" : ""
                }`}
              >
                {off && (
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {[[12, 18], [80, 12], [30, 70], [88, 60], [60, 30]].map(([x, y], k) => (
                      <motion.span
                        key={k}
                        className="absolute w-1 h-1 rounded-full bg-white"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + k * 0.4, repeat: Infinity }}
                      />
                    ))}
                  </div>
                )}
                {isToday && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-foreground text-background text-[11px] font-bold">
                    {t.today}
                  </span>
                )}
                <p className={`font-bold text-base ${d.text}`}>{d.name[lang]}</p>
                {off ? (
                  <div className="relative">
                    <SleepingTooth />
                    <p className="font-semibold text-indigo-100">{t.off}</p>
                    <p className="text-xs text-indigo-300 mt-0.5">{t.sleeping}</p>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl my-2" aria-hidden="true">🦷</div>
                    <p className={`text-sm font-semibold ${d.text}`}>{t.hours}</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">{t.sameDay} ✓</p>
      </div>
    </section>
  );
};

export default WeeklyHours;
