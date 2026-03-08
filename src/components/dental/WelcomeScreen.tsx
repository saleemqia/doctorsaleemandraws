import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"tooth" | "text" | "exit">("tooth");

  const playWelcomeSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Pleasant chime melody
      const notes = [
        { freq: 523.25, start: 0, dur: 0.25 },    // C5
        { freq: 659.25, start: 0.15, dur: 0.25 },  // E5
        { freq: 783.99, start: 0.3, dur: 0.35 },   // G5
        { freq: 1046.5, start: 0.5, dur: 0.5 },    // C6
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      });
    } catch (e) {
      // Audio not supported, continue silently
    }
  }, []);

  useEffect(() => {
    // Tooth appears, then play sound after tooth animation
    const soundTimer = setTimeout(() => {
      playWelcomeSound();
    }, 600);

    const textTimer = setTimeout(() => setPhase("text"), 800);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const completeTimer = setTimeout(onComplete, 3400);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, playWelcomeSound]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-primary"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onComplete}
            className="absolute top-8 right-8 text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors backdrop-blur-sm"
          >
            {t("welcome.skip") !== "welcome.skip" ? t("welcome.skip") : "Skip"}
          </motion.button>
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, hsla(0,0%,100%,0.15) 0%, transparent 70%)" }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Tooth icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-8xl md:text-9xl drop-shadow-2xl block">🦷</span>
            </motion.div>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase === "text" ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {t("welcome.title") !== "welcome.title" ? t("welcome.title") : "Welcome to Our Clinic"}
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light">
              {t("welcome.subtitle") !== "welcome.subtitle" ? t("welcome.subtitle") : "Your smile is our passion"}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
