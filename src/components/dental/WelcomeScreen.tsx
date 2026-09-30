import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import clinicLogo from "@/assets/clinic-logo.png";

// Short, silent intro: visible for ~0.9s in total, then hands over to the page.
const TOTAL_MS = 900;

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onComplete, TOTAL_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-primary cursor-pointer"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: TOTAL_MS / 1000, times: [0, 0.7, 1], ease: "easeOut" }}
        onClick={onComplete}
        role="presentation"
      >
        <motion.img
          src={clinicLogo}
          alt="Dr. Saleem Andraws Dental Clinic"
          className="h-28 md:h-36 w-auto object-contain drop-shadow-2xl mb-6"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.p
          className="font-display text-2xl md:text-4xl font-bold text-white drop-shadow-lg text-center px-6"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          {t("welcome.title")}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
