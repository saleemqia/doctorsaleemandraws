import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Home } from "lucide-react";
import { track, startClickTracking } from "@/lib/track";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/config/seo";
import Navbar from "@/components/dental/Navbar";
import Footer from "@/components/dental/Footer";
import BookingModal from "@/components/dental/BookingModal";
import ChatBot from "@/components/dental/ChatBot";
import ScrollToTop from "@/components/dental/ScrollToTop";
import MobileActionBar from "@/components/dental/MobileActionBar";

const BACK = { en: "Back to the home page", ar: "العودة إلى الصفحة الرئيسية", ku: "زڤڕین بۆ پەڕێ سەرەکی" };

// Shared frame for sub-pages (/case, /kids): same header, footer, booking and chat as home.
const SubPage = ({ name, children }: { name: string; children: (openBooking: (place: string) => () => void) => ReactNode }) => {
  const { language } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const openBooking = (place: string) => () => {
    track("book_open", `${name}:${place}`);
    setIsBookingOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    track("page_view", name);
    startClickTracking();
  }, [name]);

  return (
    <div className="min-h-screen bg-background pb-[calc(56px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Navbar onBookingClick={openBooking("navbar")} />
      <main className="pt-24 sm:pt-28">
        <div className="container">
          <a
            href={pathFor(language, "")}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180 rtl:rotate-0" />
            <Home className="w-4 h-4" />
            {BACK[language]}
          </a>
        </div>
        {children(openBooking)}
      </main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ChatBot onBookingClick={openBooking("chat")} />
      <ScrollToTop />
      <MobileActionBar onBookingClick={openBooking("mobile_bar")} />
    </div>
  );
};

export default SubPage;
