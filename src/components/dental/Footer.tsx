import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <span className="text-xl">🦷</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Dr. Saleem Andraws</h3>
                <p className="text-sm text-background/70">Dental Clinic</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md mb-4">
              Professional dental care in Duhok. M.Sc. Oral Radiology, B.D.S. from University of Baghdad. 
              Committed to providing exceptional care for your smile.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://linktr.ee/saleem.andraws" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-background/10 hover:bg-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:07507816500" className="hover:text-primary transition-colors">07507816500</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:dr.saleemo@gmail.com" className="hover:text-primary transition-colors">dr.saleemo@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Duhok - KRO - Above Sherko Nuts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
          <p>© {new Date().getFullYear()} Dr. Saleem Andraws Dental Clinic. All rights reserved.</p>
          <p>Open Daily: 3:00 PM - 9:00 PM (Except Friday)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;