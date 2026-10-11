// One page per treatment: /services/<slug> (and /ar/..., /ku/...).
// Plain data only (no images or React), so the server (functions/_middleware.ts) can use it for titles and descriptions too.
// The answers are the clinic's own approved FAQ wording.

export type L3 = { en: string; ar: string; ku: string };

export interface ServiceInfo {
  slug: string;
  image: string; // file name in src/assets/services
  name: L3;
  intro?: L3;
  q: L3;
  a: L3;
  search: L3; // other names patients search for
  related: string[]; // other site pages, e.g. "/treatments"
  title: L3;
  description: L3;
}

const T = (en: string, ar: string, ku: string) => ({ en, ar, ku });
const SUF = T(" | Dr. Saleem Andraws, Duhok", " | د. سليم أندراوس، دهوك", " | د. سەلیم ئەندراوس، دهوک");
const withSuf = (t: L3): L3 => ({ en: t.en + SUF.en, ar: t.ar + SUF.ar, ku: t.ku + SUF.ku });

export const SERVICES: ServiceInfo[] = [
  {
    slug: "dental-implants",
    image: "dental-implants",
    name: T("Dental implants", "زراعة الأسنان", "چاندنا ددانا"),
    intro: T("Permanent implants that replace missing teeth and look and feel natural.", "زراعة أسنان دائمة لتعويض الأسنان المفقودة بمظهر وإحساس طبيعي.", ""),
    q: T("Do you offer dental implants?", "هل تقدمون زراعة الأسنان؟", "ئەرێ هوین چاندنا ددانا دکەن؟"),
    a: T(
      "Yes. We replace missing teeth with dental implants that look and work like natural teeth. The doctor examines you and takes an X-ray first to check whether an implant suits your case.",
      "نعم. نعوض الأسنان المفقودة بزراعة أسنان تبدو وتعمل مثل الأسنان الطبيعية. يفحصك الطبيب ويأخذ صورة أشعة أولاً للتأكد من أن الزراعة مناسبة لحالتك.",
      "بەلێ. ددانێن کەفتی ب چاندنا ددانا دگوهۆڕین کو وەک ددانێن سروشتی دیار دبن و کار دکەن. دکتۆر پێشی تە دپشکنیت و تیشکێ دگریت دا بزانیت چاندن بۆ تە گونجایە.",
    ),
    search: T("Dental implant, tooth implant, implant crown, digital implant planning", "زراعة سن، زراعة أسنان، زرع الأسنان، زراعة رقمية", "چاندنا ددانی، جاندن، ئیمپلانت"),
    related: ["/case", "/treatments"],
    title: withSuf(T("Dental Implants in Duhok", "زراعة الأسنان في دهوك", "چاندنا ددانا ل دهوکێ")),
    description: T(
      "Dental implants in Duhok to replace missing teeth with teeth that look and work like natural ones. Examination and X-ray first. Dr. Saleem Andraws Dental Clinic, Qazi Mohammad Road. 0750 781 6500.",
      "زراعة الأسنان في دهوك لتعويض الأسنان المفقودة بأسنان تبدو وتعمل مثل الطبيعية، بعد الفحص وصورة الأشعة. عيادة د. سليم أندراوس، شارع قاضي محمد. 07507816500",
      "چاندنا ددانا ل دهوکێ بۆ گوهۆڕینا ددانێن کەفتی ب ددانێن وەک یێن سروشتی، پشتی پشکنین و تیشکێ. کلینیکا د. سەلیم ئەندراوس، شەقامێ قازی محەمەد. 07507816500",
    ),
  },
  {
    slug: "veneers-hollywood-smile",
    image: "cosmetic-dentistry",
    name: T("Veneers & Hollywood smile", "فينير وابتسامة هوليود", "ڤینیر و بزەیا هۆلیوود"),
    intro: T("Veneers, zircon and E-max crowns, and complete smile makeovers.", "فينير (قشور الأسنان)، تيجان (كراس) زركون وإيماكس، وتصميم الابتسامة.", ""),
    q: T("Do you make veneers and Hollywood smiles?", "هل تعملون فينير وابتسامة هوليود؟", "ئەرێ هوین ڤینیر و بزەیا هۆلیوود دکەن؟"),
    a: T(
      "Yes. We make veneers and complete smile makeovers (Hollywood smile), as well as zircon and E-max crowns. You can see real before-and-after cases in our gallery and on Instagram.",
      "نعم. نعمل الفينير وتجميل الابتسامة الكامل (ابتسامة هوليود)، بالإضافة إلى تيجان (كراس) الزركون والإيماكس. يمكنك مشاهدة حالات حقيقية قبل وبعد في معرض الصور وعلى إنستغرام.",
      "بەلێ. ڤینیر و جوانکرنا تەواوی یا بزەیێ (بزەیا هۆلیوود) دکەین، هەروەسا کراسێن زیرکۆن و ئیماکس. دشێی نموونەیێن ڕاستەقینە یێن بەری و پشتی ل گەلەریێ و ل ئینستاگرامێ ببینی.",
    ),
    search: T("Veneers, Hollywood smile, smile makeover, smile design, E-max veneers", "فينير، قشور الأسنان، هوليود سمايل، تصميم الابتسامة، إيماكس", "ڤینیر، هۆلیوود سمایل، دیزاینا بزەیێ، ئیماکس"),
    related: ["/crowns-bridges-dentures"],
    title: withSuf(T("Veneers & Hollywood Smile in Duhok", "فينير وابتسامة هوليود في دهوك", "ڤینیر و بزەیا هۆلیوود ل دهوکێ")),
    description: T(
      "Veneers, Hollywood smile and complete smile makeovers in Duhok, plus zircon and E-max crowns. See real before-and-after cases. Dr. Saleem Andraws Dental Clinic. 0750 781 6500.",
      "فينير وابتسامة هوليود وتجميل الابتسامة الكامل في دهوك، مع تيجان الزركون والإيماكس. شاهد حالات حقيقية قبل وبعد. عيادة د. سليم أندراوس. 07507816500",
      "ڤینیر، بزەیا هۆلیوود و جوانکرنا تەواوی یا بزەیێ ل دهوکێ، دگەل کراسێن زیرکۆن و ئیماکس. نموونەیێن بەری و پشتی ببینە. کلینیکا د. سەلیم ئەندراوس. 07507816500",
    ),
  },
  {
    slug: "teeth-whitening",
    image: "teeth-whitening",
    name: T("Teeth whitening", "تبييض الأسنان", "سپیکرنا ددانا"),
    intro: T("Professional whitening treatments for a brighter, more confident smile.", "علاجات تبييض احترافية لابتسامة أكثر إشراقاً وثقة.", ""),
    q: T("Do you offer teeth whitening?", "هل تقدمون تبييض الأسنان؟", "ئەرێ هوین سپیکرنا ددانا دکەن؟"),
    a: T(
      "Yes. We offer professional teeth whitening at the clinic. The doctor checks your teeth and gums first so the result is safe and even.",
      "نعم. نقدم تبييض الأسنان الاحترافي في العيادة، بعد أن يفحص الطبيب الأسنان واللثة لضمان نتيجة آمنة ومتساوية.",
      "بەلێ. سپیکرنا ددانا یا پیشەیی ل کلینیکێ دکەین، پشتی دکتۆر ددان و پوکێن تە دپشکنیت دا ئەنجام سەلامەت و یەکسان بیت.",
    ),
    search: T("Teeth whitening, tooth bleaching, white teeth", "تبييض الأسنان، تبييض، أسنان بيضاء", "سپیکرنا ددانا، سپیکرن"),
    related: ["/infographics"],
    title: withSuf(T("Teeth Whitening in Duhok", "تبييض الأسنان في دهوك", "سپیکرنا ددانا ل دهوکێ")),
    description: T(
      "Professional teeth whitening at the clinic in Duhok, after the doctor checks your teeth and gums so the result is safe and even. Dr. Saleem Andraws Dental Clinic. 0750 781 6500.",
      "تبييض الأسنان الاحترافي في العيادة في دهوك، بعد فحص الأسنان واللثة لنتيجة آمنة ومتساوية. عيادة د. سليم أندراوس. 07507816500",
      "سپیکرنا ددانا یا پیشەیی ل کلینیکێ ل دهوکێ، پشتی پشکنینا ددان و پوکان. کلینیکا د. سەلیم ئەندراوس. 07507816500",
    ),
  },
  {
    slug: "root-canal-fillings",
    image: "root-canal",
    name: T("Root canal treatment & fillings", "حشو العصب والحشوات", "حەشوا دەمارێ و حەشوا ددانا"),
    intro: T("Pain-free root canal therapy to save and restore damaged teeth.", "علاج وحشو عصب السن بدون ألم لإنقاذ الأسنان المتضررة.", ""),
    q: T("Do you do root canal treatment and fillings?", "هل تعملون حشو العصب والحشوات؟", "ئەرێ هوین حەشوا دەمارێ و حەشوا ددانا دکەن؟"),
    a: T(
      "Yes. We do root canal treatment to save damaged teeth, and tooth-coloured fillings for cavities.",
      "نعم. نعالج العصب (حشو العصب) لإنقاذ الأسنان المتضررة، ونعمل حشوات تجميلية بلون الأسنان لعلاج التسوس.",
      "بەلێ. چارەسەریا دەمارێ (حەشوا دەمارێ) دکەین دا ددانێن زیانلێکەفتی ڕزگار بکەین، و حەشوێن ب ڕەنگێ ددانی بۆ کڕمبوونێ.",
    ),
    search: T("Root canal, endodontics, nerve treatment, tooth-coloured filling, composite filling", "علاج العصب، حشو عصب، حشوة تجميلية، حشو ضوئي، تسوس", "حەشوا دەمارێ، چارەسەریا دەمارێ، حەشو، کڕمبوون"),
    related: ["/treatments"],
    title: withSuf(T("Root Canal Treatment & Fillings in Duhok", "حشو العصب وحشو الأسنان في دهوك", "حەشوا دەمارێ و حەشوا ددانا ل دهوکێ")),
    description: T(
      "Root canal treatment to save damaged teeth and tooth-coloured fillings for cavities, at Dr. Saleem Andraws Dental Clinic in Duhok. See how a root canal is done. 0750 781 6500.",
      "علاج العصب (حشو العصب) لإنقاذ الأسنان المتضررة وحشوات تجميلية بلون الأسنان لعلاج التسوس في عيادة د. سليم أندراوس في دهوك. 07507816500",
      "حەشوا دەمارێ بۆ ڕزگارکرنا ددانێن زیانلێکەفتی و حەشوێن ب ڕەنگێ ددانی بۆ کڕمبوونێ، ل کلینیکا د. سەلیم ئەندراوس ل دهوکێ. 07507816500",
    ),
  },
  {
    slug: "crowns-bridges-dentures",
    image: "cosmetic-dentistry",
    name: T("Crowns, bridges & dentures", "التيجان (الكراس) والجسور وطقم الأسنان", "کراس، جسر و تەخمێ ددانا"),
    q: T("Do you make bridges, crowns and dentures?", "هل تعملون الجسور والكراس وطقم الأسنان؟", "ئەرێ هوین جسر، کراس و تەخمێ ددانا دکەن؟"),
    a: T(
      "Yes. We make crowns and bridges in zircon, ceramic (porcelain) and E-max, and full or partial dentures. The doctor helps you choose the material that suits your teeth and budget.",
      "نعم. نعمل التيجان (الكراس) والجسور من الزركون والسيراميك والإيماكس، ونعمل طقم الأسنان (الطخم) الكامل والجزئي. يساعدك الطبيب في اختيار المادة المناسبة لأسنانك وميزانيتك.",
      "بەلێ. کراس و جسران ژ زیرکۆن، سیرامیک و ئیماکس دکەین، و تەخمێ ددانا (طخم) یێ تەمام و یێ پشکی. دکتۆر هاریکاریا تە دکەت ماددێ گونجای بۆ ددانێن تە و بودجەیا تە هەلبژێری.",
    ),
    search: T("Zircon crown, E-max crown, porcelain crown, dental bridge, full denture, partial denture", "كراس زركون، تاج إيماكس، تلبيس الأسنان، جسر، طقم أسنان، طخم", "کراسێ زیرکۆن، کراسێ ئیماکس، جسر، تەخم"),
    related: ["/treatments", "/veneers-hollywood-smile"],
    title: withSuf(T("Zircon & E-max Crowns, Bridges and Dentures in Duhok", "تيجان (كراس) زركون وإيماكس وجسور وطقم أسنان في دهوك", "کراسێن زیرکۆن و ئیماکس، جسر و تەخم ل دهوکێ")),
    description: T(
      "Crowns and bridges in zircon, ceramic and E-max, and full or partial dentures, in Duhok. The doctor helps you choose the material that suits your teeth and budget. 0750 781 6500.",
      "تيجان (كراس) وجسور من الزركون والسيراميك والإيماكس، وطقم أسنان كامل وجزئي في دهوك. يساعدك الطبيب في اختيار المادة المناسبة لأسنانك وميزانيتك. 07507816500",
      "کراس و جسر ژ زیرکۆن، سیرامیک و ئیماکس، و تەخمێ تەمام و پشکی ل دهوکێ. دکتۆر هاریکاریا تە دکەت ماددێ گونجای هەلبژێری. 07507816500",
    ),
  },
  {
    slug: "orthodontics-braces",
    image: "orthodontics",
    name: T("Orthodontics (braces)", "تقويم الأسنان", "ڕێکخستنا ددانا (تقویم)"),
    intro: T("Braces and clear aligners to straighten teeth and correct the bite.", "تقويم الأسنان الثابت والشفاف لأسنان مستقيمة وإطباق صحيح.", ""),
    q: T("Do you do orthodontics (braces)?", "هل تعملون تقويم الأسنان؟", "ئەرێ هوین ڕێکخستنا ددانا (تقویم) دکەن؟"),
    a: T(
      "Yes. We straighten crooked or crowded teeth with orthodontic treatment. The doctor examines you and takes an X-ray first, then explains the plan and how long it will take.",
      "نعم. نعالج الأسنان الملتوية أو المزدحمة بتقويم الأسنان. يفحصك الطبيب ويأخذ صورة أشعة أولاً، ثم يشرح لك الخطة والمدة المتوقعة.",
      "بەلێ. ددانێن خوار یان تێکەل ب تقویمێ ڕێک دئێخین. دکتۆر پێشی تە دپشکنیت و تیشکێ دگریت، پاشی پلان و دەمێ پێدڤی بۆ تە ڕوون دکەت.",
    ),
    search: T("Braces, orthodontics, clear aligners, crooked teeth, crowded teeth", "تقويم، تقويم ثابت، تقويم شفاف، أسنان ملتوية، أسنان مزدحمة", "تقویم، ڕێکخستنا ددانا، ددانێن خوار"),
    related: ["/kids"],
    title: withSuf(T("Orthodontics & Braces in Duhok", "تقويم الأسنان في دهوك", "ڕێکخستنا ددانا (تقویم) ل دهوکێ")),
    description: T(
      "Orthodontic treatment (braces) in Duhok to straighten crooked or crowded teeth. Examination and X-ray first, then a clear plan and expected time. Dr. Saleem Andraws. 0750 781 6500.",
      "تقويم الأسنان في دهوك لعلاج الأسنان الملتوية أو المزدحمة. فحص وصورة أشعة أولاً، ثم شرح الخطة والمدة المتوقعة. عيادة د. سليم أندراوس. 07507816500",
      "ڕێکخستنا ددانا (تقویم) ل دهوکێ بۆ ددانێن خوار یان تێکەل. پشکنین و تیشک پێشی، پاشی پلان و دەمێ پێدڤی. کلینیکا د. سەلیم ئەندراوس. 07507816500",
    ),
  },
  {
    slug: "dental-cleaning",
    image: "dental-cleaning",
    name: T("Dental cleaning (scaling)", "تنظيف الأسنان", "پاقژکرنا ددانا"),
    intro: T("Tooth-coloured fillings, scaling and polishing for healthy teeth.", "حشوات تجميلية بلون الأسنان، وتنظيف وتلميع احترافي.", ""),
    q: T("Do you do dental cleaning (scaling)?", "هل تعملون تنظيف الأسنان؟", "ئەرێ هوین ددانا پاقژ دکەن (تنظیف)؟"),
    a: T(
      "Yes. We do professional cleaning and polishing to remove tartar and stains and keep your gums healthy. The doctor also checks your teeth for cavities during the visit.",
      "نعم. نعمل تنظيف وتلميع الأسنان الاحترافي لإزالة الجير والتصبغات والحفاظ على صحة اللثة، ويفحص الطبيب أسنانك من التسوس خلال الزيارة.",
      "بەلێ. پاقژکرن و بریقەدانا ددانا یا پیشەیی دکەین دا کلس و ڕەنگ بچن و پوک ساخلەم بمینن. دکتۆر د سەردانێ دا ددانێن تە ژ کڕمبوونێ ژی دپشکنیت.",
    ),
    search: T("Scaling and polishing, tartar removal, teeth cleaning, gum health", "تنظيف الجير، تلميع الأسنان، إزالة التصبغات، صحة اللثة", "پاقژکرنا کلسی، بریقەدان، ساخلەمیا پوکان"),
    related: ["/infographics"],
    title: withSuf(T("Teeth Cleaning & Scaling in Duhok", "تنظيف الأسنان وإزالة الجير في دهوك", "پاقژکرنا ددانا ل دهوکێ")),
    description: T(
      "Professional teeth cleaning and polishing in Duhok to remove tartar and stains and keep your gums healthy, with a check for cavities. Dr. Saleem Andraws Dental Clinic. 0750 781 6500.",
      "تنظيف وتلميع الأسنان الاحترافي في دهوك لإزالة الجير والتصبغات والحفاظ على صحة اللثة، مع فحص التسوس. عيادة د. سليم أندراوس. 07507816500",
      "پاقژکرن و بریقەدانا ددانا یا پیشەیی ل دهوکێ دا کلس و ڕەنگ بچن و پوک ساخلەم بمینن. کلینیکا د. سەلیم ئەندراوس. 07507816500",
    ),
  },
  {
    slug: "tooth-extraction",
    image: "oral-radiology",
    name: T("Tooth extraction", "قلع الأسنان", "هەلکێشانا ددانی"),
    q: T("Do you do tooth extraction?", "هل تعملون قلع الأسنان؟", "ئەرێ هوین ددانا هەلدکێشن (قلع)؟"),
    a: T(
      "Yes. When a tooth cannot be saved, the doctor extracts it gently under local anaesthetic and explains how to care for the area afterwards, and what can replace the tooth (an implant, a bridge or a denture).",
      "نعم. عندما لا يمكن إنقاذ السن، يقلعه الطبيب بلطف تحت التخدير الموضعي، ويشرح لك طريقة العناية بعد القلع وما يمكن أن يعوض السن (زراعة أو جسر أو طقم).",
      "بەلێ. دەمێ ددان نەهێتە ڕزگارکرن، دکتۆر ب نەرمی و ب سڕکرنا جهی هەلدکێشیت، و بۆ تە دبێژیت پشتی هەلکێشانێ چاوا خۆ بپارێزی و چ دشێت جهێ ددانی بگریت (چاندن، جسر یان تەخم).",
    ),
    search: T("Tooth extraction, tooth removal, wisdom tooth", "قلع سن، خلع الأسنان، ضرس العقل", "هەلکێشانا ددانی، قلع، ددانێ عەقلێ"),
    related: ["/treatments", "/dental-implants"],
    title: withSuf(T("Tooth Extraction in Duhok", "قلع الأسنان في دهوك", "هەلکێشانا ددانی ل دهوکێ")),
    description: T(
      "Gentle tooth extraction under local anaesthetic in Duhok when a tooth cannot be saved, with aftercare advice and options to replace the tooth. Dr. Saleem Andraws. 0750 781 6500.",
      "قلع الأسنان بلطف تحت التخدير الموضعي في دهوك عندما لا يمكن إنقاذ السن، مع شرح العناية بعد القلع وخيارات تعويض السن. عيادة د. سليم أندراوس. 07507816500",
      "هەلکێشانا ددانی ب نەرمی و سڕکرنا جهی ل دهوکێ دەمێ ددان نەهێتە ڕزگارکرن، دگەل شیرەتێن پشتی هەلکێشانێ. کلینیکا د. سەلیم ئەندراوس. 07507816500",
    ),
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const SERVICES_INDEX_NAME = T("Our services", "خدماتنا", "خزمەتگوزاریێن مە");
