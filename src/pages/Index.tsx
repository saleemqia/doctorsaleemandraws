import { useState, useEffect } from "react";
import { track, startClickTracking } from "@/lib/track";
import Navbar from "@/components/dental/Navbar";
import Footer from "@/components/dental/Footer";
import BookingModal from "@/components/dental/BookingModal";
import ChatBot from "@/components/dental/ChatBot";
import ScrollToTop from "@/components/dental/ScrollToTop";
import MobileActionBar from "@/components/dental/MobileActionBar";

import HomeContent from "@/components/dental/HomeContent";
import { parsePath, pathFor, type SitePage } from "@/config/seo";
import { designForDate } from "@/lib/designRotation";

const Index = () => {
  const [design, setDesign] = useState(() => designForDate(new Date()));
  useEffect(() => {
    const timer = window.setInterval(() => setDesign(designForDate(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const openBooking = (place: string) => () => {
    track("book_open", place);
    setIsBookingOpen(true);
  };

  useEffect(() => {
    track("page_view");
    startClickTracking();
    // Coming back from a sub-page with a section in the address (e.g. /ar#contact): go there.
    if (window.location.hash.length > 1) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const moved: Record<string, SitePage> = { smile: "/smile-preview", clinic: "/our-clinic", technology: "/digital-dentistry", videos: "/digital-dentistry", faq: "/faq", hours: "/opening-hours", duhok: "/duhok", "before-after": "/gallery", instagram: "/social/instagram", case: "/case", kids: "/kids", posters: "/infographics", news: "/news", treatments: "/treatments" };
      if (moved[id]) {
        window.location.replace(pathFor(parsePath(window.location.pathname)?.lang ?? "en", moved[id]));
        return;
      }
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 400);
    }
  }, []);
  return (
    <div data-design={design} className="saleem-home min-h-screen bg-background scroll-smooth pb-[calc(56px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Navbar onBookingClick={openBooking("navbar")} />
      <main><HomeContent onBookingClick={openBooking("home")} /></main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ChatBot onBookingClick={openBooking("chat")} />
      <ScrollToTop />
      <MobileActionBar onBookingClick={openBooking("mobile_bar")} />
    </div>
  );
};

export default Index;
