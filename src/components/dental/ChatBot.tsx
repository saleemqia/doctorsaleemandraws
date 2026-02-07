import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const ChatBot = () => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    t("chat.quickServices"),
    t("chat.quickPrices"),
    t("chat.quickHours"),
    t("chat.quickBooking"),
  ];

  const getBotResponses = () => ({
    services: language === "ar" 
      ? "نقدم مجموعة واسعة من خدمات طب الأسنان:\n\n🦷 تبييض الأسنان\n🔧 زراعة الأسنان\n✨ طب الأسنان التجميلي\n🛡️ علاج قناة الجذر\n📐 تقويم الأسنان\n🔬 أشعة الفم\n🧹 تنظيف الأسنان\n👶 طب أسنان الأطفال\n\nهل تريد معرفة المزيد عن أي خدمة؟"
      : language === "ku"
      ? "کۆمەڵێک خزمەتگوزاری ددان پێشکەش دەکەین:\n\n🦷 سپیکردنەوەی ددان\n🔧 چاندنی ددان\n✨ ددانی جوانکاری\n🛡️ چارەسەری کەناڵی ڕەگ\n📐 ڕاستکردنەوەی ددان\n🔬 تیشکی دەم\n🧹 پاککردنەوەی ددان\n👶 ددانی منداڵان\n\nئایا دەتەوێت زیاتر بزانیت دەربارەی هەر خزمەتگوزارییەک؟"
      : "We offer a wide range of dental services:\n\n🦷 Teeth Whitening\n🔧 Dental Implants\n✨ Cosmetic Dentistry\n🛡️ Root Canal Treatment\n📐 Orthodontics (Braces)\n🔬 Oral Radiology\n🧹 Dental Cleaning\n👶 Pediatric Dentistry\n\nWould you like to know more about any specific service?",
    prices: language === "ar"
      ? "إليك أسعارنا:\n\n• تبييض الأسنان: من 150$\n• زراعة الأسنان: من 800$\n• طب الأسنان التجميلي: من 300$\n• علاج قناة الجذر: من 250$\n• تقويم الأسنان: من 1000$\n• أشعة الفم: من 50$\n• تنظيف الأسنان: من 75$\n• طب أسنان الأطفال: من 50$\n\nقد تختلف الأسعار حسب الحالات الفردية. هل تريد حجز استشارة؟"
      : language === "ku"
      ? "ئەمە نرخەکانمانە:\n\n• سپیکردنەوەی ددان: لە 150$ دەست پێدەکات\n• چاندنی ددان: لە 800$ دەست پێدەکات\n• ددانی جوانکاری: لە 300$ دەست پێدەکات\n• چارەسەری کەناڵی ڕەگ: لە 250$ دەست پێدەکات\n• ڕاستکردنەوەی ددان: لە 1000$ دەست پێدەکات\n• تیشکی دەم: لە 50$ دەست پێدەکات\n• پاککردنەوەی ددان: لە 75$ دەست پێدەکات\n• ددانی منداڵان: لە 50$ دەست پێدەکات\n\nنرخەکان لەوانەیە جیاواز بن بەپێی حاڵەتی کەسی. دەتەوێت نۆرەی پزیشک دابنێیت؟"
      : "Here are our starting prices:\n\n• Teeth Whitening: from $150\n• Dental Implants: from $800\n• Cosmetic Dentistry: from $300\n• Root Canal: from $250\n• Orthodontics: from $1000\n• Oral Radiology: from $50\n• Dental Cleaning: from $75\n• Pediatric Dentistry: from $50\n\nPrices may vary based on individual cases. Would you like to schedule a consultation?",
    hours: language === "ar"
      ? "عيادتنا مفتوحة:\n\n🕒 يومياً: 3:00 - 9:00 مساءً\n🚫 مغلق أيام الجمعة\n\n📍 الموقع: دهوك - KRO - فوق شيركو للمكسرات\n📞 اتصل بنا: 07507816500\n\nهل تريد حجز موعد؟"
      : language === "ku"
      ? "کلینیکەکەمان کراوەیە:\n\n🕒 ڕۆژانە: ٣:٠٠ - ٩:٠٠ ئێوارە\n🚫 داخراوە ڕۆژی هەینی\n\n📍 شوێن: دهۆک - KRO - سەرووی شیرکۆ نەتس\n📞 پەیوەندیمان پێوە بکە: 07507816500\n\nدەتەوێت نۆرەی پزیشک دابنێیت؟"
      : "Our clinic is open:\n\n🕒 Daily: 3:00 PM - 9:00 PM\n🚫 Closed on Fridays\n\n📍 Location: Duhok - KRO - Above Sherko Nuts\n📞 Call us: 07507816500\n\nWould you like to book an appointment?",
    booking: language === "ar"
      ? "يمكنك حجز موعد عبر:\n\n1️⃣ انقر على زر 'حجز موعد' في هذه الصفحة\n2️⃣ اتصل بنا مباشرة: 07507816500\n3️⃣ واتساب: انقر على الزر الأخضر\n4️⃣ البريد الإلكتروني: dr.saleemo@gmail.com\n\nسنؤكد موعدك خلال 24 ساعة!"
      : language === "ku"
      ? "دەتوانیت نۆرەی پزیشک دابنێیت لە ڕێگای:\n\n1️⃣ کلیک بکە لەسەر دوگمەی 'نۆرەی پزیشک' لەم لاپەڕەیەدا\n2️⃣ ڕاستەوخۆ پەیوەندیمان پێوە بکە: 07507816500\n3️⃣ واتساپ: کلیک بکە لەسەر دوگمەی سەوز\n4️⃣ ئیمەیڵ: dr.saleemo@gmail.com\n\nنۆرەی پزیشکت دڵنیا دەکەینەوە لە ماوەی ٢٤ کاتژمێردا!"
      : "You can book an appointment through:\n\n1️⃣ Click the 'Book Appointment' button on this page\n2️⃣ Call us directly: 07507816500\n3️⃣ WhatsApp us: Click the green button\n4️⃣ Email: dr.saleemo@gmail.com\n\nWe'll confirm your appointment within 24 hours!",
    default: language === "ar"
      ? "شكراً لرسالتك! للحصول على معلومات مفصلة، يرجى الاتصال بنا على:\n\n📞 الهاتف: 07507816500\n📧 البريد الإلكتروني: dr.saleemo@gmail.com\n💬 واتساب: انقر على الزر الأخضر\n\nأو يمكنك أن تسألني عن خدماتنا أو أسعارنا أو ساعات العمل!"
      : language === "ku"
      ? "سوپاس بۆ پەیامەکەت! بۆ زانیاری وردتر، تکایە پەیوەندیمان پێوە بکە لە:\n\n📞 تەلەفۆن: 07507816500\n📧 ئیمەیڵ: dr.saleemo@gmail.com\n💬 واتساپ: کلیک بکە لەسەر دوگمەی سەوز\n\nیان دەتوانیت پرسیارم لێبکەیت دەربارەی خزمەتگوزارییەکانمان، نرخەکان، یان کاتی کارکردن!"
      : "Thank you for your message! For detailed information, please contact us at:\n\n📞 Phone: 07507816500\n📧 Email: dr.saleemo@gmail.com\n💬 WhatsApp: Click the green button\n\nOr you can ask me about our services, prices, or working hours!",
  });

  // Initialize welcome message when language changes or chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        text: t("chat.welcome"),
        isBot: true,
      }]);
    }
  }, [isOpen, t, messages.length]);

  // Reset messages when language changes
  useEffect(() => {
    if (messages.length > 0) {
      setMessages([{
        id: 1,
        text: t("chat.welcome"),
        isBot: true,
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Bot response after a short delay
    setTimeout(() => {
      const lowerText = text.toLowerCase().trim();
      const responses = getBotResponses();
      
      let response = responses.default;
      
      if (lowerText.includes("service") || lowerText.includes("خدم") || lowerText.includes("خزمەت")) {
        response = responses.services;
      } else if (lowerText.includes("price") || lowerText.includes("سعر") || lowerText.includes("نرخ") || lowerText.includes("cost")) {
        response = responses.prices;
      } else if (lowerText.includes("hour") || lowerText.includes("time") || lowerText.includes("ساع") || lowerText.includes("کات") || lowerText.includes("open")) {
        response = responses.hours;
      } else if (lowerText.includes("book") || lowerText.includes("appointment") || lowerText.includes("حجز") || lowerText.includes("موعد") || lowerText.includes("نۆرە")) {
        response = responses.booking;
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${dir === "rtl" ? "left-6" : "right-6"} z-40 w-14 h-14 rounded-full bg-gradient-primary text-white shadow-teal hover:shadow-elevated transition-shadow flex items-center justify-center ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 ${dir === "rtl" ? "left-6" : "right-6"} z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 text-white flex items-center justify-between">
              <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className={dir === "rtl" ? "text-right" : ""}>
                  <h3 className="font-semibold">{t("chat.title")}</h3>
                  <p className="text-xs text-white/80">{t("chat.status")}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? (dir === "rtl" ? "justify-end" : "justify-start") : (dir === "rtl" ? "justify-start" : "justify-end")}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                      message.isBot
                        ? `bg-secondary text-secondary-foreground ${dir === "rtl" ? "rounded-br-md" : "rounded-bl-md"}`
                        : `bg-primary text-primary-foreground ${dir === "rtl" ? "rounded-bl-md" : "rounded-br-md"}`
                    }`}
                    dir={dir}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className="px-4 pb-2">
                <div className={`flex flex-wrap gap-2 ${dir === "rtl" ? "justify-end" : ""}`}>
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat.placeholder")}
                  dir={dir}
                  className={`flex-1 px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm ${dir === "rtl" ? "text-right" : ""}`}
                />
                <Button
                  variant="teal"
                  size="icon"
                  onClick={() => handleSend()}
                  className="rounded-full"
                >
                  <Send className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;