// Longer explanations for each treatment page (/services/<slug>): what it is, when it is needed,
// how it is done step by step, care afterwards, and YouTube videos that show the process.
// Step texts for root canal, implant, crown and extraction are the same as on the /treatments page.
// Videos play from YouTube (privacy mode) and belong to their creators; to change one, replace its id.

import type { L3 } from "./services";

const T = (en: string, ar: string, ku: string): L3 => ({ en, ar, ku });

export interface Step { title: L3; text: L3 }
export interface StepGroup { title?: L3; steps: Step[] }
export interface Video { id: string; title: L3; credit: string; arabic?: boolean }
export interface ServiceDetail { what: L3; who: L3[]; groups: StepGroup[]; after: L3[]; videos: Video[] }

const S = (title: L3, text: L3): Step => ({ title, text });

const ROOT_CANAL: Step[] = [
  S(T("The infected tooth", "السن الملتهب", "ددانێ هەوکری"),
    T("Deep decay reaches the nerve (pulp). It becomes inflamed and painful, and infection can form at the root tip.", "يصل التسوس العميق إلى العصب (اللب) فيلتهب ويسبب الألم، وقد يتكوّن خراج عند طرف الجذر.", "کڕمبوونا کویر دگەهیتە دەمارێ، هەو دکەت و ئێشێ چێدکەت، و دبیت کێم ل سەرێ ڕەهی چێببیت.")),
  S(T("Numbing and opening", "التخدير وفتح السن", "سڕکرن و ڤەکرنا ددانی"),
    T("The area is numbed so you feel no pain. The doctor makes a small opening in the top of the tooth.", "يُخدَّر المكان فلا تشعر بالألم، ثم يعمل الطبيب فتحة صغيرة في أعلى السن.", "جه دئێتە سڕکرن دا تو ئێشێ هەست نەکەی، پاشی دکتۆر کونەکێ بچووک ل سەرێ ددانی ڤەدکەت.")),
  S(T("Cleaning the canals", "تنظيف القنوات", "پاقژکرنا کەنالان"),
    T("Fine instruments remove the inflamed nerve and clean and shape the canals inside the roots.", "تُزال الأعصاب الملتهبة بأدوات دقيقة، وتُنظَّف القنوات داخل الجذور وتُشكَّل.", "ب ئامرازێن زراڤ دەمارا هەوکری دئێتە ڕاکرن و کەنالێن ناڤ ڕەهان پاقژ دبن.")),
  S(T("Filling the canals", "حشو القنوات", "حەشوکرنا کەنالان"),
    T("The clean canals are filled and sealed from the root tip upward, and the opening is closed.", "تُحشى القنوات النظيفة وتُغلق بإحكام من طرف الجذر إلى الأعلى، ثم تُغلق الفتحة.", "کەنالێن پاقژ ژ سەرێ ڕەهی بەرەو ژۆر دئێنە حەشوکرن و گرتن، پاشی کون دئێتە گرتن.")),
  S(T("Protecting the tooth", "حماية السن", "پاراستنا ددانی"),
    T("A crown is often placed to protect the treated tooth, so you can chew normally for many years.", "غالباً يوضع تاج (كراون) لحماية السن المعالج، فتمضغ بشكل طبيعي لسنوات طويلة.", "گەلەک جاران کراسەک بۆ پاراستنا ددانی دئێتە دانان، دا ب ساڵان ب ئاسایی بجوی.")),
];

const IMPLANT: Step[] = [
  S(T("A missing tooth", "سن مفقود", "ددانەکێ کەفتی"),
    T("A gap affects chewing and smiling, and the neighbouring teeth can slowly move into the space.", "الفراغ يؤثر على المضغ والابتسامة، وقد تميل الأسنان المجاورة تدريجياً نحو الفراغ.", "ڤالاهی کارتێکرنێ ل جوتن و بزەیێ دکەت، و ددانێن نێزیک هێدی هێدی بەرەو ڤالاهیێ دچن.")),
  S(T("3D digital planning", "التخطيط الرقمي ثلاثي الأبعاد", "پلاندانانا دیجیتالی یا ٣D"),
    T("Using a 3D X-ray and a digital scan, the implant position is planned on the computer and a surgical guide is made.", "بالأشعة ثلاثية الأبعاد والمسح الرقمي يُخطَّط موقع الزرعة على الكمبيوتر، ويُصنع دليل جراحي.", "ب تیشکا ٣D و سکانا دیجیتالی جهێ چاندنێ ل سەر کۆمپیوتەری دئێتە پلانکرن و ڕێبەرەکێ نەشتەرگەری چێدبیت.")),
  S(T("Placing the implant", "وضع الزرعة", "دانانا چاندنێ"),
    T("Under local anaesthetic, a small titanium implant is placed in the jaw bone in the planned position.", "تحت التخدير الموضعي توضع زرعة صغيرة من التيتانيوم في عظم الفك في الموقع المخطط.", "ب سڕکرنا جهی، چاندنەکا بچووک ژ تیتانیۆمێ د هەستیێ شویلکێ دا ل جهێ پلانکری دئێتە دانان.")),
  S(T("Healing", "الالتئام", "ساخبوون"),
    T("Over about 3 months the bone grows tightly around the implant, making it strong like a natural root.", "خلال ٣ أشهر تقريباً ينمو العظم حول الزرعة ويلتحم بها، فتصبح قوية مثل الجذر الطبيعي.", "د ماوێ ٣ هەیڤان دا هەستی ل دۆر چاندنێ مەزن دبیت و پێڤە دنووسیت، و وەک ڕەهێ سروشتی بهێز دبیت.")),
  S(T("The new tooth", "السن الجديد", "ددانێ نوی"),
    T("A connector (abutment) and a crown are fixed on the implant: a tooth that looks and works like a natural one.", "تُثبَّت قطعة الوصل والتاج على الزرعة: سن يبدو ويعمل مثل السن الطبيعي.", "پارچا گرێدانێ و کراس ل سەر چاندنێ دئێنە جێگیرکرن: ددانەک وەک یێ سروشتی دیار دبیت و کار دکەت.")),
];

