export type Goal = "phd" | "industry" | "both";

export type Category =
  | "research"
  | "systems"
  | "llm"
  | "oss"
  | "competition"
  | "data"
  | "writing";

export type TermFit = "core" | "high" | "medium" | "later";

export type Project = {
  id: string;
  rankHint: number;
  titleFa: string;
  titleEn: string;
  category: Category;
  termFit: TermFit;
  effortWeeks: string;
  difficulty: 2 | 3 | 4 | 5;
  importance: number;
  resumeImpact: number;
  phdImpact: number;
  industryImpact: number;
  why: string;
  resumeWhy: string;
  usWhy: string;
  deliverables: string[];
  plan: string[];
  resumeLine: string;
  pitfalls: string[];
  tags: string[];
};

export const categoryLabel: Record<Category, string> = {
  research: "پژوهش",
  systems: "سیستم و مهندسی",
  llm: "مدل زبانی و عامل",
  oss: "متن‌باز",
  competition: "مسابقه",
  data: "داده",
  writing: "نوشتن و ارائه",
};

export const projects: Project[] = [
  {
    id: "thesis-paper",
    rankHint: 1,
    titleFa: "پایان‌نامه را به یک مقاله قابل‌داوری تبدیل کن",
    titleEn: "Thesis → peer-reviewed paper",
    category: "research",
    termFit: "core",
    effortWeeks: "کل ترم ۳ و ۴",
    difficulty: 5,
    importance: 10,
    resumeImpact: 9.5,
    phdImpact: 10,
    industryImpact: 7,
    why: "ترم ۳ یعنی وقت پایان‌نامه است. اگر فقط یک کار «سنگین» بکنی، همین باید باشد: سؤال پژوهشی مشخص، بیس‌لاین قوی، آزمایش تکرارپذیر، و یک پیش‌نویس که حداقل به ورک‌شاپ یا کنفرانس معتبر برسد. مقاله ضعیف با ادعاهای بزرگ ارزش ندارد؛ مقاله کوچک با ablation و خطای صادقانه ارزش دارد.",
    resumeWhy: "در رزومه آمریکایی، «انجام پایان‌نامه» تقریباً هیچ سیگنالی ندارد. «First author paper / under review at X» سیگنال است. کمیته PhD اول Publications را می‌بیند؛ ریکروتر صنعت اگر موضوع کاربردی باشد، همان را به‌عنوان پروژه عمیق می‌خواند.",
    usWhy: "برای ورود به آمریکا از ایران، قوی‌ترین مسیر عملی برای خیلی از دانشجویان AI، PhD با فاند است نه اپلای مستقیم به شرکت آمریکایی. مقاله، نامه توصیه قوی، و داستان پژوهشی منسجم همان چیزی است که admission روی آن شرط می‌بندد.",
    deliverables: [
      "یک سؤال پژوهشی در یک جمله و فرضیه‌های قابل‌ابطال",
      "کد تکرارپذیر + اسکریپت آزمایش + جدول نتایج",
      "پیش‌نویس مقاله به انگلیسی (حداقل ۸ صفحه کنفرانسی)",
      "سابمیت به venue مناسب سطح کار، نه لزوماً NeurIPS در اولین شانس",
    ],
    plan: [
      "هفته ۱: محدوده را کوچک کن. یک تسک، یک دیتاست، دو بیس‌لاین.",
      "هفته ۲–۳: بازتولید بیس‌لاین و ساخت eval ثابت. بدون این، بقیه کار نمایش است.",
      "هفته ۴–۸: ایده اصلی + ablation (داده، معماری، هایپرپارامتر، خطا).",
      "همزمان: هر جمعه یک صفحه انگلیسی از Related Work و Method بنویس.",
      "قبل از دفاع: arXiv در صورت اجازه استاد + ریپوی عمومی با README انگلیسی.",
    ],
    resumeLine:
      "Designed and evaluated a [task] method that improved [metric] by X% over [baseline]; first-author manuscript under review at [venue].",
    pitfalls: [
      "موضوع خیلی گشاد («یک LLM بهتر»)",
      "نتیجه فقط روی یک دیتاست بدون تحلیل خطا",
      "کد خصوصی که هیچ‌کس نمی‌تواند تکرار کند",
      "هدف‌گرفتن فقط ژورنال داخلی بدون نسخه انگلیسی",
    ],
    tags: ["پایان‌نامه", "مقاله", "PhD", "اولویت اول"],
  },
  {
    id: "flagship-repo",
    rankHint: 2,
    titleFa: "یک ریپوی پرچم: سیستم کامل با ارزیابی، نه دموی چت",
    titleEn: "Flagship production-style ML repo",
    category: "systems",
    termFit: "core",
    effortWeeks: "۶–۱۰ هفته (موازی پایان‌نامه اگر همان موضوع باشد)",
    difficulty: 4,
    importance: 9.5,
    resumeImpact: 9.5,
    phdImpact: 6.5,
    industryImpact: 10,
    why: "صنعت آمریکا در ۲۰۲۶ از فوق‌لیسانس AI انتظار دارد بتواند مدل را به سیستم تبدیل کند: داده، آموزش یا تنظیم، ارزیابی، سرو کردن، و محدودیت هزینه/تأخیر. یک چت‌بات روی API دیگران تقریباً صفر است. اگر موضوع پایان‌نامه‌ات LLM یا بازیابی است، همین را مهندسی کن تا دو پروژه جدا نسازی.",
    resumeWhy: "ریکروتر لینک GitHub را در ۳۰ ثانیه اسکن می‌کند: README انگلیسی، معماری، جدول بنچمارک، و دستور اجرا. اگر این‌ها باشد، پروژه دانشجویی شبیه کار یک ML Engineer دیده می‌شود نه تکلیف درس.",
    usWhy: "استخدام مستقیم از ایران توسط شرکت آمریکایی به‌خاطر تحریم و محدودیت پرداخت سخت است. همین ریپو برای ریموت اروپا/کانادا، استارتاپ‌های بین‌المللی، و بعداً اینترنشیپ/تمام‌وقت بعد از ورود به آمریکا مدارک قابل‌اثبات می‌سازد.",
    deliverables: [
      "پایپ‌لاین داده با نسخه و کارت داده",
      "آموزش یا fine-tune با کانفیگ، seed، و لاگ",
      "مجموعه تست آفلاین (دقت، hallucination، latency، هزینه تقریبی)",
      "سرو کردن (API یا batch) + Docker",
      "README با شکل معماری و نتایج منفی هم",
    ],
    plan: [
      "هفته ۱: مسئله کاربر را بنویس. معیار موفقیت عددی باشد نه «چت خوب».",
      "هفته ۲: بیس‌لاین ساده (حتی TF-IDF یا prompt خام) تا بفهمی چقدر جا برای بهبود هست.",
      "هفته ۳–۵: روش اصلی + eval جدا از ست آموزشی.",
      "هفته ۶–۷: سرو کردن، کوانتیزه یا caching اگر لازم است، اندازه‌گیری هزینه.",
      "هفته ۸: مدل‌کارت، محدودیت‌ها، و ویدیوی ۲ دقیقه‌ای دمو.",
    ],
    resumeLine:
      "Built an end-to-end [domain] system with offline eval (metric X), p95 latency Y ms, and reproducible training/serving code.",
    pitfalls: [
      "UI زیبا بدون ارزیابی",
      "وابستگی کامل به یک API بدون لایه خودت",
      "دیتاست آموزشی داخل تست نشت کرده",
      "README فارسی‌only",
    ],
    tags: ["GitHub", "ML Engineer", "eval", "portfolio"],
  },
  {
    id: "eval-harness",
    rankHint: 3,
    titleFa: "هارنس ارزیابی برای RAG یا LLM، نه یک چت‌بات دیگر",
    titleEn: "LLM/RAG evaluation harness",
    category: "llm",
    termFit: "high",
    effortWeeks: "۴–۶ هفته",
    difficulty: 4,
    importance: 9,
    resumeImpact: 9,
    phdImpact: 7,
    industryImpact: 9.5,
    why: "بازار از «ساخت رپر ChatGPT» اشباع است. کسی که retrieval، citation، تست رگرسیون روی سؤال‌های طلایی، و نرخ توهم را اندازه می‌گیرد، کمیاب است. این کار هم برای صنعت طلاست هم اگر پژوهشت NLP باشد، همان eval پایان‌نامه می‌شود.",
    resumeWhy: "جمله‌هایی مثل «built a chatbot with LangChain» فیلتر می‌شوند. جمله‌هایی مثل «reduced unsupported claims from 31% to 12% on a 200-question gold set» استخدام می‌کنند.",
    usWhy: "تیم‌های Applied LLM در آمریکا دقیقاً همین مهارت را می‌خواهند: اندازه‌گیری قبل از شipped کردن. این پروژه تحریم را دور نمی‌زند، اما زبان مشترک مصاحبه را به تو می‌دهد.",
    deliverables: [
      "مجموعه طلایی حداقل ۱۵۰–۳۰۰ سؤال با منبع",
      "متریک‌های چندگانه: retrieval recall، faithfulness، answer quality، latency",
      "مقایسه حداقل سه پیکربندی (chunk، embed، rerank، prompt)",
      "گزارش خطا: چه نوع سؤال‌هایی می‌شکنند",
    ],
    plan: [
      "یک دامنه محدود انتخاب کن (مثلاً مستندات یک کتابخانه یا مقالات یک فیلد).",
      "اول retrieval را جدا از تولید ارزیابی کن.",
      "بعد تولید را با استناد اجباری بسنج.",
      "یک داشبورد ساده از runهای آزمایش نگه دار تا نتایج قابل‌مقایسه بمانند.",
    ],
    resumeLine:
      "Designed a RAG eval harness (N gold questions) and improved grounded answer rate by X points via retrieval and prompt ablations.",
    pitfalls: [
      "فقط LLM-as-judge بدون نمونه انسانی",
      "دیتاست خیلی کوچک یا سؤال‌های ساختگی بی‌معنی",
      "گزارش فقط میانگین بدون برش خطا",
    ],
    tags: ["RAG", "evaluation", "Applied LLM"],
  },
  {
    id: "oss",
    rankHint: 4,
    titleFa: "مشارکت واقعی در یک پروژه متن‌باز شناخته‌شده",
    titleEn: "Non-trivial OSS contribution",
    category: "oss",
    termFit: "high",
    effortWeeks: "۳–۸ هفته پراکنده",
    difficulty: 4,
    importance: 8.5,
    resumeImpact: 8.5,
    phdImpact: 6,
    industryImpact: 9,
    why: "یک PR ادغام‌شده در transformers، vLLM، llama.cpp، datasets، یا حتی یک ابزار eval معروف، از ده پروژه درسی معتبرتر است چون شخص دیگری کد تو را review کرده. برای ترم ۳ ایده‌آل است: عصرها، بدون اینکه پایان‌نامه را بدزدد.",
    resumeWhy: "«Contributed to Hugging Face Transformers (#12345): fixed X / added Y» لینک‌پذیر و قابل‌راستی‌آزمایی است. کمیته و ریکروتر هر دو این را دوست دارند چون تقلب در آن سخت است.",
    usWhy: "OSS مرز جغرافیایی ندارد. از ایران می‌توانی تاریخچه عمومی بسازی که بعداً در ویزا، اینترنشیپ، و معرفی به استاد خارجی به کارت بیاید. good first issueهای تزئینی کافی نیستند؛ یک باگ واقعی یا یک ویژگی کوچک کامل را تمام کن.",
    deliverables: [
      "۲ تا ۵ issue/PR که حداقل یکی merged باشد",
      "توضیح در README شخصی که چه تغییری و چرا مهم بود",
      "ارتباط محترمانه به انگلیسی در discussion",
    ],
    plan: [
      "یک ریپو را دو هفته هر روز بخوان و تست‌هایش را اجرا کن.",
      "از labelهایی مثل bug یا help wanted شروع کن، نه از بازنویسی معماری.",
      "اول issue باز کن، بعد PR. تست اضافه کن.",
      "اگر ریپوی خیلی بزرگ سخت است، کتابخانه mid-size با کاربر واقعی انتخاب کن.",
    ],
    resumeLine:
      "Open-source: merged PR to [project] adding/fixing [concise technical outcome] (link).",
    pitfalls: [
      "فقط اصلاح typo",
      "PRهای نیمه‌کاره بدون تست",
      "ادعا روی رزومه بدون لینک",
    ],
    tags: ["GitHub", "review", "signal"],
  },
  {
    id: "reproduce",
    rankHint: 5,
    titleFa: "بازتولید یک مقاله + ablation و گزارش عمومی",
    titleEn: "Paper reproduction with ablations",
    category: "research",
    termFit: "high",
    effortWeeks: "۵–۸ هفته",
    difficulty: 4,
    importance: 8.5,
    resumeImpact: 8,
    phdImpact: 9,
    industryImpact: 6.5,
    why: "بازتولید صادقانه، سواد پژوهشی را نشان می‌دهد. اگر به عدد مقاله نرسیدی، بگو چرا: seed، داده، هایپرپارامتر. این کار برای SOP و مصاحبه PhD فوق‌العاده است و اگر موضوعش نزدیک پایان‌نامه باشد، Related Work را هم می‌سازد.",
    resumeWhy: "«Reproduced X; matched/missed the reported score by Δ; isolated the cause» خیلی قوی‌تر از «خواندن مقاله» است. در صنعت هم برای نقش Research Engineer معنی دارد.",
    usWhy: "اساتید آمریکایی از دانشجوی ایرانی که می‌تواند کاغذ را به کد و جدول تبدیل کند استقبال می‌کنند. یک گزارش انگلیسی تمیز در GitHub/HF گاهی از نمره درس مهم‌تر است.",
    deliverables: [
      "جدول مقایسه با کاغذ اصلی",
      "لیست تفاوت‌های پیاده‌سازی",
      "حداقل دو ablation خودت",
      "گزارش ۵–۱۰ صفحه‌ای انگلیسی",
    ],
    plan: [
      "مقاله‌ای انتخاب کن که کد رسمی ناقص یا قدیمی باشد، نه چیزی که فقط clone می‌کنی.",
      "اول سعی کن عدد گزارش‌شده را روی همان ستtings بگیری.",
      "بعد یک تغییر معنادار (داده، هدف، یا کارایی) اضافه کن.",
    ],
    resumeLine:
      "Reproduced [paper]; reported Δ vs. claimed results and added ablations on [factor].",
    pitfalls: [
      "کپی کورکورانه کد رسمی بدون فهم",
      "انتخاب مقاله خیلی بزرگ برای یک نفر",
      "پنهان کردن شکست بازتولید",
    ],
    tags: ["reproduction", "PhD", "ablation"],
  },
  {
    id: "tiny-lm",
    rankHint: 6,
    titleFa: "یک مدل زبانی کوچک را از صفر آموزش بده",
    titleEn: "Train a small LM from scratch",
    category: "systems",
    termFit: "medium",
    effortWeeks: "۶–۹ هفته",
    difficulty: 5,
    importance: 8,
    resumeImpact: 8,
    phdImpact: 7.5,
    industryImpact: 8,
    why: "Fine-tune کردن مدل آماده الان عادی شده. دیدن tokenizer، packing، loss، checkpoint، و eval روی یک مدل چندده‌میلیون تا چندصد‌میلیون پارامتری، عمق سیستمی می‌سازد که در مصاحبه «از زیر کاپوت» می‌درخشد. لازم نیست GPT بزرگ بسازی؛ لازم است پایپ‌لاین را درست بفهمی.",
    resumeWhy: "این پروژه تو را از فارغ‌التحصیلانی که فقط API صدا می‌زنند جدا می‌کند. برای نقش‌های LLM Engineer / Pretraining intern سیگنال قوی است.",
    usWhy: "آزمایشگاه‌های دانشگاهی آمریکا برای RA بودن همین کنجکاوی سیستمی را می‌خواهند. محدودیت GPU در ایران را با مدل کوچک، داده عمومی، و Colab/خوشه دانشگاه صادقانه در README بنویس.",
    deliverables: [
      "توکنایزر و دیتای تمیزشده با آمار",
      "اسکریپت آموزش با logging",
      "منحنی loss و perplexity روی holdout",
      "مقایسه با یک مدل هم‌اندازه عمومی",
    ],
    plan: [
      "از معماری شناخته‌شده (مثلاً Llama-like خیلی کوچک) شروع کن.",
      "داده را محدود و تمیز نگه دار؛ کیفیت داده از اندازه مدل مهم‌تر است.",
      "یک eval ساده (multiple choice یا perplexity دامنه) ثابت بگذار.",
    ],
    resumeLine:
      "Pretrained a ~X M parameter transformer on [data]; reported holdout perplexity and data-cleaning ablations.",
    pitfalls: [
      "ادعاهای اغراق‌آمیز درباره «مدل جدید فارسی»",
      "بدون eval و فقط loss نزولی",
      "کد یک‌فایلی غیرقابل‌اجرا",
    ],
    tags: ["pretraining", "systems", "GPU"],
  },
  {
    id: "peft-align",
    rankHint: 7,
    titleFa: "تنظیم و هم‌ترازی: LoRA/QLoRA + DPO/ORPO با آزمایش",
    titleEn: "PEFT + preference alignment",
    category: "llm",
    termFit: "medium",
    effortWeeks: "۳–۵ هفته",
    difficulty: 3,
    importance: 7.5,
    resumeImpact: 7.5,
    phdImpact: 6,
    industryImpact: 8,
    why: "اگر پژوهشت لزوماً alignment نیست، این یک پروژه کوتاه و قابل‌نمایش است. ارزشش در مقایسه SFT در برابر preference tuning و نشان دادن regress روی بعضی متریک‌هاست، نه در «یک مدل فارسی چت‌بات».",
    resumeWhy: "استخدام‌کننده‌های محصول LLM این واژه‌ها را می‌شناسند. اگر اعداد و داده ترجیح را درست توضیح بدهی، مصاحبه applied را جلو می‌بری. به تنهایی جایگزین مقاله یا ریپوی پرچم نمی‌شود.",
    usWhy: "مهارت پرتقاضا است، اما همه همان نوتبوک را دارند. تمایز تو داده، eval، و تحلیل شکست است.",
    deliverables: [
      "داده SFT و ترجیح با مجوز مشخص",
      "جدول SFT در برابر DPO روی چند متریک",
      "نمونه خروجی قبل/بعد و موارد پسرفت",
      "مدل‌کارت روی Hugging Face",
    ],
    plan: [
      "یک دامنه باریک (مثلاً پاسخ کوتاه فنی) نه دستیار همه‌کاره.",
      "اول SFT پایدار، بعد alignment.",
      "همیشه یک holdout انسانی یا حداقل reviewشده نگه دار.",
    ],
    resumeLine:
      "Fine-tuned [base] with LoRA and DPO on [domain]; +X on [metric], with documented regressions.",
    pitfalls: [
      "داده بی‌کیفیت ترجمه‌شده ماشینی",
      "گزارش فقط win-rate مبهم",
      "نقض مجوز مدل یا داده",
    ],
    tags: ["LoRA", "DPO", "Hugging Face"],
  },
  {
    id: "hf-release",
    rankHint: 8,
    titleFa: "انتشار عمومی: مدل‌کارت، دیتاست، و دموی Hugging Face",
    titleEn: "HF dataset/model/Space release",
    category: "data",
    termFit: "high",
    effortWeeks: "۱–۳ هفته روی کار موجود",
    difficulty: 2,
    importance: 8,
    resumeImpact: 8,
    phdImpact: 7,
    industryImpact: 7.5,
    why: "کار خوبِ خصوصی تقریباً در رزومه وجود ندارد. انتشار کنترل‌شده روی Hugging Face باعث می‌شود استاد خارجی، ریکروتر، و نویسنده نامه بتوانند در یک لینک کار را ببینند. این پروژه جدا نیست؛ لایه آخر پایان‌نامه یا ریپوی پرچم است.",
    resumeWhy: "لینک hf.co/… در رزومه اسکن می‌شود. دانلود، Space، و مدل‌کارت نشان می‌دهد کار «واقعی» است. حتی دیتاست کوچک با datasheet بهتر از مدل بزرگ بدون توضیح است.",
    usWhy: "قابل‌مشاهده بودن بین‌المللی یعنی شبکه بدون ویزا. مواظب داده حساس، چهره، پزشکی، و کپی‌رایت باش؛ یک انتشار بی‌احتیاط رزومه را خراب می‌کند.",
    deliverables: [
      "Model card / dataset card کامل به انگلیسی",
      "لایسنس واضح",
      "Space یا اسکریپت inference",
      "نسخه‌بندی و DOI در صورت امکان",
    ],
    plan: [
      "از همان checkpoint پایان‌نامه شروع کن.",
      "محدودیت‌ها و سوگیری را صادقانه بنویس.",
      "یک GIF یا ویدیوی کوتاه از دمو در README بگذار.",
    ],
    resumeLine:
      "Released [model/dataset] on Hugging Face with evaluation card and demo (N downloads / Space).",
    pitfalls: [
      "آپلود وزن بدون کارت و eval",
      "داده بدون رضایت یا مجوز",
      "اسم پرزرق‌وبرق برای کار ضعیف",
    ],
    tags: ["Hugging Face", "visibility", "artifact"],
  },
  {
    id: "agents",
    rankHint: 9,
    titleFa: "عامل ابزاردار با محیط تست، نه دموی agent هیجانی",
    titleEn: "Tool-using agent with a test suite",
    category: "llm",
    termFit: "medium",
    effortWeeks: "۴–۶ هفته",
    difficulty: 4,
    importance: 7.5,
    resumeImpact: 7.5,
    phdImpact: 5.5,
    industryImpact: 8.5,
    why: "عوامل در رزومه‌ها زیاد شده‌اند و بیشترشان ضبط صفحه از یک loop شکننده است. اگر ابزار، sandbox، و مجموعه کار مشخص (مثلاً GitHub issues مصنوعی یا SQL) با نرخ موفقیت داشته باشی، از موج جدا می‌شوی.",
    resumeWhy: "برای نقش Applied scientist / AI engineer محصول‌محور مفید است. برای PhD فقط اگر پژوهش agent باشد ارزش پژوهشی دارد.",
    usWhy: "مهارت مصاحبه‌ای خوب برای استارتاپ‌هاست. به تنهایی مسیر ویزا را باز نمی‌کند.",
    deliverables: [
      "مجموعه حداقل ۵۰ تسک قابل‌امتیازدهی",
      "ابزار محدود با اجازه مشخص",
      "لاگ trace برای شکست‌ها",
      "مقایسه با baseline بدون ابزار و با ReAct ساده",
    ],
    plan: [
      "دامنه را یکی کن: کد، بازیابی، یا جدول.",
      "اول ابزارها را واحدی تست کن، بعد حلقه عامل.",
      "هزینه توکن را گزارش کن؛ سیستم گرانِ شکننده امتیاز نیست.",
    ],
    resumeLine:
      "Implemented a tool-using agent that solved X/N tasks on [benchmark], with traces and cost per success.",
    pitfalls: [
      "وابستگی به یک فریمورک بدون فهم",
      "بدون تسک مشخص",
      "امنیت: اجرای آزاد کد روی ماشین واقعی",
    ],
    tags: ["agents", "tools", "evals"],
  },
  {
    id: "serving",
    rankHint: 10,
    titleFa: "سرو کردن مدل: کوانتیزه، بچینگ، بنچمارک تأخیر",
    titleEn: "Inference serving & optimization",
    category: "systems",
    termFit: "medium",
    effortWeeks: "۳–۵ هفته",
    difficulty: 4,
    importance: 7.5,
    resumeImpact: 8,
    phdImpact: 5,
    industryImpact: 9,
    why: "نقش ML Engineer در آمریکا اغلب به inference نزدیک‌تر است تا به مقاله. اندازه‌گیری tokens/s، p95 latency، تأثیر quantization روی کیفیت، و یک سرور ساده با vLLM یا معادل، مهارت کمیابی بین دانشجویان است.",
    resumeWhy: "اگر هدفت صنعت است، این کارت را در رزومه پر می‌کند. اگر هدفت PhD نظری است، اولویت پایین‌تری دارد مگر آزمایشگاه سیستم باشد.",
    usWhy: "شرکت‌ها برای این نقش حاضرند از مسیر کانادا/اروپا هم نیرو بگیرند. اعداد بنچمارک روی سخت‌افزار مشخص بنویس تا قابل‌مقایسه باشد.",
    deliverables: [
      "جدول کیفیت در برابر FP16 / INT8 / وزن‌های کوچکتر",
      "اسکریپت بنچمارک تکرارپذیر",
      "یادداشت محدودیت سخت‌افزار",
    ],
    plan: [
      "یک مدل متوسط عمومی انتخاب کن که روی GPU در دسترس‌ات جا شود.",
      "کیفیت را روی همان eval قبلی‌ات بسنج تا داستان یکپارچه بماند.",
    ],
    resumeLine:
      "Benchmarked quantized inference of [model]: Xp95 latency at Y tok/s with <Z drop on [eval].",
    pitfalls: [
      "اعداد بدون ذکر GPU",
      "کوانتیزه بدون اندازه‌گیری کیفیت",
    ],
    tags: ["vLLM", "quantization", "MLInfra"],
  },
  {
    id: "dataset",
    rankHint: 11,
    titleFa: "ساخت و انتشار یک دیتاست تمیز با datasheet",
    titleEn: "Curated dataset release",
    category: "data",
    termFit: "medium",
    effortWeeks: "۴–۸ هفته",
    difficulty: 3,
    importance: 8,
    resumeImpact: 8,
    phdImpact: 8.5,
    industryImpact: 7,
    why: "خیلی از کارهای NLP فارسی یا دامنه‌های کم‌منبع هنوز داده خوب ندارند. یک دیتاست با مجوز، توافق حاشیه‌زن، آمار سوگیری، و اسپلیت استاندارد می‌تواند استناد بگیرد و از یک مدل متوسط ماندگارتر باشد.",
    resumeWhy: "دیتاست نقل‌قول‌پذیر است. اگر دیگران روی آن کار کنند، رزومه‌ات بدون اینکه هر سال پروژه جدید بسازی رشد می‌کند.",
    usWhy: "برای PhD و همکاری بین‌المللی عالی است. برای صنعت اگر دامنه (پزشکی، حقوق، گفتار) مشخص باشد جذاب است. اخلاق و حریم خصوصی را جدی بگیر.",
    deliverables: [
      "datasheet کامل",
      "راهنمای حاشیه‌زنی و kappa/agreement",
      "اسپلیت رسمی و baseline",
      "انتشار HF + مقاله کوتاه یا گزارش فنی",
    ],
    plan: [
      "اول نیاز را ثابت کن: چه شکافی در دیتاست‌های موجود است؟",
      "حجم را فدای کیفیت نکن. ۲۰۰۰ نمونه تمیز بهتر از ۲۰۰هزار نویزی است.",
    ],
    resumeLine:
      "Created and released [dataset] (N examples) with annotation protocol, agreement stats, and baseline.",
    pitfalls: [
      "اسکرپ بدون مجوز",
      "لیبل ضعیف",
      "نشت اسپلیت",
    ],
    tags: ["dataset", "NLP", "citation"],
  },
  {
    id: "kaggle",
    rankHint: 12,
    titleFa: "مسابقه فقط اگر مدال یا رتبه واقعاً قابل‌اشاره باشد",
    titleEn: "Competition medal (conditional)",
    category: "competition",
    termFit: "later",
    effortWeeks: "۴–۱۲ هفته",
    difficulty: 4,
    importance: 6,
    resumeImpact: 6.5,
    phdImpact: 4,
    industryImpact: 7,
    why: "Kaggle و مسابقات مشابه برای یادگیری stack کلاسیک عالی‌اند، اما یک رتبه وسط جدول تقریباً هیچ‌کس را در آمریکا تحت‌تأثیر نمی‌گذارد. اگر مسیرت tabular/CV کلاسیک است و می‌توانی مدال بگیری، انجام بده؛ وگرنه وقت پایان‌نامه را حرام نکن.",
    resumeWhy: "Silver/Gold سیگنال است. «Participated in» سیگنال نیست. حتی با مدال، باید بنویسی چه تکنیک غیربدیهی استفاده کردی.",
    usWhy: "برای PhD تقریباً بی‌ربط است. برای صنعت data science کمی کمک می‌کند، کمتر از یک سیستم end-to-end.",
    deliverables: [
      "مدال یا رتبه درصدی قوی",
      "writeup تکنیک",
      "کد تمیز",
    ],
    plan: [
      "فقط اگر حداقل ۸ ساعت در هفته خالی داری و پایان‌نامه روی ریل است.",
      "یک مسابقه تمام کن، ده تا را شروع نکن.",
    ],
    resumeLine:
      "Kaggle [competition]: [medal], using [distinct method]; writeup: [link].",
    pitfalls: [
      "گذاشتن ده‌ها مسابقه ناتمام در رزومه",
      "leakage و شلوغ‌کاری بدون فهم",
    ],
    tags: ["Kaggle", "optional"],
  },
  {
    id: "blog-talk",
    rankHint: 13,
    titleFa: "نوشتن فنی انگلیسی و ارائه: تقویت‌کننده، نه اصل کار",
    titleEn: "English technical writing & talks",
    category: "writing",
    termFit: "high",
    effortWeeks: "پیوسته، هفته‌ای ۳–۴ ساعت",
    difficulty: 2,
    importance: 7,
    resumeImpact: 6.5,
    phdImpact: 7,
    industryImpact: 6,
    why: "مقاله و کد بدون توانایی توضیح به انگلیسی در آمریکا زمین می‌خورند. دو پست عمیق درباره همان پروژه پرچم، یا یک ارائه گروه پژوهشی، SOP و مصاحبه را جلو می‌برد. وبلاگ عمومی پر از خلاصه کاغذ دیگران ارزش کمی دارد.",
    resumeWhy: "مستقیم امتیاز رزومه نیست مگر در نقش educator. غیرمستقیم نامه توصیه، SOP، و LinkedIn را قوی می‌کند.",
    usWhy: "TOEFL نمره است؛ نوشتن فنی مهارت است. برای ویزای دانشجویی و کلاس PhD هر دو لازم‌اند.",
    deliverables: [
      "۲ مقاله انگلیسی درباره کار خودت",
      "اسلاید ارائه ۱۵ دقیقه‌ای",
      "READMEهای انگلیسی برای همه ریپوها",
    ],
    plan: [
      "هر پروژه که تمام می‌شود همان هفته نوشته شود، نه ماه‌ها بعد.",
      "از بازنویسی با مدل زبانی استفاده کن اما ادعا و عدد را خودت چک کن.",
    ],
    resumeLine:
      "Technical writing: [post titles] explaining [your system/paper] (links).",
    pitfalls: [
      "محتوای ترجمه‌شده سطحی",
      "زمان زیاد روی شبکه‌های اجتماعی به‌جای کار اصلی",
    ],
    tags: ["English", "SOP", "communication"],
  },
  {
    id: "safety-eval",
    rankHint: 14,
    titleFa: "ارزیابی ایمنی و سوگیری روی یک دامنه مشخص",
    titleEn: "Safety / bias eval in one domain",
    category: "research",
    termFit: "later",
    effortWeeks: "۴–۶ هفته",
    difficulty: 4,
    importance: 7,
    resumeImpact: 7,
    phdImpact: 7.5,
    industryImpact: 7,
    why: "اگر به alignment، سیاست مدل، یا NLP اجتماعی نزدیک هستی، یک eval ایمنی با تاکسونومی مشخص از یک «پروژه اخلاق کلی» خیلی بهتر است. برای بقیه، اولویت پایین‌تر از مقاله و سیستم است.",
    resumeWhy: "آزمایشگاه‌های safety و بعضی تیم‌های صنعت این را می‌خوانند. باید روشمند باشد نه شعاری.",
    usWhy: "فیلد در آمریکا بودجه دارد، اما رقابت هم بالاست. کار کوچک دقیق بهتر از بیانیه بزرگ است.",
    deliverables: [
      "تاکسونومی ریسک",
      "مجموعه تست",
      "نتایج روی چند مدل",
      "پیشنهاد کاهش آسیب محدود",
    ],
    plan: [
      "یک دامنه: مثلاً مشاوره پزشکی غلط، یا stereotype در زبان فارسی.",
      "با پژوهشگر حوزه اخلاق/حقوق اگر می‌توانی مشورت کن.",
    ],
    resumeLine:
      "Built a domain-specific safety eval (N items) and compared refusal/hallucination rates across K models.",
    pitfalls: [
      "ادعاهای سیاسی بدون روش",
      "داده توهین‌آمیز بدون پروتکل",
    ],
    tags: ["safety", "evals", "optional"],
  },
  {
    id: "cv-multimodal",
    rankHint: 15,
    titleFa: "فقط اگر پژوهشت این است: یک پایپ‌لاین بینایی یا چندوجهی کامل",
    titleEn: "Vision / multimodal pipeline (if aligned)",
    category: "systems",
    termFit: "medium",
    effortWeeks: "۶–۱۰ هفته",
    difficulty: 4,
    importance: 8,
    resumeImpact: 8,
    phdImpact: 8,
    industryImpact: 8,
    why: "پرت کردن ذهن از NLP به CV «برای رزومه متنوع» معمولاً رزومه را ضعیف‌تر می‌کند. اگر پایان‌نامه‌ات detection، medical imaging، یا VL است، همان را با دیتاست، متریک استاندارد (mAP، Dice، VQA acc) و تحلیل خطا عمیق کن. تنوع جعلی نساز.",
    resumeWhy: "استخدام CV هنوز قوی است اگر متریک استاندارد و دامنه (پزشکی، صنعتی، اسناد) مشخص باشد.",
    usWhy: "برای PhD باید با استاد هم‌راستا باشد. یک پروژه بینایی جدا از داستان پژوهشی، SOP را شلوغ می‌کند.",
    deliverables: [
      "بیس‌لاین استاندارد فیلد",
      "تحلیل خطا بر اساس نوع شکست",
      "کد و وزن قابل‌اجرا",
    ],
    plan: [
      "از دیتاست معروف فیلد شروع کن، بعد داده محلی اگر مجوز دارد.",
      "به آموزش از صفر مدل عظیم فکر نکن؛ transfer + eval قوی کافی است.",
    ],
    resumeLine:
      "Developed a [CV/VL] pipeline on [dataset] reaching X [metric], with error analysis by failure mode.",
    pitfalls: [
      "YOLO روی دیتاست تصادفی بدون داستان",
      "داده پزشکی بدون اخلاق",
    ],
    tags: ["CV", "multimodal", "if-aligned"],
  },
];

