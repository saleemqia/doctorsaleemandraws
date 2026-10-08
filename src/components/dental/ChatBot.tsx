import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Calendar, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_DIRECTIONS_URL, WHATSAPP_NUMBER } from "@/config/clinic";
import { findTopic, topicById, CHIP_TOPIC, SYMPTOM_CHIPS, type AssistantAction, type Topic } from "@/lib/assistant";
import { track } from "@/lib/track";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  actions?: AssistantAction[];
  suggestions?: string[]; // translation keys of follow-up questions
}

interface ChatBotProps {
  onBookingClick?: () => void;
}

// Questions offered as one-tap chips. Each chip's text is also matched by findTopic.
const QUICK_KEYS = ["chat.quickCheck", "chat.quickSameDay", "chat.quickPrices", "chat.quickServices", "chat.quickHours", "chat.quickLocation", "chat.quickBooking"];

// After answering a topic, suggest a few related questions (FAQ question keys).
const FOLLOW_UPS: Record<string, string[]> = {
  sameDay: ["chat.quickLocation", "chat.quickPrices"],
  prices: ["chat.quickSameDay", "chat.quickServices"],
  hours: ["chat.quickSameDay", "chat.quickLocation"],
  location: ["chat.quickHours", "chat.quickSameDay"],
  booking: ["chat.quickHours", "chat.quickLocation"],
  services: ["faq.q8", "faq.q9", "faq.q17"],
  implants: ["chat.quickPrices", "faq.q13"],
  veneers: ["chat.quickPrices", "faq.q10"],
  crowns: ["faq.q8", "chat.quickPrices"],
  whitening: ["faq.q16", "faq.q9"],
  rootCanal: ["chat.quickSameDay", "faq.q13"],
  extraction: ["faq.q8", "chat.quickSameDay"],
  braces: ["chat.quickPrices", "chat.quickBooking"],
  children: ["chat.quickSameDay", "faq.q16"],
  cleaning: ["faq.q10", "chat.quickBooking"],
  checker: SYMPTOM_CHIPS.map((c) => `sym.c.${c}`),
  toothache: ["sym.c.toothCold", "sym.c.toothNight", "sym.c.toothBite"],
  toothCold: ["chat.quickSameDay", "chat.quickCheck"],
  toothNight: ["chat.quickSameDay", "chat.quickCheck"],
  toothBite: ["chat.quickSameDay", "chat.quickCheck"],
  swelling: ["chat.quickLocation", "chat.quickCheck"],
  gums: ["chat.quickSameDay", "chat.quickCheck"],
  sensitivity: ["chat.quickSameDay", "chat.quickCheck"],
  broken: ["chat.quickSameDay", "chat.quickLocation"],
  loose: ["chat.quickSameDay", "chat.quickCheck"],
  breath: ["chat.quickSameDay", "chat.quickCheck"],
  afterExt: ["chat.quickSameDay", "chat.quickLocation"],
  jaw: ["chat.quickSameDay", "chat.quickCheck"],
};

// A friendly tooth with a face: blinks and waves so the helper looks alive.
const ToothHelper = ({ className = "", wave = false }: { className?: string; wave?: boolean }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M32 8c-5-4-14-4-18 2-4 6-2 14 1 20 2 5 2 10 3 15 1 5 3 11 7 11 3 0 4-5 5-10 1-3 1-5 2-5s1 2 2 5c1 5 2 10 5 10 4 0 6-6 7-11 1-5 1-10 3-15 3-6 5-14 1-20-4-6-13-6-18-2z" fill="#fff" stroke="#bfe6f5" strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 14c-3 1-5 4-5 8" fill="none" stroke="#e6f6fc" strokeWidth="3" strokeLinecap="round" />
    <g className="tooth-eyes" style={{ transformOrigin: "32px 28px" }}><circle cx="25.5" cy="28" r="2.6" fill="#0b3b57" /><circle cx="38.5" cy="28" r="2.6" fill="#0b3b57" /></g>
    <circle cx="21" cy="34" r="3" fill="#ffb3a7" opacity=".7" /><circle cx="43" cy="34" r="3" fill="#ffb3a7" opacity=".7" />
    <path d="M26 36c2 3 10 3 12 0" fill="none" stroke="#0b3b57" strokeWidth="2.4" strokeLinecap="round" />
    {wave && <path d="M52 18l4-3m-3 7l5 0" stroke="#ffc83d" strokeWidth="2.5" strokeLinecap="round" className="tooth-spark" />}
  </svg>
);