const CROWN: Step[] = [
  S(T("A broken or weak tooth", "سن مكسور أو ضعيف", "ددانێ شکەستی یان لاواز"),
    T("A tooth that is broken, heavily filled or treated with a root canal needs protection.", "السن المكسور أو الذي فيه حشوة كبيرة أو عولج عصبه يحتاج إلى حماية.", "ددانێ شکەستی، یان حەشوا مەزن تێدا، یان دەمارێ وی هاتیە چارەسەرکرن، پێدڤی پاراستنێ یە.")),
  S(T("Shaping the tooth", "تحضير السن", "ئامادەکرنا ددانی"),
    T("Under local anaesthetic, the tooth is gently shaped so the crown can fit over it.", "تحت التخدير الموضعي يُحضَّر السن بلطف ليتسع التاج فوقه.", "ب سڕکرنا جهی، ددان ب نەرمی دئێتە ئامادەکرن دا کراس ل سەر جهـ بگریت.")),
  S(T("3D digital scan", "المسح الرقمي ثلاثي الأبعاد", "سکانا دیجیتالی یا ٣D"),
    T("Instead of impression paste, a small camera scans the tooth and builds an exact 3D model.", "بدلاً من معجون الطبعة، تمسح كاميرا صغيرة السن وتبني نموذجاً ثلاثي الأبعاد دقيقاً.", "ل جهێ مەعجوونا قالبی، کامێرایەکا بچووک ددانی سکان دکەت و مۆدێلەکێ ٣D یێ دروست چێدکەت.")),
  S(T("The new crown", "التاج الجديد", "کراسێ نوی"),
    T("The crown (zircon, E-max or ceramic) is made from the scan and fixed on the tooth, matching your other teeth.", "يُصنع التاج (زركون أو إيماكس أو سيراميك) من المسح ويُثبَّت على السن بلون يطابق أسنانك.", "کراس (زیرکۆن، ئیماکس یان سیرامیک) ژ سکانێ چێدبیت و ل سەر ددانی دئێتە جێگیرکرن ب ڕەنگێ ددانێن تە.")),
];

const EXTRACTION: Step[] = [
  S(T("A tooth that cannot be saved", "سن لا يمكن إنقاذه", "ددانەکێ نەهێتە ڕزگارکرن"),
    T("When decay or a crack is too large to repair, removing the tooth stops the pain and infection.", "عندما يكون التسوس أو الكسر كبيراً لا يمكن إصلاحه، يوقف القلع الألم والالتهاب.", "دەمێ کڕمبوون یان شکەستن زۆر مەزن بیت و نەهێتە چاککرن، هەلکێشان ئێش و هەوکرنێ ڕادوەستینیت.")),
  S(T("Numbing", "التخدير", "سڕکرن"),
    T("Local anaesthetic numbs the area completely. You may feel pressure, but not pain.", "التخدير الموضعي يخدّر المكان تماماً. قد تشعر بضغط، لكن بدون ألم.", "سڕکرنا جهی جهی ب تەمامی سڕ دکەت. دبیت پاڵەپەستۆیێ هەست بکەی، بەلێ بێ ئێش.")),
  S(T("Gentle removal", "القلع بلطف", "هەلکێشان ب نەرمی"),
    T("The doctor loosens the tooth gently and removes it, protecting the bone around it.", "يحرّك الطبيب السن بلطف ثم يقلعه، مع الحفاظ على العظم حوله.", "دکتۆر ددانی ب نەرمی دلەقینیت و هەلدکێشیت، دگەل پاراستنا هەستیێ دۆر.")),
  S(T("Healing and what's next", "الالتئام وما بعده", "ساخبوون و پاشی"),
    T("Bite on gauze, avoid rinsing for the first day, and the gum heals. Later the gap can be replaced with an implant or a bridge.", "اعضض على الشاش، ولا تمضمض في اليوم الأول، فتلتئم اللثة. لاحقاً يمكن تعويض الفراغ بزراعة أو جسر.", "ل سەر گازێ بگەزە، ڕۆژا ئێکێ دەڤێ خۆ نەشۆ، و پوک ساخ دبیت. پاشی دشێی ڤالاهیێ ب چاندنێ یان جسرێ پڕ بکەی.")),
];

