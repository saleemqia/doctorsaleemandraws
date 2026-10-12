import { Phone, Calendar, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER } from "@/config/clinic";

interface MobileActionBarProps {
  onBookingClick: () => void;
}

// Phones only: the three things a patient wants, always one tap away at the bottom of the screen.
const MobileActionBar = ({ onBookingClick }: MobileActionBarProps) => {
  const { t } = useLanguage();

  const item =
    "flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] text-[13px] font-semibold transition-colors active:bg-secondary";

  return (
    <nav
      aria-label="Quick actions"
      data-track="mobile_bar"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-6px_24px_-12px_hsl(205_45%_15%/0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex divide-x divide-border rtl:divide-x-reverse">
        <a href="tel:07507816500" className={`${item} text-foreground`}>
          <Phone className="w-5 h-5 text-primary" />
          {t("mobile.call")}
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} text-foreground`}
        >
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
          {t("mobile.whatsapp")}
        </a>
        <button type="button" onClick={onBookingClick} className={`${item} bg-gradient-primary text-primary-foreground`}>
          <Calendar className="w-5 h-5" />
          {t("mobile.book")}
        </button>
      </div>
    </nav>
  );
};

export default MobileActionBar;
