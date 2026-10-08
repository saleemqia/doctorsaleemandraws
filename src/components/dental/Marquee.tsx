import { useLanguage } from "@/contexts/LanguageContext";

const DOTS = ["bg-[hsl(var(--sun))]", "bg-[hsl(var(--aqua))]", "bg-[hsl(var(--coral))]", "bg-white"];

// A slow ribbon of every treatment on offer; decorative (the same names are real text in Services).
const Marquee = () => {
  const { t } = useLanguage();
  const names = t("services.allList").split("|");
  const row = names.map((n, i) => (
    <span key={i} className="inline-flex items-center gap-4 whitespace-nowrap px-4 font-display text-xl font-semibold sm:text-2xl">
      {n}<span className={`h-2.5 w-2.5 rounded-full ${DOTS[i % DOTS.length]}`} />
    </span>
  ));
  return (
    <div aria-hidden="true" dir="ltr" className="overflow-hidden bg-gradient-to-r from-[hsl(var(--ocean))] via-[hsl(202_87%_34%)] to-[hsl(190_80%_38%)] py-4 text-white">
      <div className="marquee-track flex w-max">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
};

export default Marquee;
