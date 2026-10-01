import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, Calendar, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GOOGLE_DIRECTIONS_URL, WHATSAPP_NUMBER } from "@/config/clinic";
import { findTopic, type AssistantAction } from "@/lib/assistant";

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
const QUICK_KEYS = ["chat.quickSameDay", "chat.quickPrices", "chat.quickServices", "chat.quickHours", "chat.quickLocation", "chat.quickBooking"];

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
};

const ChatBot = ({ onBookingClick }: ChatBotProps) => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const answer = (question: string): Message => {
    const topic = findTopic(question);
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

  const handleSend = (text: string = input) => {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: q, isBot: false }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, answer(q)]);
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
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        aria-label={t("chat.title")}
        className={`fixed bottom-[84px] md:bottom-6 ${dir === "rtl" ? "left-4 md:left-6" : "right-4 md:right-6"} z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-primary text-white shadow-teal hover:shadow-elevated transition-shadow flex items-center justify-center ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" aria-hidden="true" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            role="dialog"
            aria-label={t("chat.title")}
            className={`fixed bottom-[84px] md:bottom-6 ${dir === "rtl" ? "left-4 md:left-6" : "right-4 md:right-6"} z-50 w-[370px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100dvh-170px)] md:max-h-[calc(100vh-120px)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
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
                <div className="flex flex-wrap gap-1.5 max-h-[84px] overflow-y-auto">
                  {last.suggestions.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleSend(t(key))}
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
