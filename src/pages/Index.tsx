import { useState } from "react";
import Navbar from "@/components/dental/Navbar";
import Hero from "@/components/dental/Hero";
import Services from "@/components/dental/Services";
import About from "@/components/dental/About";
import Gallery from "@/components/dental/Gallery";
import InstagramFeed from "@/components/dental/InstagramFeed";
import Testimonials from "@/components/dental/Testimonials";
import FAQ from "@/components/dental/FAQ";
import Contact from "@/components/dental/Contact";
import Footer from "@/components/dental/Footer";
import BookingModal from "@/components/dental/BookingModal";
import ChatBot from "@/components/dental/ChatBot";
import ScrollToTop from "@/components/dental/ScrollToTop";
import MobileActionBar from "@/components/dental/MobileActionBar";
import WelcomeScreen from "@/components/dental/WelcomeScreen";

const WELCOME_KEY = "diamond-welcome-shown";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
      return sessionStorage.getItem(WELCOME_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const handleWelcomeComplete = () => {
    try {
      sessionStorage.setItem(WELCOME_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth pb-[calc(56px+env(safe-area-inset-bottom,0px))] md:pb-0">
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      <Navbar onBookingClick={() => setIsBookingOpen(true)} />
      <main>
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
        <Services />
        <About />
        <Gallery />
        <InstagramFeed />
        <Testimonials />
        <FAQ />
        <Contact onBookingClick={() => setIsBookingOpen(true)} />
      </main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ChatBot />
      <ScrollToTop />
      <MobileActionBar onBookingClick={() => setIsBookingOpen(true)} />
    </div>
  );
};

export default Index;
