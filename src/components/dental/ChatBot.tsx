import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const quickReplies = [
  "What services do you offer?",
  "What are your prices?",
  "Working hours?",
  "How to book an appointment?",
];

const botResponses: Record<string, string> = {
  "what services do you offer?": "We offer a wide range of dental services including:\n\n🦷 Teeth Whitening\n🔧 Dental Implants\n✨ Cosmetic Dentistry\n🛡️ Root Canal Treatment\n📐 Orthodontics (Braces)\n🔬 Oral Radiology\n🧹 Dental Cleaning\n👶 Pediatric Dentistry\n\nWould you like to know more about any specific service?",
  "what are your prices?": "Here are our starting prices:\n\n• Teeth Whitening: from $150\n• Dental Implants: from $800\n• Cosmetic Dentistry: from $300\n• Root Canal: from $250\n• Orthodontics: from $1000\n• Oral Radiology: from $50\n• Dental Cleaning: from $75\n• Pediatric Dentistry: from $50\n\nPrices may vary based on individual cases. Would you like to schedule a consultation?",
  "working hours?": "Our clinic is open:\n\n🕒 Daily: 3:00 PM - 9:00 PM\n🚫 Closed on Fridays\n\n📍 Location: Duhok - KRO - Above Sherko Nuts\n📞 Call us: 07507816500\n\nWould you like to book an appointment?",
  "how to book an appointment?": "You can book an appointment through:\n\n1️⃣ Click the 'Book Appointment' button on this page\n2️⃣ Call us directly: 07507816500\n3️⃣ WhatsApp us: Click the green button\n4️⃣ Email: dr.saleemo@gmail.com\n\nWe'll confirm your appointment within 24 hours!",
  default: "Thank you for your message! For detailed information, please contact us at:\n\n📞 Phone: 07507816500\n📧 Email: dr.saleemo@gmail.com\n💬 WhatsApp: Click the green button\n\nOr you can ask me about our services, prices, or working hours!",
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 Welcome to Dr. Saleem Andraws Dental Clinic. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const response = botResponses[lowerText] || botResponses.default;

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
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-primary text-white shadow-teal hover:shadow-elevated transition-shadow flex items-center justify-center ${isOpen ? "hidden" : ""}`}
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
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Dental Assistant</h3>
                  <p className="text-xs text-white/80">Online • Quick replies</p>
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
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                      message.isBot
                        ? "bg-secondary text-secondary-foreground rounded-bl-md"
                        : "bg-primary text-primary-foreground rounded-br-md"
                    }`}
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
                <div className="flex flex-wrap gap-2">
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                />
                <Button
                  variant="teal"
                  size="icon"
                  onClick={() => handleSend()}
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
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