export const antiProjects = [
  {
    title: "چت‌بات عمومی با API و UI زیبا",
    reason:
      "همه دارند. بدون eval، داده، و تمایز دامنه، حتی ضرر هم دارد چون سطح انتظارت را پایین نشان می‌دهد.",
  },
  {
    title: "MNIST / Titanic / House Prices به‌عنوان پروژه اصلی",
    reason: "برای درس خوب است، برای رزومه ارشد AI در مسیر آمریکا تمام‌شده محسوب می‌شود.",
  },
  {
    title: "ده ریپوی نیمه‌کاره",
    reason: "ریکروتر یک ریپوی کامل را به دوازده پوشه خالی ترجیح می‌دهد.",
  },
  {
    title: "کپی مقاله با تغییر دو هایپرپارامتر و ادعای SOTA",
    reason: "در مصاحبه لو می‌رود و برای نامه توصیه خطرناک است.",
  },
  {
    title: "دوره‌های گواهینامه‌ای به‌جای کار قابل‌مشاهده",
    reason: "Coursera و مشابه در رزومه PhD/استخدام جدی آمریکا وزن نزدیک صفر دارند.",
  },
  {
    title: "پروژه جدا در هر ترند (agent، diffusion، RAG، multimodal) بدون عمق",
    reason: "کمیته‌ها داستان منسجم می‌خواهند نه فروشگاه ترند.",
  },
];

export const stackAdvice = {
  both: [
    "پایان‌نامه → مقاله (غیرقابل‌مذاکره)",
    "همان کار را به‌صورت ریپوی عمومی با eval و README انگلیسی دربیاور",
    "انتشار Hugging Face + دو صفحه نوشته انگلیسی",
    "۱–۲ مشارکت متن‌باز در حاشیه، نه به‌جای پایان‌نامه",
  ],
  phd: [
    "مقاله و داستان پژوهشی منسجم",
    "بازتولید یا دیتاست اگر به موضوع می‌چسبد",
    "نامه توصیه از استادی که جزئیات آزمایش را می‌داند",
    "نوشتن SOP با عدد و شکست‌های واقعی",
  ],
  industry: [
    "یک سیستم end-to-end با متریک",
    "inferencing یا RAG eval اگر به LLM می‌روی",
    "OSS merged",
    "پورتفولیو انگلیسی؛ مسابقه فقط با مدال",
  ],
};