export const DETAILS: Record<string, ServiceDetail> = {
  "dental-implants": {
    what: T(
      "A dental implant is a small titanium post placed in the jaw bone in place of the root of a missing tooth. When the bone has healed around it, a crown is fixed on top, so the new tooth looks and works like a natural one.",
      "زراعة السن هي وتد صغير من التيتانيوم يوضع في عظم الفك مكان جذر السن المفقود. بعد أن يلتئم العظم حوله يُثبَّت عليه تاج، فيبدو السن الجديد ويعمل مثل السن الطبيعي.",
      "چاندنا ددانی ستوینەکا بچووکا تیتانیۆمێ یە کو د هەستیێ شویلکێ دا ل جهێ ڕەهێ ددانێ کەفتی دئێتە دانان. پشتی هەستی ل دۆر ساخ دبیت، کراسەک ل سەر دئێتە جێگیرکرن، و ددانێ نوی وەک یێ سروشتی دیار دبیت و کار دکەت.",
    ),
    who: [
      T("One or more missing teeth.", "سن واحد مفقود أو أكثر.", "ئێک یان پتر ژ ددانان کەفتینە."),
      T("You prefer not to shape the neighbouring healthy teeth for a bridge.", "عندما لا ترغب بتحضير الأسنان السليمة المجاورة لعمل جسر.", "دەمێ تە نەڤێت ددانێن ساخ یێن نێزیک بۆ جسری بئێنە ئامادەکرن."),
      T("A loose denture that needs to be held more firmly.", "طقم أسنان متحرك يحتاج إلى تثبيت أقوى.", "تەخمەکێ لەقۆک کو پێدڤی جێگیرکرنەکا باشترە."),
      T("The doctor checks first, with an X-ray, that there is enough healthy bone.", "يتأكد الطبيب أولاً بالأشعة من وجود عظم سليم كافٍ.", "دکتۆر پێشی ب تیشکێ پشتڕاست دبیت کو هەستیێ ساخ یێ بەس هەیە."),
    ],
    groups: [{ steps: IMPLANT }],
    after: [
      T("Mild swelling and discomfort for the first few days are normal; take the medicine the doctor prescribes.", "التورم البسيط والانزعاج في الأيام الأولى أمر طبيعي؛ تناول الدواء الذي يصفه الطبيب.", "ماسینەکا کێم و نەخۆشیەکا سڤک د ڕۆژێن ئێکێ دا ئاساییە؛ وێ دەرمانێ بخۆ یا دکتۆر دنڤیسیت."),
      T("Eat soft food and chew on the other side for the first days.", "تناول طعاماً طرياً وامضغ على الجهة الأخرى في الأيام الأولى.", "د ڕۆژێن ئێکێ دا خوارنا نەرم بخۆ و ب لایێ دی بجوە."),
      T("Avoid smoking: it slows healing and weakens the implant's hold in the bone.", "تجنّب التدخين، فهو يبطئ الالتئام ويُضعف ثبات الزرعة في العظم.", "جگارێ نەکێشە، چونکی ساخبوونێ هێدی دکەت و گرتنا چاندنێ د هەستی دا لاواز دکەت."),
      T("Clean around the implant like a natural tooth and come to your check-ups.", "نظّف حول الزرعة مثل السن الطبيعي والتزم بمواعيد المراجعة.", "دۆرا چاندنێ وەک ددانێ سروشتی پاقژ بکە و ل ژڤانێن پشکنینێ بهێ."),
    ],
    videos: [
      { id: "2dfyWpdiFoM", credit: "The Scopic Surgery", title: T("How a dental implant is placed (3D)", "كيف تتم زراعة السن (ثلاثي الأبعاد)", "چاندنا ددانی چاوا دئێتە کرن (3D)") },
      { id: "QDGtioGwrTc", credit: "Wonders Dentistry", arabic: true, title: T("Implant from surgery to the final tooth (Arabic)", "الزراعة من الجراحة حتى التركيب (بالعربية)", "چاندن ژ نەشتەرگەریێ هەتا ددانێ دوماهیێ (عەرەبی)") },
    ],
  },

  "veneers-hollywood-smile": {
    what: T(
      "Veneers are thin shells, usually ceramic (such as E-max), bonded to the front of the teeth to change their colour, shape or size. A “Hollywood smile” means treating several front teeth together, with veneers or crowns, for an even and bright smile.",
      "الفينير قشور رقيقة، غالباً من السيراميك (مثل الإيماكس)، تُلصق على الوجه الأمامي للأسنان لتغيير لونها أو شكلها أو حجمها. و«ابتسامة هوليود» تعني معالجة عدة أسنان أمامية معاً، بالفينير أو التيجان، لابتسامة متناسقة ومشرقة.",
      "ڤینیر توێژالێن زراڤن، ب گشتی ژ سیرامیکێ (وەک ئیماکس)، کو ب ڕوویێ پێشیێ ددانان ڤە دئێنە نووساندن دا ڕەنگ، شێوە یان قەبارێ وان بگوهۆڕن. «بزەیا هۆلیوود» واتە چارەسەرکرنا چەند ددانێن پێشیێ پێکڤە، ب ڤینیر یان کراسان، بۆ بزەیەکا ڕێک و گەش.",
    ),
    who: [
      T("Stains or dark teeth that whitening cannot fix.", "تصبغات أو أسنان داكنة لا يعالجها التبييض.", "ڕەنگبوون یان ددانێن تاری کو سپیکرن چارەسەر ناکەت."),
      T("Chipped, worn or uneven front teeth.", "أسنان أمامية مكسورة الأطراف أو متآكلة أو غير متناسقة.", "ددانێن پێشیێ یێن شکەستی، خواری یان نەڕێک."),
      T("Small gaps between the front teeth.", "فراغات صغيرة بين الأسنان الأمامية.", "کەلشێن بچووک د ناڤبەرا ددانێن پێشیێ دا."),
      T("Teeth and gums must be healthy first; the doctor treats any decay or gum problem before starting.", "يجب أن تكون الأسنان واللثة سليمة أولاً؛ يعالج الطبيب أي تسوس أو مشكلة في اللثة قبل البدء.", "پێدڤییە ددان و پوک پێشی ساخ بن؛ دکتۆر هەر کڕمبوون یان کێشەیەکا پوکان بەری دەستپێکرنێ چارەسەر دکەت."),
    ],
    groups: [{ steps: [
      S(T("Consultation and smile design", "الاستشارة وتصميم الابتسامة", "ڕاوێژ و دیزاینا بزەیێ"),
        T("The doctor examines your teeth, listens to the shape and shade you want, and takes photos and a digital scan to plan the new smile.", "يفحص الطبيب أسنانك ويستمع إلى الشكل واللون الذي تريده، ويأخذ صوراً ومسحاً رقمياً لتخطيط الابتسامة الجديدة.", "دکتۆر ددانێن تە دپشکنیت، گوهـ ل وێ شێوە و ڕەنگێ ددەت یێ تە دڤێت، و وێنە و سکانەکا دیجیتالی دگریت بۆ پلانکرنا بزەیا نوی.")),
      S(T("Preparing the teeth", "تحضير الأسنان", "ئامادەکرنا ددانان"),
        T("Usually a thin layer of enamel is removed under local anaesthetic so the veneers look natural, not bulky. In some cases little or no preparation is needed.", "عادةً تُزال طبقة رقيقة من المينا تحت التخدير الموضعي حتى يبدو الفينير طبيعياً وغير سميك. وفي بعض الحالات يكون التحضير قليلاً أو غير ضروري.", "ب گشتی توێژەکا زراڤ ژ مینایێ ب سڕکرنا جهی دئێتە ڕاکرن دا ڤینیر سروشتی دیار ببیت و ستویر نەبیت. د هندەک حالەتان دا ئامادەکرن کێمە یان پێدڤی نینە.")),
      S(T("Scan and temporary veneers", "المسح والفينير المؤقت", "سکان و ڤینیرێ دەمکی"),
        T("The prepared teeth are scanned and the design is sent to the laboratory. Temporary veneers can protect the teeth while you wait.", "تُمسح الأسنان المحضّرة ويُرسل التصميم إلى المختبر، ويمكن وضع فينير مؤقت لحماية الأسنان خلال فترة الانتظار.", "ددانێن ئامادەکری دئێنە سکانکرن و دیزاین بۆ تاقیگەهێ دئێتە هنارتن. دبیت ڤینیرێ دەمکی بۆ پاراستنا ددانان بئێتە دانان.")),
      S(T("Bonding the veneers", "لصق الفينير", "نووساندنا ڤینیرێ"),
        T("The veneers are tried in and the shade is checked with you. Then they are bonded with a special cement hardened by light, and the bite is adjusted.", "يُجرَّب الفينير ويُتأكد من اللون معك، ثم يُلصق بلاصق خاص يتصلّب بالضوء، ويُضبط الإطباق.", "ڤینیر دئێتە تاقیکرن و ڕەنگ دگەل تە دئێتە پشتڕاستکرن، پاشی ب چیمەنتۆیەکێ تایبەت کو ب ڕووناهیێ ڕەق دبیت دئێتە نووساندن، و گەستن دئێتە ڕێکخستن.")),
    ] }],
    after: [
      T("Brush twice a day and clean between the teeth, as with natural teeth.", "فرّش أسنانك مرتين يومياً ونظّف بينها كما تفعل مع الأسنان الطبيعية.", "ڕۆژانە دوو جاران ددانێن خۆ فلچە بکە و ناڤبەرا وان پاقژ بکە، وەک ددانێن سروشتی."),
      T("Do not bite very hard things (ice, nut shells, pens) with your front teeth.", "لا تعضّ الأشياء الصلبة جداً (الثلج، قشور المكسرات، الأقلام) بأسنانك الأمامية.", "تشتێن زۆر ڕەق (بەفر، تویکلێن گویزان، قەلەم) ب ددانێن پێشیێ نەگەزە."),
      T("If you grind your teeth at night, the doctor may advise a night guard.", "إذا كنت تصرّ على أسنانك ليلاً، قد ينصحك الطبيب بواقٍ ليلي.", "ئەگەر ب شەڤ ددانێن خۆ دهەڕینی، دبیت دکتۆر پاراستنەکا شەڤێ بۆ تە پێشنیار بکەت."),
      T("Come for regular check-ups so the veneers and gums stay healthy.", "التزم بالفحص الدوري ليبقى الفينير واللثة بصحة جيدة.", "ل پشکنینێن ڕێکوپێک بهێ دا ڤینیر و پوک ساخلەم بمینن."),
    ],
    videos: [
      { id: "XlWNKVW30Pg", credit: "Dr Amit Patil", title: T("Veneers step by step", "الفينير خطوة بخطوة", "ڤینیر قۆناغ ب قۆناغ") },
    ],
  },

  "teeth-whitening": {
    what: T(
      "Professional whitening lightens the natural colour of the teeth with a whitening gel that is stronger than home products, applied at the clinic while the gums are protected.",
      "التبييض الاحترافي يفتّح اللون الطبيعي للأسنان بجل تبييض أقوى من المنتجات المنزلية، يوضع في العيادة مع حماية اللثة.",
      "سپیکرنا پیشەیی ڕەنگێ سروشتی یێ ددانان ڕوونتر دکەت ب جێلەکێ سپیکرنێ کو ژ بەرهەمێن مالێ بهێزترە، و ل کلینیکێ دگەل پاراستنا پوکان دئێتە دانان.",
    ),
    who: [
      T("Teeth that have turned yellow with age, tea, coffee or smoking.", "أسنان اصفرّت مع العمر أو بسبب الشاي والقهوة أو التدخين.", "ددانێن ب تەمەنی، چا، قەهوە یان جگارێ زەر بووین."),
      T("Before a wedding or a special occasion.", "قبل حفل زفاف أو مناسبة خاصة.", "بەری داوەتێ یان بۆنەیەکا تایبەت."),
      T("Note: whitening does not change the colour of fillings, crowns or veneers, and some deep stains respond less.", "ملاحظة: التبييض لا يغيّر لون الحشوات أو التيجان أو الفينير، وبعض التصبغات العميقة تستجيب أقل.", "تێبینی: سپیکرن ڕەنگێ حەشو، کراس یان ڤینیرێ ناگوهۆڕیت، و هندەک ڕەنگبوونێن کویر کێمتر بەرسڤێ ددەن."),
    ],
    groups: [{ steps: [
      S(T("Check-up and cleaning", "الفحص والتنظيف", "پشکنین و پاقژکرن"),
        T("The doctor checks your teeth and gums first; any decay is treated and a cleaning removes surface stains. Your current shade is recorded.", "يفحص الطبيب الأسنان واللثة أولاً، ويُعالج أي تسوس، ويزيل التنظيف التصبغات السطحية، ويُسجَّل لون أسنانك الحالي.", "دکتۆر پێشی ددان و پوکان دپشکنیت، هەر کڕمبوونەک دئێتە چارەسەرکرن و پاقژکرن ڕەنگێن سەرڕوویی ڕادکەت. ڕەنگێ نوکە یێ ددانان دئێتە تۆمارکرن.")),
      S(T("Protecting the gums", "حماية اللثة", "پاراستنا پوکان"),
        T("A protective barrier is placed on the gums and the lips are held away, so the gel touches only the teeth.", "يوضع حاجز واقٍ على اللثة وتُبعد الشفاه، حتى لا يلمس الجل إلا الأسنان.", "پەردەیەکا پاراستنێ ل سەر پوکان دئێتە دانان و لێڤ دوور دئێنە گرتن، دا جێل تنێ ددانان بگریت.")),
      S(T("Applying the gel", "وضع جل التبييض", "دانانا جێلی"),
        T("The whitening gel is applied for set periods, sometimes with a light, and can be repeated in the same visit.", "يوضع جل التبييض لفترات محددة، أحياناً مع ضوء خاص، ويمكن تكراره في نفس الجلسة.", "جێلێ سپیکرنێ بۆ ماوەیێن دیارکری دئێتە دانان، هندەک جاران دگەل ڕووناهیەکا تایبەت، و دشێت د هەمان سەردانێ دا دووبارە ببیت.")),
      S(T("The result", "النتيجة", "ئەنجام"),
        T("The new shade is compared with the starting shade, and the doctor explains how to keep the result.", "يُقارن اللون الجديد باللون الأول، ويشرح لك الطبيب كيف تحافظ على النتيجة.", "ڕەنگێ نوی دگەل ڕەنگێ دەستپێکێ دئێتە بەراوردکرن، و دکتۆر بۆ تە ڕوون دکەت چاوا ئەنجامی بپارێزی.")),
    ] }],
    after: [
      T("Some sensitivity for a day or two is common and goes away by itself.", "الحساسية لمدة يوم أو يومين شائعة وتزول وحدها.", "هەستیاریا ڕۆژەکێ یان دوو ڕۆژان ئاساییە و ب خۆ نامینیت."),
      T("For the first 48 hours avoid strongly coloured drinks and food (tea, coffee, cola) and smoking.", "في أول ٤٨ ساعة تجنّب المشروبات والأطعمة الملوّنة (الشاي، القهوة، الكولا) والتدخين.", "د ٤٨ دەمژمێرێن ئێکێ دا خۆ ژ ڤەخوارن و خوارنێن ڕەنگین (چا، قەهوە، کۆلا) و جگارێ بپارێزە."),
      T("The result fades slowly over time; good brushing and regular cleaning keep it longer.", "تخفّ النتيجة تدريجياً مع الوقت، والتفريش الجيد والتنظيف الدوري يحافظان عليها أطول.", "ئەنجام ب دەمی هێدی هێدی کێم دبیت؛ فلچەکرنا باش و پاقژکرنا ڕێکوپێک وی درێژتر دپارێزن."),
    ],
    videos: [
      { id: "Lugq2cMttUo", credit: "American Dental Association (ADA)", title: T("In-office tooth whitening", "تبييض الأسنان في العيادة", "سپیکرنا ددانان ل کلینیکێ") },
    ],
  },

  "root-canal-fillings": {
    what: T(
      "When decay is small, the decayed part is removed and the tooth is rebuilt with a tooth-coloured (composite) filling. When decay or a crack reaches the nerve inside the tooth, root canal treatment removes the inflamed nerve, cleans the canals and seals them, so the tooth can be kept instead of extracted.",
      "عندما يكون التسوس صغيراً يُزال الجزء المتسوس ويُعاد بناء السن بحشوة تجميلية بلون الأسنان. وعندما يصل التسوس أو الكسر إلى العصب داخل السن، يزيل علاج العصب العصبَ الملتهب وينظّف القنوات ويغلقها، فيُحافَظ على السن بدلاً من قلعه.",
      "دەمێ کڕمبوون بچووک بیت، پشکا کڕمبووی دئێتە ڕاکرن و ددان ب حەشوەکا ب ڕەنگێ ددانی دئێتە ئاڤاکرن. دەمێ کڕمبوون یان شکەستن دگەهیتە دەمارا ناڤ ددانی، چارەسەریا دەمارێ دەمارا هەوکری ڕادکەت، کەنالان پاقژ دکەت و دگریت، دا ددان بمینیت ل جهێ هەلکێشانێ.",
    ),
    who: [
      T("A cavity, or sensitivity to sweet or cold: usually a filling.", "تسوس، أو حساسية من الحلو أو البارد: غالباً تكفي حشوة.", "کڕمبوون، یان هەستیاری ژ شرینی یان ساری: ب گشتی حەشوەک بەسە."),
      T("Strong or night-time pain, pain when biting, pain that lingers after hot or cold, or swelling: the tooth may need root canal treatment.", "ألم شديد أو ليلي، ألم عند العض، ألم يستمر بعد الحار أو البارد، أو تورم: قد يحتاج السن إلى علاج العصب.", "ئێشا توند یان یا شەڤێ، ئێش دەمێ گەستنێ، ئێشا پشتی گەرمی یان ساریێ دمینیت، یان ماسین: دبیت ددان پێدڤی چارەسەریا دەمارێ بیت."),
      T("The examination and X-ray decide which treatment the tooth needs.", "الفحص وصورة الأشعة يحددان العلاج الذي يحتاجه السن.", "پشکنین و تیشک دیار دکەن ددان پێدڤی کیژ چارەسەریێ یە."),
    ],
    groups: [
      { title: T("A tooth-coloured filling", "الحشوة التجميلية", "حەشوا ب ڕەنگێ ددانی"), steps: [
        S(T("Removing the decay", "إزالة التسوس", "ڕاکرنا کڕمبوونێ"),
          T("If needed the area is numbed, then the soft decayed part is removed and the tooth is cleaned.", "يُخدَّر المكان عند الحاجة، ثم يُزال الجزء المتسوس الطري ويُنظَّف السن.", "ئەگەر پێدڤی بیت جه دئێتە سڕکرن، پاشی پشکا کڕمبووی یا نەرم دئێتە ڕاکرن و ددان پاقژ دبیت.")),
        S(T("Filling in layers", "الحشو على طبقات", "حەشوکرن توێژ ب توێژ"),
          T("A tooth-coloured material is placed in thin layers, each one hardened with a blue light.", "توضع مادة بلون السن على طبقات رقيقة، وتُصلَّب كل طبقة بضوء أزرق.", "ماددەیەکا ب ڕەنگێ ددانی توێژ ب توێژ دئێتە دانان، و هەر توێژەک ب ڕووناهیەکا شین ڕەق دبیت.")),
        S(T("Shaping and polishing", "التشكيل والتلميع", "شێوەدان و بریقەدان"),
          T("The filling is shaped to your bite and polished so it looks and feels like the rest of the tooth.", "تُشكَّل الحشوة حسب إطباقك وتُلمَّع لتبدو وتُحسّ مثل باقي السن.", "حەشو ل گوێرەی گەستنا تە شێوە دئێتە دان و بریقە دکەت دا وەک ددانی دیار ببیت.")),
      ] },
      { title: T("Root canal treatment", "علاج العصب", "چارەسەریا دەمارێ"), steps: ROOT_CANAL },
    ],
    after: [
      T("The numbness lasts a few hours; wait until it wears off before eating, so you don't bite your cheek or tongue.", "يستمر التخدير بضع ساعات؛ انتظر زواله قبل الأكل حتى لا تعضّ خدك أو لسانك.", "سڕبوون چەند دەمژمێران دمینیت؛ بەری خوارنێ چاڤەڕێ بکە هەتا نەمینیت، دا لێڤ یان ئەزمانێ خۆ نەگەزی."),
      T("After a root canal the tooth can be tender for a few days.", "بعد علاج العصب قد يكون السن حساساً لبضعة أيام.", "پشتی چارەسەریا دەمارێ دبیت ددان چەند ڕۆژان هەستیار بیت."),
      T("Don't chew hard food on a root-canal-treated tooth until it is fully restored (with a crown if the doctor advises).", "لا تمضغ الطعام القاسي على السن المعالج عصبه حتى يكتمل ترميمه (بتاج إذا نصح الطبيب).", "خوارنا ڕەق ب ددانێ دەمار چارەسەرکری نەجوە هەتا ب تەمامی دئێتە چاککرن (ب کراسی ئەگەر دکتۆر بێژیت)."),
      T("Brush twice a day with fluoride toothpaste and limit sugary snacks to prevent new decay.", "فرّش مرتين يومياً بمعجون فيه فلورايد وقلّل الحلويات بين الوجبات لتجنّب تسوس جديد.", "ڕۆژانە دوو جاران ب مەعجوونا فلۆرایدێ فلچە بکە و شرینیان د ناڤبەرا ژەمان دا کێم بکە دا کڕمبوونا نوی چێنەبیت."),
    ],
    videos: [
      { id: "VR8IQ9QFdWw", credit: "VOKA 3D Anatomy & Pathology", title: T("Root canal treatment (3D)", "علاج العصب (ثلاثي الأبعاد)", "چارەسەریا دەمارێ (3D)") },
      { id: "pa0MVT0Zbcc", credit: "American Dental Association (ADA)", title: T("Composite (tooth-coloured) fillings", "الحشوات التجميلية بلون الأسنان", "حەشوێن ب ڕەنگێ ددانی") },
    ],
  },

  "crowns-bridges-dentures": {
    what: T(
      "A crown is a cap that covers a weak or broken tooth. A bridge replaces a missing tooth by joining a false tooth to crowns on the teeth on either side. A denture is a removable set of teeth: full when all the teeth are missing, partial when some remain.",
      "التاج (الكراس) غطاء يكسو السن الضعيف أو المكسور. والجسر يعوّض السن المفقود بربط سن صناعي بتاجين على السنين المجاورين. أما طقم الأسنان فهو أسنان متحركة: كامل عند فقدان جميع الأسنان، وجزئي عند بقاء بعضها.",
      "کراس سەرپۆشەکە ددانێ لاواز یان شکەستی دنخێڤیت. جسر ددانێ کەفتی دگوهۆڕیت ب گرێدانا ددانەکێ دەستکرد ب کراسێن ل سەر ددانێن هەردوو لایان. تەخم ددانێن لابەرکرینە: تەمام دەمێ هەمی ددان کەفتین، و پشکی دەمێ هندەک مایین.",
    ),
    who: [
      T("A broken or heavily filled tooth, or a tooth after root canal treatment: a crown.", "سن مكسور أو فيه حشوة كبيرة أو بعد علاج العصب: تاج.", "ددانێ شکەستی یان حەشوا مەزن تێدا، یان پشتی چارەسەریا دەمارێ: کراس."),
      T("One or more missing teeth: a bridge, an implant or a denture; the doctor explains which suits you.", "سن مفقود أو أكثر: جسر أو زراعة أو طقم؛ ويشرح لك الطبيب الأنسب لحالتك.", "ئێک یان پتر ژ ددانێن کەفتی: جسر، چاندن یان تەخم؛ دکتۆر بۆ تە ڕوون دکەت کیژ بۆ تە گونجایە."),
      T("Materials: zircon, E-max and ceramic, chosen for your teeth and budget.", "المواد: زركون وإيماكس وسيراميك، تُختار حسب أسنانك وميزانيتك.", "ماددە: زیرکۆن، ئیماکس و سیرامیک، ل گوێرەی ددان و بودجەیا تە دئێنە هەلبژارتن."),
    ],
    groups: [
      { title: T("A crown or bridge", "التاج أو الجسر", "کراس یان جسر"), steps: CROWN },
      { title: T("A denture", "طقم الأسنان", "تەخمێ ددانا"), steps: [
        S(T("Impressions and bite", "الطبعة وتسجيل الإطباق", "قالب و تۆمارکرنا گەستنێ"),
          T("Impressions or a scan of the gums are taken, and the way your jaws close is recorded.", "تؤخذ طبعة أو مسح للثة، ويُسجَّل كيف ينطبق الفكان.", "قالب یان سکانا پوکان دئێتە گرتن، و چاوانیا گرتنا شویلکان دئێتە تۆمارکرن.")),
        S(T("Try-in", "التجربة", "تاقیکرن"),
          T("The teeth are first set in wax, so you and the doctor can check their shape, colour and bite before the denture is finished.", "تُصفّ الأسنان أولاً على الشمع، لتتأكد أنت والطبيب من شكلها ولونها والإطباق قبل إكمال الطقم.", "ددان پێشی ل سەر مۆمێ دئێنە ڕێزکرن، دا تو و دکتۆر شێوە، ڕەنگ و گەستنێ بەری تەمامکرنا تەخمی ببینن.")),
        S(T("Fitting and adjustment", "التركيب والضبط", "دانان و ڕێکخستن"),
          T("The finished denture is fitted, and small sore spots are adjusted at the follow-up visits.", "يُركَّب الطقم الجاهز، وتُعدَّل أي أماكن مؤلمة صغيرة في زيارات المتابعة.", "تەخمێ ئامادە دئێتە دانان، و جهێن بچووکێن ئێشدار د سەردانێن پاشتر دا دئێنە ڕێکخستن.")),
      ] },
    ],
    after: [
      T("Brush a crown or bridge like natural teeth, and clean under the bridge with floss or a small interdental brush.", "نظّف التاج أو الجسر مثل الأسنان الطبيعية، ونظّف تحت الجسر بخيط أو فرشاة صغيرة بين الأسنان.", "کراس یان جسری وەک ددانێن سروشتی فلچە بکە، و بن جسری ب دەزوو یان فلچەیەکا بچووک پاقژ بکە."),
      T("Take a denture out and clean it every day, and rest your gums at night unless the doctor advises otherwise.", "أخرج الطقم ونظّفه كل يوم، وأرِح اللثة في الليل ما لم ينصحك الطبيب بغير ذلك.", "ڕۆژانە تەخمی دەربێخە و پاقژ بکە، و ب شەڤ پوکێن خۆ بهێلە بێهنا خۆ ڤەدەن، ئەگەر دکتۆر تشتەکێ دی نەبێژیت."),
      T("If a denture rubs or a crown feels high, come back for a quick adjustment.", "إذا كان الطقم يحتك أو التاج مرتفعاً عند العض، راجعنا لضبطه.", "ئەگەر تەخم بخورینیت یان کراس د گەستنێ دا بلند بیت، بزڤڕە دا بئێتە ڕێکخستن."),
    ],
    videos: [
      { id: "GFziL1S4zJc", credit: "Scientific Animations", title: T("Dental crown procedure", "تركيب التاج (الكراس)", "دانانا کراسی") },
      { id: "SUYM2WNZSdE", credit: "Electric Teeth", title: T("Complete dentures explained", "طقم الأسنان الكامل", "تەخمێ ددانا یێ تەمام") },
    ],
  },

  "orthodontics-braces": {
    what: T(
      "Orthodontic treatment moves the teeth slowly into a better position with gentle, steady pressure, using brackets and wires (fixed braces) or clear aligners. It improves the smile and the bite, and straight teeth are easier to clean.",
      "تقويم الأسنان يحرّك الأسنان ببطء إلى وضع أفضل بضغط لطيف ومستمر، باستخدام الحاصرات والأسلاك (التقويم الثابت) أو المصففات الشفافة. يحسّن الابتسامة والإطباق، والأسنان المستقيمة أسهل في التنظيف.",
      "تقویم ددانان هێدی هێدی بەرەو جهەکێ باشتر دبەت ب پاڵەپەستۆیەکا نەرم و بەردەوام، ب بەکارئینانا براکێت و تێلان (تقویما جێگیر) یان ئەلاینەرێن ڕوون. بزە و گەستنێ باشتر دکەت، و ددانێن ڕێک ب ساناهی پاقژ دبن.",
    ),
    who: [
      T("Crowded or crooked teeth.", "أسنان مزدحمة أو ملتوية.", "ددانێن تێکەل یان خوار."),
      T("Gaps between the teeth.", "فراغات بين الأسنان.", "کەلش د ناڤبەرا ددانان دا."),
      T("Front teeth that stick out, or a bite that doesn't meet properly (deep bite, open bite, crossbite).", "أسنان أمامية بارزة، أو إطباق غير صحيح (عميق أو مفتوح أو معكوس).", "ددانێن پێشیێ یێن دەرکەفتی، یان گەستنەکا نەدروست (کویر، ڤەکری یان بەروڤاژی)."),
      T("Both children and adults can be treated; the doctor advises the best time to start.", "يمكن علاج الأطفال والكبار، ويحدد الطبيب أفضل وقت للبدء.", "هەم زارۆک و هەم مەزن دشێن بئێنە چارەسەرکرن؛ دکتۆر باشترین دەم بۆ دەستپێکرنێ دیار دکەت."),
    ],
    groups: [{ steps: [
      S(T("Examination and records", "الفحص والتسجيلات", "پشکنین و تۆمار"),
        T("The doctor examines your teeth and bite and takes X-rays, photos and a scan or impressions.", "يفحص الطبيب أسنانك وإطباقك ويأخذ صور أشعة وصوراً ومسحاً أو طبعة.", "دکتۆر ددان و گەستنا تە دپشکنیت و تیشک، وێنە و سکان یان قالبی دگریت.")),
      S(T("The treatment plan", "خطة العلاج", "پلانا چارەسەریێ"),
        T("The doctor explains the options, what will be corrected and about how long it will take.", "يشرح لك الطبيب الخيارات وما سيُصحَّح والمدة المتوقعة تقريباً.", "دکتۆر ڕێکان، تشتێ دئێتە ڕاستکرن و نێزیکی دەمێ پێدڤی بۆ تە ڕوون دکەت.")),
      S(T("Fitting the braces", "تركيب التقويم", "دانانا تقویمێ"),
        T("Small brackets are bonded to the teeth and a wire is attached. This is not painful, but the teeth may feel sore for a few days.", "تُلصق حاصرات صغيرة على الأسنان ويُثبّت السلك. التركيب غير مؤلم، لكن قد تشعر بألم خفيف لبضعة أيام.", "براکێتێن بچووک ب ددانان ڤە دئێنە نووساندن و تێل دئێتە گرێدان. ئەڤە ئێشدار نینە، بەلێ دبیت ددان چەند ڕۆژان هەستیار بن.")),
      S(T("Regular adjustments", "المراجعات الدورية", "سەردانێن ڕێکوپێک"),
        T("Every few weeks the doctor checks progress and adjusts or changes the wire to keep the teeth moving.", "كل بضعة أسابيع يتابع الطبيب التقدم ويعدّل السلك أو يغيّره لتستمر حركة الأسنان.", "هەر چەند هەفتیان دکتۆر پێشکەفتنێ دبینیت و تێلی ڕێکدئێخیت یان دگوهۆڕیت دا ددان بەردەوام بلڤن.")),
      S(T("The retainer", "المثبّت", "ڕاگرێ ددانان"),
        T("When the braces come off, a retainer keeps the teeth in their new position. Wearing it as advised is very important.", "بعد إزالة التقويم يحافظ المثبّت على الأسنان في وضعها الجديد، والالتزام بلبسه كما يوصي الطبيب مهم جداً.", "پشتی لابرنا تقویمێ، ڕاگر ددانان ل جهێ وان یێ نوی دهێلیت. لبەرکرنا وی وەک دکتۆر دبێژیت زۆر گرنگە.")),
    ] }],
    after: [
      T("Brush carefully around the brackets after every meal.", "فرّش بعناية حول الحاصرات بعد كل وجبة.", "پشتی هەر ژەمەکێ ب هویری دۆرا براکێتان فلچە بکە."),
      T("Avoid hard and sticky foods (nuts, hard sweets, chewing gum) that can break the brackets.", "تجنّب الأطعمة القاسية واللزجة (المكسرات، الحلويات الصلبة، العلكة) التي قد تكسر الحاصرات.", "خۆ ژ خوارنێن ڕەق و لیچ (گویز، شرینیێن ڕەق، بنێشت) بپارێزە کو دشێن براکێتان بشکێنن."),
      T("If a bracket comes loose or a wire hurts, call the clinic.", "إذا انفكت حاصرة أو آذاك سلك، اتصل بالعيادة.", "ئەگەر براکێتەک ڤەبوو یان تێلەک ئێشا، تەلەفۆنێ بۆ کلینیکێ بکە."),
    ],
    videos: [
      { id: "l2uQyBCmj9I", credit: "Dentalk!", title: T("How braces work", "كيف يعمل تقويم الأسنان", "تقویم چاوا کار دکەت") },
    ],
  },

  "dental-cleaning": {
    what: T(
      "Professional cleaning (scaling and polishing) removes tartar, hardened plaque that a toothbrush cannot remove, and surface stains. It helps keep the gums healthy and the breath fresh.",
      "التنظيف الاحترافي (إزالة الجير والتلميع) يزيل الجير، وهو طبقة متصلبة لا تزيلها الفرشاة، ويزيل التصبغات السطحية. يساعد على صحة اللثة ونَفَس منعش.",
      "پاقژکرنا پیشەیی (ڕاکرنا کلسی و بریقەدان) کلسێ ڕەقبووی کو فلچە نەشێت ڕابکەت و ڕەنگێن سەرڕوویی ڕادکەت. هاریکاریا ساخلەمیا پوکان و بێهنا پاقژ دکەت.",
    ),
    who: [
      T("Gums that bleed when you brush.", "نزيف اللثة عند التفريش.", "خوین ژ پوکان دئێت دەمێ فلچەکرنێ."),
      T("Visible tartar or stains from tea, coffee or smoking.", "جير ظاهر أو تصبغات من الشاي والقهوة أو التدخين.", "کلسێ دیار یان ڕەنگبوون ژ چا، قەهوە یان جگارێ."),
      T("Bad breath.", "رائحة الفم الكريهة.", "بێهنا نەخۆش یا دەڤی."),
      T("As a routine check-up and cleaning, usually every 6 months.", "كفحص وتنظيف دوري، عادةً كل ٦ أشهر.", "وەک پشکنین و پاقژکرنەکا ڕێکوپێک، ب گشتی هەر ٦ هەیڤان."),
    ],
    groups: [{ steps: [
      S(T("Check-up", "الفحص", "پشکنین"),
        T("The doctor examines your teeth and gums for decay and signs of gum disease.", "يفحص الطبيب أسنانك ولثتك بحثاً عن التسوس وعلامات أمراض اللثة.", "دکتۆر ددان و پوکێن تە بۆ کڕمبوونێ و نیشانێن نەخۆشیێن پوکان دپشکنیت.")),
      S(T("Scaling", "إزالة الجير", "ڕاکرنا کلسی"),
        T("An ultrasonic scaler removes tartar above and just below the gum line. You feel vibration and a water spray, not pain.", "يزيل جهاز الموجات فوق الصوتية الجير فوق خط اللثة وتحته قليلاً. تشعر باهتزاز ورذاذ ماء، لا بألم.", "ئامیرێ ئولتراسۆنیک کلسی ل سەر و کەمەکێ بن هێلا پوکان ڕادکەت. تو لەرزین و پرشینگا ئاڤێ هەست دکەی، نە ئێش.")),
      S(T("Polishing", "التلميع", "بریقەدان"),
        T("A polishing paste removes stains and smooths the teeth so plaque sticks less.", "يزيل معجون التلميع التصبغات وينعّم سطح الأسنان فتقلّ البلاك عليها.", "مەعجوونا بریقەدانێ ڕەنگان ڕادکەت و ڕوویێ ددانان نەرم دکەت دا پیسی کێمتر پێڤە بنووسیت.")),
      S(T("Advice", "النصائح", "شیرەت"),
        T("You get simple brushing and flossing tips, and the date of your next check-up.", "تحصل على نصائح بسيطة للتفريش والخيط، وموعد الفحص القادم.", "شیرەتێن سادە بۆ فلچەکرن و دەزووکرنێ و ژڤانێ پشکنینا بێت وەردگری.")),
    ] }],
    after: [
      T("Slight sensitivity or tender gums for a day or two are normal.", "الحساسية الخفيفة أو ألم اللثة البسيط ليوم أو يومين أمر طبيعي.", "هەستیاریا کێم یان ئێشا سڤکا پوکان بۆ ڕۆژەکێ یان دوو ئاساییە."),
      T("Brush twice a day with fluoride toothpaste and clean between the teeth every day.", "فرّش مرتين يومياً بمعجون فيه فلورايد ونظّف بين الأسنان كل يوم.", "ڕۆژانە دوو جاران ب مەعجوونا فلۆرایدێ فلچە بکە و هەر ڕۆژ ناڤبەرا ددانان پاقژ بکە."),
      T("Come back for your next cleaning as the doctor advises, usually every 6 months.", "عُد للتنظيف القادم حسب نصيحة الطبيب، عادةً كل ٦ أشهر.", "ل گوێرەی شیرەتا دکتۆری بۆ پاقژکرنا بێت بزڤڕە، ب گشتی هەر ٦ هەیڤان."),
    ],
    videos: [
      { id: "SpIhNc05n3k", credit: "DentaGama", title: T("Scaling and polishing", "إزالة الجير وتلميع الأسنان", "ڕاکرنا کلسی و بریقەدانا ددانان") },
    ],
  },

  "tooth-extraction": {
    what: T(
      "Extraction means removing a tooth that cannot be saved. It is done gently under local anaesthetic, and the doctor explains the options to replace the tooth afterwards.",
      "القلع هو إزالة سن لا يمكن إنقاذه. يتم بلطف تحت التخدير الموضعي، ويشرح لك الطبيب بعده خيارات تعويض السن.",
      "هەلکێشان واتە ڕاکرنا ددانەکێ کو نەهێتە ڕزگارکرن. ب نەرمی و ب سڕکرنا جهی دئێتە کرن، و دکتۆر پاشی ڕێکێن گوهۆڕینا ددانی بۆ تە ڕوون دکەت.",
    ),
    who: [
      T("Decay or a crack too large to repair.", "تسوس أو كسر أكبر من أن يُصلَح.", "کڕمبوون یان شکەستنەکا زۆر مەزن کو نەئێتە چاککرن."),
      T("A tooth loosened by advanced gum disease.", "سن متحرك بسبب أمراض اللثة المتقدمة.", "ددانەکێ ب نەخۆشیا پوکان یا پێشکەفتی لەقیای."),
      T("A wisdom tooth that causes pain, infection or damage to the tooth next to it.", "ضرس عقل يسبب ألماً أو التهاباً أو ضرراً للسن المجاور.", "ددانێ عەقلی کو ئێش، هەوکرن یان زیانێ دگەهینیتە ددانێ تەنیشت."),
    ],
    groups: [{ steps: EXTRACTION }],
    after: [
      T("Bite firmly on the gauze for 30 to 45 minutes.", "اعضض على الشاش بقوة لمدة ٣٠ إلى ٤٥ دقيقة.", "بۆ ٣٠ هەتا ٤٥ خولەکان ب هێز ل سەر گازێ بگەزە."),
      T("For the first 24 hours do not rinse, spit forcefully, drink through a straw or smoke, so the blood clot stays in place.", "في أول ٢٤ ساعة لا تتمضمض ولا تبصق بقوة ولا تشرب بالشفاطة ولا تدخّن، حتى تبقى الجلطة الدموية في مكانها.", "د ٢٤ دەمژمێرێن ئێکێ دا دەڤێ خۆ نەشۆ، ب هێز تف نەکە، ب قەسەبێ ڤەنەخۆ و جگارێ نەکێشە، دا خوینا مەیی ل جهێ خۆ بمینیت."),
      T("Use a cold pack on the cheek on the first day and eat soft, cool food.", "ضع كمادة باردة على الخد في اليوم الأول وتناول طعاماً طرياً وبارداً.", "ڕۆژا ئێکێ تشتەکێ سار ل سەر ڕوومەتێ دانە و خوارنا نەرم و سار بخۆ."),
      T("Call the clinic if bleeding is heavy, if pain gets worse after 2 to 3 days, or if you have swelling with fever.", "اتصل بالعيادة إذا كان النزيف شديداً، أو زاد الألم بعد ٢ إلى ٣ أيام، أو ظهر تورم مع حرارة.", "تەلەفۆنێ بۆ کلینیکێ بکە ئەگەر خوینبەربوون زۆر بوو، یان ئێش پشتی ٢ هەتا ٣ ڕۆژان زێدەتر بوو، یان ماسین دگەل تایێ هەبوو."),
    ],
    videos: [
      { id: "RIhr32Ko-uY", credit: "Riverside Oral Surgery", title: T("Tooth extraction (3D)", "قلع السن (ثلاثي الأبعاد)", "هەلکێشانا ددانی (3D)") },
    ],
  },
};