const ChatBot = ({ onBookingClick }: ChatBotProps) => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [nudge, setNudge] = useState<number | null>(null);

  // While the chat is closed the tooth pops up a short hint now and then (first after 4 s, then about every 30 s), never while it is open.
  useEffect(() => {
    if (isOpen) { setNudge(null); return; }
    let i = 0;
    let hideT: ReturnType<typeof setTimeout>;
    const show = () => { setNudge(i % 3); i++; hideT = setTimeout(() => setNudge(null), 7000); };
    const first = setTimeout(show, 4000);
    const every = setInterval(show, 30000);
    return () => { clearTimeout(first); clearInterval(every); clearTimeout(hideT); };
  }, [isOpen]);

  const welcome = (): Message => ({ id: 1, text: t("chat.welcome"), isBot: true, suggestions: QUICK_KEYS });

  useEffect(() => {
    if (isOpen && messages.length === 0) setMessages([welcome()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Start the conversation again in the new language.
  useEffect(() => {
    if (messages.length > 0) setMessages([welcome()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const answer = (question: string, forced?: Topic): Message => {
    const topic = forced ?? findTopic(question);
    track("chat_question", topic?.id ?? "not_understood");
    if (!topic) {
      return { id: Date.now() + 1, text: t("chat.fallback"), isBot: true, actions: ["whatsapp", "call"], suggestions: QUICK_KEYS.slice(0, 4) };
    }
    if (topic.id === "greeting") return { ...welcome(), id: Date.now() + 1 };
    return {
      id: Date.now() + 1,
      text: t(topic.answerKey),
      isBot: true,
      actions: topic.actions,
      suggestions: FOLLOW_UPS[topic.id],
    };
  };

  const handleSend = (text: string = input, chipKey?: string) => {
    const q = text.trim();
    const forced = chipKey && CHIP_TOPIC[chipKey] ? topicById(CHIP_TOPIC[chipKey]) : undefined;
    if (!q || typing) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: q, isBot: false }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, answer(q, forced)]);
      setTyping(false);
    }, 500);
  };

  const actionButton = (action: AssistantAction) => {
    const base = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors";
    switch (action) {
      case "book":
        return (
          <button key={action} type="button" onClick={() => { setIsOpen(false); onBookingClick?.(); }}
            className={`${base} bg-gradient-primary text-primary-foreground hover:opacity-90`}>
            <Calendar className="w-3.5 h-3.5" />{t("chat.action.book")}
          </button>
        );
      case "whatsapp":
        return (
          <a key={action} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className={`${base} bg-[#25D366] text-white hover:opacity-90`}>
            <MessageCircle className="w-3.5 h-3.5" />{t("chat.action.whatsapp")}
          </a>
        );
      case "call":
        return (
          <a key={action} href="tel:07507816500" className={`${base} border border-primary/40 text-primary hover:bg-primary/10`}>
            <Phone className="w-3.5 h-3.5" />{t("chat.action.call")}
          </a>
        );
      case "directions":
        return (
          <a key={action} href={GOOGLE_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
            className={`${base} border border-primary/40 text-primary hover:bg-primary/10`}>
            <MapPin className="w-3.5 h-3.5" />{t("chat.action.directions")}
          </a>
        );
    }
  };

  const last = messages[messages.length - 1];

  return (
    <>
      {/* Chat Button: a waving tooth helper with a speech bubble that pops up now and then */}
      <div className={`fixed bottom-[84px] md:bottom-6 ${dir === "rtl" ? "left-3 md:left-6" : "right-3 md:right-6"} z-30 flex items-end gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""} ${isOpen ? "hidden" : ""}`}>
        <AnimatePresence>
          {nudge !== null && (
            <motion.button
              key={nudge}
              type="button"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => { setNudge(null); setIsOpen(true); track("chat_open", "nudge"); }}
              className="mb-3 max-w-[200px] rounded-2xl rounded-ee-sm bg-white px-3.5 py-2 text-start text-sm font-semibold text-foreground shadow-elevated ring-1 ring-[hsl(var(--aqua)/0.4)]"
            >
              {t(`chat.nudge${nudge + 1}`)}
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={() => { setNudge(null); setIsOpen(true); track("chat_open"); }}
          aria-label={t("chat.title")}
          className="tooth-btn relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--primary))] shadow-[0_10px_28px_-6px_hsl(var(--primary)/0.7)] ring-4 ring-white transition-transform hover:scale-110 md:h-[76px] md:w-[76px]"
        >
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[hsl(var(--aqua)/0.5)] motion-safe:animate-ping [animation-duration:2.6s]" />
          <ToothHelper wave className="tooth-bob relative h-[48px] w-[48px] md:h-[54px] md:w-[54px]" />
          <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--coral))] text-[10px] font-bold text-white" aria-hidden="true">1</span>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            role="dialog"
            data-track="chat"
            aria-label={t("chat.title")}
            className={`fixed bottom-[84px] md:bottom-6 ${dir === "rtl" ? "left-4 md:left-6" : "right-4 md:right-6"} z-50 w-[370px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100dvh-170px)] md:max-h-[calc(100vh-120px)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center">
                  <ToothHelper className="tooth-bob w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("chat.title")}</h3>
                  <p className="text-xs text-white/85 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    {t("chat.status")}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${message.isBot ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      message.isBot
                        ? "bg-secondary text-secondary-foreground rounded-es-md"
                        : "bg-primary text-primary-foreground rounded-ee-md"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.isBot && message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">{message.actions.map(actionButton)}</div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-start">
                  <div className="bg-secondary rounded-2xl rounded-es-md px-4 py-3 flex gap-1" aria-label="…">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions for the latest answer */}
            {!typing && last?.isBot && last.suggestions && last.suggestions.length > 0 && (
              <div className="px-4 pb-2">
                {messages.length > 1 && <p className="text-[11px] text-muted-foreground mb-1.5">{t("chat.more")}</p>}
                <div className="flex flex-wrap gap-1.5 max-h-[132px] overflow-y-auto">
                  {last.suggestions.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleSend(t(key), key)}
                      className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              className="p-3 border-t border-border flex gap-2"
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                aria-label={t("chat.placeholder")}
                className="flex-1 min-w-0 px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-base md:text-sm"
              />
              <Button type="submit" variant="teal" size="icon" className="rounded-full shrink-0" aria-label="Send">
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
