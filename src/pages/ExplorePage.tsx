import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { EXTRA_PAGES } from "@/config/extraPages";
import { parsePath } from "@/config/seo";
import SubPage from "./SubPage";
const Gallery=lazy(()=>import("@/components/dental/Gallery"));
const BeforeAfter=lazy(()=>import("@/components/dental/BeforeAfter"));
const SmilePreview=lazy(()=>import("@/components/dental/SmilePreview"));
const ClinicTour=lazy(()=>import("@/components/dental/ClinicTour"));
const DigitalDentistry=lazy(()=>import("@/components/dental/DigitalDentistry"));
const FAQ=lazy(()=>import("@/components/dental/FAQ"));
const WeeklyHours=lazy(()=>import("@/components/dental/WeeklyHours"));
const DuhokBand=lazy(()=>import("@/components/dental/DuhokBand"));
const About=lazy(()=>import("@/components/dental/About"));
export default function ExplorePage(){
  const {language:l}=useLanguage();
  const {pathname}=useLocation();
  const page=EXTRA_PAGES.find(x=>x.path===parsePath(pathname)?.page)!;
  return <SubPage name={page.path}>{open=><>
    <section className="container pt-7"><h1 className="text-3xl font-semibold text-primary md:text-4xl [font-family:inherit]">{page.title[l]}</h1><p className="mt-4 max-w-3xl text-lg text-muted-foreground">{page.description[l]}</p></section>
    <Suspense fallback={<p className="container py-10">{l==="en"?"Loading…":l==="ar"?"جارٍ التحميل…":"بارکرن…"}</p>}>
      {page.path==="/smile-preview"&&<SmilePreview onBookingClick={open("smile")} />}
      {page.path==="/gallery"&&<><BeforeAfter onBookingClick={open("results")} /><Gallery /></>}
      {page.path==="/our-clinic"&&<ClinicTour />}
      {page.path==="/digital-dentistry"&&<DigitalDentistry />}
      {page.path==="/faq"&&<FAQ />}
      {page.path==="/opening-hours"&&<WeeklyHours />}
      {page.path==="/duhok"&&<DuhokBand />}
      {page.path==="/about"&&<About />}
    </Suspense>
  </>}</SubPage>;
}
