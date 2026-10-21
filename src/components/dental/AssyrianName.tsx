import { useLanguage } from "@/contexts/LanguageContext";

const syriacName = "ܕܳܟܬܾܘܪ ܣܠܝܡ ܐܰܢܕܪܰܐܘܳܣ";

export default function AssyrianName() {
  const { language } = useLanguage();
  const names = { en: "Dr. Saleem Andraws", ar: "د. سليم أندراوس", ku: "د. سەلیم ئەندراوس" };
  return <span className="min-w-0 leading-tight">
    <span className="block text-base font-semibold text-foreground sm:text-lg">{names[language]}</span>
    <span dir="rtl" lang="syr" aria-label={syriacName} className="assyrian-name mt-1 block text-lg sm:text-xl md:text-2xl">
      {syriacName}
    </span>
  </span>;
}
