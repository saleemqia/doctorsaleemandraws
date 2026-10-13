import { useLanguage } from "@/contexts/LanguageContext";
export default function ServicePatientInfo() {
  const { language:l } = useLanguage();
  const L=(en:string,ar:string,ku:string)=>({en,ar,ku})[l];
  const questions=[
    [L("How much will treatment cost?","كم تبلغ تكلفة العلاج؟","بهایێ چارەسەریێ چەندە؟"),L("The cost depends on your examination and treatment plan. Ask for the proposed options and a cost explanation before agreeing to treatment.","تعتمد التكلفة على الفحص وخطة العلاج. اطلب شرح الخيارات والتكلفة قبل الموافقة على العلاج.","بها ل دویڤ پشکنین و پلانێ چارەسەریێ یە. بەری ڕەزامەندیێ، دەربارەی هەلبژاردن و بها بپرسە.")],
    [L("How many appointments will I need?","كم موعدًا سأحتاج؟","چەند ژڤان پێدڤی نە؟"),L("The number and timing of visits are planned for your case. Dr. Saleem will explain the proposed sequence, follow-up and alternatives at your consultation.","يُحدَّد عدد الزيارات وتوقيتها حسب حالتك. يشرح الدكتور سليم تسلسل العلاج والمتابعة والبدائل أثناء الاستشارة.","ژمارە و دەمێ سەردانان بۆ حالەتێ تە دهێنە پلانکرن. د. سەلیم پلان، دوڤچوون و هەلبژاردنێن دی بۆ تە ڕوون دکەت.")],
    [L("What should I bring to my first visit?","ماذا أحضر للزيارة الأولى؟","بۆ سەردانا ئێکێ چ بینم؟"),L("Bring your current medicine list and any relevant previous dental X-rays or reports. Tell the clinic about access needs when booking: approximately 20 steps precede the lift.","أحضر قائمة أدويتك وأي أشعة أو تقارير أسنان سابقة ذات صلة. أخبر العيادة باحتياجات الوصول عند الحجز: توجد حوالي 20 درجة قبل المصعد.","لیستا دەرمانێن خۆ و تیشک یان ڕاپۆرتێن ددانێن خۆ بینە. د دەمێ حجزکرنێ دا پێدڤیێن گەهشتنێ بۆ کلینیکێ ببێژە: نێزیکی 20 پەیژە بەری ئاسانسۆری هەنە.")]
  ];
  return <section className="mt-8 rounded-xl border border-border bg-white p-5">
    <h2 className="text-xl font-semibold [font-family:inherit]">{L("Planning treatment at our Duhok clinic","التخطيط للعلاج في عيادتنا في دهوك","پلانکرنا چارەسەریێ ل کلینیکا مە ل دهوکێ")}</h2>
    {questions.map(([q,a])=><details key={q} className="mt-4 border-t border-border pt-4"><summary className="cursor-pointer font-semibold text-primary">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}
    <p className="mt-5 text-xs text-muted-foreground">{L("Clinic information · Updated 13 October 2026. General information; your plan follows an individual examination.","معلومات العيادة · تحديث 13 أكتوبر 2026. معلومات عامة؛ تُحدد خطتك بعد فحص فردي.","زانیاریێن کلینیکێ · نویکرن 13 تشرینا ئێکێ 2026. زانیاریێن گشتی؛ پلانێ تە پشتی پشکنینا تاکەکەسی دهێتە دیارکرن.")}</p>
  </section>;
}
