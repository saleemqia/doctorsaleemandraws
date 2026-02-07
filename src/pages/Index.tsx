import { useState } from "react";
import Navbar from "@/components/dental/Navbar";
import Hero from "@/components/dental/Hero";
import Services from "@/components/dental/Services";
import About from "@/components/dental/About";
import Gallery from "@/components/dental/Gallery";
import Appointments from "@/components/dental/Appointments";
import Testimonials from "@/components/dental/Testimonials";
import Contact from "@/components/dental/Contact";
import Footer from "@/components/dental/Footer";
import BookingModal from "@/components/dental/BookingModal";
import ChatBot from "@/components/dental/ChatBot";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookingClick={() => setIsBookingOpen(true)} />
      <main>
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
        <Services />
        <About />
        <Appointments />
        <Gallery />
        <Testimonials />
        <Contact onBookingClick={() => setIsBookingOpen(true)} />
      </main>
      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ChatBot />
    </div>
  );
};

export default Index;
