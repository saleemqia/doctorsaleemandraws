// Content of the "Children's teeth" section, in English, Arabic and Kurdish (Badini).
// Eruption and shedding ages follow the American Dental Association charts; every child
// is different, so a few months earlier or later is normal.

export type KidsLang = "en" | "ar" | "ku";

interface ToothRow {
  name: string;
  erupt: string;
  shed?: string;
}

interface AgeStep {
  age: string;
  title: string;
  points: string[];
}

export interface KidsContent {
  badge: string;
  title1: string;
  title2: string;
  intro: string;
  tabBaby: string;
  tabPermanent: string;
  colTooth: string;
  colErupt: string;
  colShed: string;
  babySummary: string;
  permanentSummary: string;
  baby: ToothRow[];
  permanent: ToothRow[];
  sixYearMolar: string;
  normalNote: string;
  careTitle: string;
  ages: AgeStep[];
  tipsTitle: string;
  tips: string[];
  visitTitle: string;
  visit: string[];
  emergencyTitle: string;
  emergency: string[];
  cta: string;
}

export const KIDS_TEETH: Record<KidsLang, KidsContent> = {
  en: {
    badge: "Children's teeth",
    title1: "Your Child's Teeth:",
    title2: "A Guide for Parents",
    intro:
      "When baby teeth come in and fall out, when permanent teeth arrive, and how to look after them at every age.",
    tabBaby: "Baby (primary) teeth",
    tabPermanent: "Permanent teeth",
    colTooth: "Tooth",
    colErupt: "Comes in",
    colShed: "Falls out",
    babySummary: "20 baby teeth. The first usually appears at about 6 months, and all 20 are in by about 3 years.",
    permanentSummary: "32 permanent teeth (28 without wisdom teeth). They start coming in at about 6 years.",
    baby: [
      { name: "Central incisors", erupt: "6–12 months", shed: "6–7 years" },
      { name: "Lateral incisors", erupt: "9–16 months", shed: "7–8 years" },
      { name: "Canines", erupt: "16–23 months", shed: "9–12 years" },
      { name: "First molars", erupt: "13–19 months", shed: "9–11 years" },
      { name: "Second molars", erupt: "23–33 months", shed: "10–12 years" },
    ],
    permanent: [
      { name: "First molars (6-year molars)", erupt: "6–7 years" },
      { name: "Central incisors", erupt: "6–8 years" },
      { name: "Lateral incisors", erupt: "7–9 years" },
      { name: "Canines", erupt: "9–12 years" },
      { name: "First premolars", erupt: "10–11 years" },
      { name: "Second premolars", erupt: "10–12 years" },
      { name: "Second molars (12-year molars)", erupt: "11–13 years" },
      { name: "Wisdom teeth", erupt: "17–21 years" },
    ],
    sixYearMolar:
      "Important: at about 6 years the first permanent molar comes in behind the last baby tooth, without any tooth falling out. Many parents think it is a baby tooth, but it stays for life, so protect it well.",
    normalNote: "A few months earlier or later than these ages is normal.",
    careTitle: "Care at every age",
    ages: [
      {
        age: "0–1 year",
        title: "Before and with the first tooth",
        points: [
          "Wipe the gums with a clean, damp cloth after feeds.",
          "From the first tooth, brush twice a day with a soft baby brush and a rice-grain smear of fluoride toothpaste.",
          "First dental visit by the first birthday.",
        ],
      },
      {
        age: "1–3 years",
        title: "Toddlers",
        points: [
          "You brush for your child, twice a day, the last time before sleep.",
          "Never put your child to bed with a bottle of milk, juice or sweet drinks.",
          "Move from the bottle to a cup at about one year.",
        ],
      },
      {
        age: "3–6 years",
        title: "Pre-school",
        points: [
          "A pea-sized amount of fluoride toothpaste.",
          "Teach your child to spit out the paste, not to rinse with lots of water.",
          "Let them try, then you finish the brushing.",
        ],
      },
      {
        age: "6–12 years",
        title: "School age",
        points: [
          "Keep checking their brushing until about 8 years old.",
          "Start flossing when teeth touch each other.",
          "Ask about fissure sealants to protect the new permanent molars.",
          "A mouthguard for contact sports.",
        ],
      },
    ],
    tipsTitle: "Tips for parents",
    tips: [
      "How often your child eats sugar matters more than how much: keep sweets to mealtimes.",
      "Water is the best drink between meals. Juice and soft drinks damage teeth.",
      "Do not share spoons or clean a dummy (pacifier) in your mouth: it passes decay bacteria to your child.",
      "Brush for 2 minutes, morning and before bed. Nothing to eat or drink after night brushing except water.",
      "A check-up every 6 months finds small cavities before they hurt.",
      "Baby teeth matter: they hold space for permanent teeth and help your child eat and speak.",
      "For teething: a cold (not frozen) teething ring and gentle gum massage. Avoid numbing gels for babies.",
    ],
    visitTitle: "See the dentist if",
    visit: [
      "No tooth has appeared by 18 months.",
      "You see white chalky spots, brown or black spots, or holes on the teeth.",
      "Your child has tooth pain, gum swelling or bad breath that does not go away.",
      "A baby tooth is lost early from decay or a fall (the space may need a space maintainer).",
      "A permanent tooth comes in behind a baby tooth that is still firm.",
      "Your child still sucks a thumb or dummy after about 4 years old.",
    ],
    emergencyTitle: "Dental emergency",
    emergency: [
      "Permanent tooth knocked out: hold it by the crown (not the root), rinse briefly if dirty, put it back in place or keep it in milk, and come to the clinic within 30 minutes.",
      "Do not put a knocked-out baby tooth back in. Come to the clinic so we can check.",
      "Broken tooth: keep the piece in milk and come the same day.",
    ],
    cta: "Book a visit for your child",
  },
  ar: {
    badge: "أسنان الأطفال",
    title1: "أسنان طفلك:",
    title2: "دليل للأهل",
    intro: "متى تظهر الأسنان اللبنية ومتى تسقط، ومتى تظهر الأسنان الدائمة، وكيف تعتني بها في كل عمر.",
    tabBaby: "الأسنان اللبنية",
    tabPermanent: "الأسنان الدائمة",
    colTooth: "السن",
    colErupt: "وقت الظهور",
    colShed: "وقت السقوط",
    babySummary: "٢٠ سناً لبنياً. يظهر أول سن عادةً بعمر ٦ أشهر تقريباً، وتكتمل كلها بعمر ٣ سنوات تقريباً.",
    permanentSummary: "٣٢ سناً دائماً (٢٨ بدون أضراس العقل). تبدأ بالظهور بعمر ٦ سنوات تقريباً.",
    baby: [
      { name: "القواطع الوسطى", erupt: "٦–١٢ شهراً", shed: "٦–٧ سنوات" },
      { name: "القواطع الجانبية", erupt: "٩–١٦ شهراً", shed: "٧–٨ سنوات" },
      { name: "الأنياب", erupt: "١٦–٢٣ شهراً", shed: "٩–١٢ سنة" },
      { name: "الأضراس الأولى", erupt: "١٣–١٩ شهراً", shed: "٩–١١ سنة" },
      { name: "الأضراس الثانية", erupt: "٢٣–٣٣ شهراً", shed: "١٠–١٢ سنة" },
    ],
    permanent: [
      { name: "الأضراس الأولى (ضرس السادسة)", erupt: "٦–٧ سنوات" },
      { name: "القواطع الوسطى", erupt: "٦–٨ سنوات" },
      { name: "القواطع الجانبية", erupt: "٧–٩ سنوات" },
      { name: "الأنياب", erupt: "٩–١٢ سنة" },
      { name: "الضواحك الأولى", erupt: "١٠–١١ سنة" },
      { name: "الضواحك الثانية", erupt: "١٠–١٢ سنة" },
      { name: "الأضراس الثانية (ضرس الثانية عشرة)", erupt: "١١–١٣ سنة" },
      { name: "أضراس العقل", erupt: "١٧–٢١ سنة" },
    ],
    sixYearMolar:
      "مهم: بعمر ٦ سنوات تقريباً يظهر أول ضرس دائم خلف آخر سن لبني، بدون أن يسقط أي سن. كثير من الأهل يظنونه سناً لبنياً، لكنه يبقى مدى الحياة، فاحمِه جيداً.",
    normalNote: "الظهور قبل هذه الأعمار أو بعدها ببضعة أشهر أمر طبيعي.",
    careTitle: "العناية في كل عمر",
    ages: [
      {
        age: "٠–١ سنة",
        title: "قبل أول سن ومعه",
        points: [
          "امسح اللثة بقطعة قماش نظيفة ومبللة بعد الرضاعة.",
          "من أول سن، نظّف الأسنان مرتين يومياً بفرشاة أطفال ناعمة وكمية بحجم حبة الرز من معجون فيه فلورايد.",
          "أول زيارة لطبيب الأسنان قبل إكمال السنة الأولى.",
        ],
      },
      {
        age: "١–٣ سنوات",
        title: "الطفل الصغير",
        points: [
          "أنت من ينظف أسنان طفلك، مرتين يومياً، وآخر مرة قبل النوم.",
          "لا تجعل طفلك ينام مع رضّاعة حليب أو عصير أو مشروب حلو.",
          "انتقل من الرضّاعة إلى الكوب بعمر سنة تقريباً.",
        ],
      },
      {
        age: "٣–٦ سنوات",
        title: "قبل المدرسة",
        points: [
          "كمية بحجم حبة البازلاء من معجون فيه فلورايد.",
          "علّم طفلك أن يبصق المعجون، لا أن يمضمض بماء كثير.",
          "دعه يحاول بنفسه، ثم أكمل أنت التنظيف.",
        ],
      },
      {
        age: "٦–١٢ سنة",
        title: "عمر المدرسة",
        points: [
          "استمر في متابعة تفريش أسنانه حتى عمر ٨ سنوات تقريباً.",
          "ابدأ بالخيط عندما تتلامس الأسنان.",
          "اسأل عن الحشوات الوقائية (السيلانت) لحماية الأضراس الدائمة الجديدة.",
          "واقي الأسنان عند ممارسة الرياضات العنيفة.",
        ],
      },
    ],
    tipsTitle: "نصائح للأهل",
    tips: [
      "عدد مرات تناول السكريات أهم من كميتها: اجعل الحلويات مع الوجبات فقط.",
      "الماء أفضل مشروب بين الوجبات. العصائر والمشروبات الغازية تضر الأسنان.",
      "لا تشارك الملعقة مع طفلك ولا تنظف اللهاية بفمك: هذا ينقل بكتيريا التسوس إليه.",
      "التفريش دقيقتين، صباحاً وقبل النوم. لا أكل ولا شرب بعد تفريش الليل إلا الماء.",
      "الفحص كل ٦ أشهر يكشف التسوس الصغير قبل أن يسبب الألم.",
      "الأسنان اللبنية مهمة: تحفظ المكان للأسنان الدائمة وتساعد طفلك على الأكل والنطق.",
      "عند التسنين: عضّاضة باردة (غير مجمدة) وتدليك خفيف للثة. تجنب الجل المخدر للرضع.",
    ],
    visitTitle: "راجع طبيب الأسنان إذا",
    visit: [
      "لم يظهر أي سن حتى عمر ١٨ شهراً.",
      "لاحظت بقعاً بيضاء طباشيرية أو بنية أو سوداء أو ثقوباً في الأسنان.",
      "يشكو طفلك من ألم في الأسنان أو تورم في اللثة أو رائحة فم لا تزول.",
      "سقط سن لبني مبكراً بسبب التسوس أو سقطة (قد يحتاج المكان إلى حافظ مسافة).",
      "ظهر سن دائم خلف سن لبني ما زال ثابتاً.",
      "ما زال طفلك يمص إصبعه أو اللهاية بعد عمر ٤ سنوات تقريباً.",
    ],
    emergencyTitle: "حالة طارئة",
    emergency: [
      "سقوط سن دائم بضربة: امسكه من التاج (وليس الجذر)، اغسله قليلاً إذا كان متسخاً، أرجعه مكانه أو ضعه في الحليب، وتعال إلى العيادة خلال ٣٠ دقيقة.",
      "لا ترجع السن اللبني الساقط إلى مكانه. تعال إلى العيادة لنفحصه.",
      "سن مكسور: احفظ القطعة في الحليب وتعال في نفس اليوم.",
    ],
    cta: "احجز زيارة لطفلك",
  },
  ku: {
    badge: "ددانێن زارۆکان",
    title1: "ددانێن زارۆکێ تە:",
    title2: "ڕێبەرەک بۆ دەیک و بابان",
    intro:
      "ددانێن شیری کەنگی دەردکەڤن و کەنگی دکەڤن، ددانێن هەمیشەیی کەنگی دەردکەڤن، و چاوا د هەر تەمەنەکی دا چاڤدێریا وان بکەی.",
    tabBaby: "ددانێن شیری",
    tabPermanent: "ددانێن هەمیشەیی",
    colTooth: "ددان",
    colErupt: "دەرکەفتن",
    colShed: "کەفتن",
    babySummary: "٢٠ ددانێن شیری. ئێکەم ددان ب گشتی ل تەمەنێ ٦ هەیڤان دەردکەڤیت، و هەمی ل تەمەنێ ٣ ساڵان تەمام دبن.",
    permanentSummary: "٣٢ ددانێن هەمیشەیی (٢٨ بێ ددانێن عەقلی). ل تەمەنێ ٦ ساڵان دەست ب دەرکەفتنێ دکەن.",
    baby: [
      { name: "ددانێن پێشی یێن ناڤینێ", erupt: "٦–١٢ هەیڤ", shed: "٦–٧ ساڵ" },
      { name: "ددانێن پێشی یێن کەناری", erupt: "٩–١٦ هەیڤ", shed: "٧–٨ ساڵ" },
      { name: "کەلبە", erupt: "١٦–٢٣ هەیڤ", shed: "٩–١٢ ساڵ" },
      { name: "کاکیلێن ئێکێ", erupt: "١٣–١٩ هەیڤ", shed: "٩–١١ ساڵ" },
      { name: "کاکیلێن دووێ", erupt: "٢٣–٣٣ هەیڤ", shed: "١٠–١٢ ساڵ" },
    ],
    permanent: [
      { name: "کاکیلێن ئێکێ (کاکیلا ٦ ساڵی)", erupt: "٦–٧ ساڵ" },
      { name: "ددانێن پێشی یێن ناڤینێ", erupt: "٦–٨ ساڵ" },
      { name: "ددانێن پێشی یێن کەناری", erupt: "٧–٩ ساڵ" },
      { name: "کەلبە", erupt: "٩–١٢ ساڵ" },
      { name: "کاکیلێن بچووک یێن ئێکێ", erupt: "١٠–١١ ساڵ" },
      { name: "کاکیلێن بچووک یێن دووێ", erupt: "١٠–١٢ ساڵ" },
      { name: "کاکیلێن دووێ (کاکیلا ١٢ ساڵی)", erupt: "١١–١٣ ساڵ" },
      { name: "ددانێن عەقلی", erupt: "١٧–٢١ ساڵ" },
    ],
    sixYearMolar:
      "گرنگ: ل تەمەنێ ٦ ساڵان ئێکەم کاکیلا هەمیشەیی ل پشت دوماهیک ددانێ شیری دەردکەڤیت، بێ کو چ ددان بکەڤیت. گەلەک دەیک و باب هزر دکەن ددانێ شیری یە، بەلێ هەتا دوماهیا ژیانێ دمینیت، لەوما باش پاراستنا وێ بکە.",
    normalNote: "چەند هەیڤەکان زووتر یان درەنگتر ژ ڤان تەمەنان ئاسایی یە.",
    careTitle: "چاڤدێری د هەر تەمەنەکی دا",
    ages: [
      {
        age: "٠–١ ساڵ",
        title: "بەری ئێکەم ددانی و دگەل",
        points: [
          "پشتی شیرداکرنێ پوکان ب پەرۆیەکێ پاقژ و تەڕ پاقژ بکە.",
          "ژ ئێکەم ددانی، ڕۆژێ دوو جاران ب فلچەیەکا نەرم یا زارۆکان و ب قەدەرێ دانەکا برنجی ژ مەعجوونا فلۆراید تێدا پاقژ بکە.",
          "ئێکەم سەردانا نوژدارێ ددانا بەری ساڵا ئێکێ تەمام ببیت.",
        ],
      },
      {
        age: "١–٣ ساڵ",
        title: "زارۆکێ بچووک",
        points: [
          "تو ب خۆ ددانێن زارۆکێ خۆ پاقژ بکە، ڕۆژێ دوو جاران، و دوماهیک جار بەری خەوێ.",
          "نەهێلە زارۆک دگەل شیشا شیر، شەربەت یان ڤەخوارنا شرین بنڤیت.",
          "ل تەمەنێ ساڵەکێ ژ شیشێ بۆ پەرداخێ بگوهۆڕە.",
        ],
      },
      {
        age: "٣–٦ ساڵ",
        title: "بەری قوتابخانێ",
        points: [
          "قەدەرێ دانەکا پاقلکێ ژ مەعجوونا فلۆراید تێدا.",
          "فێری زارۆکێ خۆ بکە مەعجوونێ تف بکەت، نە ب ئاڤەکا زۆر دەڤێ خۆ بشۆت.",
          "بهێلە ئەو ب خۆ هەول بدەت، پاشی تو پاقژکرنێ تەمام بکە.",
        ],
      },
      {
        age: "٦–١٢ ساڵ",
        title: "تەمەنێ قوتابخانێ",
        points: [
          "هەتا تەمەنێ ٨ ساڵان چاڤ ل فلچەکرنا وی بکە.",
          "دەمێ ددان ب ئێک ڤە دنووسن، دەست ب دەزییا ددانا بکە.",
          "پسیارا سیلانتێ (حەشوا پاراستنێ) بکە بۆ پاراستنا کاکیلێن هەمیشەیی یێن نوی.",
          "پاراستنکەرێ ددانا دەمێ وەرزشێن توند.",
        ],
      },
    ],
    tipsTitle: "شیرەت بۆ دەیک و بابان",
    tips: [
      "چەند جاران زارۆک شرینی دخۆت گرنگترە ژ چەندیا وێ: شرینیێ تنێ دگەل خوارنێ بدە.",
      "ئاڤ باشترین ڤەخوارنە د ناڤبەرا خوارنان دا. شەربەت و ڤەخوارنێن گازی زیانێ دگەهیننە ددانا.",
      "کەڤچکێ خۆ دگەل زارۆکی پشک نەکە و مەمکا وی ب دەڤێ خۆ پاقژ نەکە: ئەڤە بەکتریا کڕمبوونێ بۆ وی ڤەدگوهێزیت.",
      "دوو خولەکان فلچە بکە، سپێدێ و بەری خەوێ. پشتی فلچەکرنا شەڤێ ژبلی ئاڤێ چ نەخۆت و نەڤەخوت.",
      "پشکنین هەر ٦ هەیڤان جارەکێ کڕمبوونا بچووک بەری ئێشێ دبینیت.",
      "ددانێن شیری گرنگن: جهێ ددانێن هەمیشەیی دپارێزن و هاریکاریا زارۆکی دکەن بۆ خوارن و ئاخفتنێ.",
      "دەمێ ددان دەردکەڤن: تشتەکێ سار (نە قەرسی) بۆ گەستنێ و مالشتنا نەرم یا پوکان. ژ جێلا سڕکرنێ بۆ ساڤایان دوور بکەڤە.",
    ],
    visitTitle: "سەردانا نوژدارێ ددانا بکە ئەگەر",
    visit: [
      "هەتا تەمەنێ ١٨ هەیڤان چ ددان دەرنەکەفتبن.",
      "پەڵەیێن سپی یێن وەک تەباشیرێ، قاوەیی یان ڕەش، یان کون ل سەر ددانا دبینی.",
      "زارۆک ئێشا ددانی، نەپسینا پوکان یان بێهنا دەڤی یا نەچیت هەیە.",
      "ددانەکێ شیری ژ بەر کڕمبوونێ یان کەفتنێ زوو کەفتبیت (دبیت جهـ پێدڤی پاراستنکەرێ جهی بیت).",
      "ددانەکێ هەمیشەیی ل پشت ددانەکێ شیری یێ هێشتا موکم دەرکەفتبیت.",
      "زارۆک پشتی تەمەنێ ٤ ساڵان هێشتا تبلا خۆ یان مەمکێ دمژیت.",
    ],
    emergencyTitle: "حالەتا لەز",
    emergency: [
      "ددانەکێ هەمیشەیی ب لێدانێ کەفت: ژ تاجێ بگرە (نە ژ ڕەهی)، ئەگەر پیس بوو کێمەکێ بشۆ، بزڤڕینە جهێ وی یان بکە د شیری دا، و د ماوێ ٣٠ خولەکان دا وەرە کلینیکێ.",
      "ددانێ شیری یێ کەفتی نەزڤڕینە جهێ وی. وەرە کلینیکێ دا بپشکنین.",
      "ددانێ شکەستی: پارچێ د شیری دا بپارێزە و هەمان ڕۆژ وەرە.",
    ],
    cta: "نۆرەیەکێ بۆ زارۆکێ خۆ بگرە",
  },
};
