import { useLanguage } from "@/contexts/LanguageContext";
export default function AssyrianName() {
  const { language } = useLanguage();
  const names = { en: "Dr. Saleem Andraws", ar: "د. سليم أندراوس", ku: "د. سەلیم ئەندراوس" };
  return <span className="min-w-0 leading-tight">
    <span className="block text-base font-semibold text-foreground sm:text-lg">{names[language]}</span>
    <span dir="rtl" lang="syr" className="mt-1 block text-sm text-primary" style={{fontFamily:"'Noto Sans Syriac Eastern', serif",unicodeBidi:"isolate"}}>ܕܳܟܬܾܘܪ ܣܠܝܡ ܐܰܢܕܪܰܐܘܳܣ</span>
  </span>;
}