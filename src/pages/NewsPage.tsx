import SubPage from "./SubPage";
import DentalNews from "@/components/dental/DentalNews";
import { useLanguage } from "@/contexts/LanguageContext";
import { pathFor } from "@/config/seo";

// /news: the daily dental headlines on their own page, with a short original introduction and links to the clinic's guides.
const INTRO = {
  en: "At Dr. Saleem Andraws Dental Clinic in Duhok we follow new dental techniques and research, so patients can understand what is changing in dentistry. These are the latest headlines from trusted dental news sites. For advice about your own teeth, please book an examination.",
  ar: "في عيادة د. سليم أندراوس لطب الأسنان في دهوك نتابع التقنيات والأبحاث الجديدة في طب الأسنان ليفهم المرضى ما الذي يتغير. هذه آخر العناوين من مواقع إخبارية موثوقة. للنصيحة بخصوص أسنانك أنت، احجز موعد فحص.",
  ku: "ل کلینیکا ددانان یا د. سەلیم ئەندراوس ل دهوکێ، ئەم تەکنیک و لێکۆلینەوێن نوی یێن ددانان دشوێنین، دا نەخۆش بزانن چ د گوهۆڕینێ دایە. ئەڤە نویترین ناڤونیشانێن ژ ماڵپەڕێن هەوالان یێن باوەرپێکرینە. بۆ ڕاوێژا ددانێن خۆ، ڤەکۆلینەکێ ببژێرە.",
};
const LINKS: [string, string, string, string][] = [
  ["/treatments", "How treatments are done", "كيف يتم علاج الأسنان", "چارەسەری چاوا دئێتە کرن"],
  ["/kids", "Children's teeth guide", "دليل أسنان الأطفال", "ڕێبەرێ ددانێن زارۆکان"],
  ["/infographics", "Dental health infographics", "إنفوجرافيك صحة الأسنان", "ئینفۆگرافیکێن ساخلەمیا ددانان"],
  ["/case", "A digital implant case", "حالة زراعة رقمية", "حالەتا چاندنا دیجیتالی"],
];

const NewsPage = () => {
  const { language } = useLanguage();
  const i = language === "ar" ? 2 : language === "ku" ? 3 : 1;
  return (
    <SubPage name="news">
      {() => (
        <>
          <section className="container pt-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-center">{["", "Dental news", "أخبار طب الأسنان", "هەوالێن ددانان"][i]}</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">{INTRO[language]}</p>
          </section>
          <DentalNews />
          <section className="container pb-14">
            <div className="flex flex-wrap justify-center gap-3">
              {LINKS.map((l) => (
                <a key={l[0]} href={pathFor(language, l[0] as "/case")} className="px-5 py-2.5 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10">{l[i]}</a>
              ))}
            </div>
          </section>
        </>
      )}
    </SubPage>
  );
};

export default NewsPage;
