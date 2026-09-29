import { GoogleGenAI, Type } from "@google/genai";
import { AudioChunk } from "../utils/audioProcessing";
import { GLUED_PLATE_WORDS, CANONICAL_SURVEY_NOTES, normalizeSurveyNote, CANONICAL_VEHICLE_TYPES, normalizeVehicleType, reconcilePlateWithTranscript, reconcileVehicleTypeWithTranscript } from "../utils/arabicNormalizer";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface LicensePlateEntry {
  type: string;
  plate: string;
  notes: string;
}

export interface ProcessedResult {
  source: string;
  id: string;
  transcript?: string;
  entries: LicensePlateEntry[];
  error?: string;
  customNote?: string;
}

// Allowed Saudi plate Arabic letters whitelist (17 official letters)
// (د, ح, ه, ع, ق, ص, ط, ك, م, ن, ا, ل, ب, ي, س, ر, و)
export function sanitizeSaudiPlate(rawPlate: string): string {
  if (!rawPlate) return "";

  let cleaned = rawPlate.trim();

  // 0. Handle known glued plate words if plate starts with them
  for (const [word, letters] of Object.entries(GLUED_PLATE_WORDS)) {
    if (cleaned.startsWith(word)) {
      cleaned = letters.join('') + cleaned.slice(word.length);
      break;
    }
  }

  // 1. Phonetic substitutions specifically for the plate column
  // ت / ة -> ط
  cleaned = cleaned.replace(/[تة]/g, 'ط');
  // ض / ظ -> ط
  cleaned = cleaned.replace(/[ضظ]/g, 'ط');
  // ث -> س
  cleaned = cleaned.replace(/ث/g, 'س');
  // ذ -> د
  cleaned = cleaned.replace(/ذ/g, 'د');
  // ز -> ر
  cleaned = cleaned.replace(/ز/g, 'ر');
  // Normalize alef
  cleaned = cleaned.replace(/[إأآٱ]/g, 'ا');
  // Normalize yaa
  cleaned = cleaned.replace(/[ىئ]/g, 'ي');
  // Normalize waw
  cleaned = cleaned.replace(/ؤ/g, 'و');

  // Convert Arabic/Eastern digits to standard digits
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  arabicDigits.forEach((d, i) => {
    cleaned = cleaned.replace(new RegExp(d, 'g'), i.toString());
  });

  // Remove spaces, dashes, dots
  cleaned = cleaned.replace(/[\s\-_.,/\\|]/g, '');

  // Keep only allowed Arabic letters and digits
  // Allowed letters: د ح ه ع ق ص ط ك م ن ا ل ب ي س ر و
  cleaned = cleaned.replace(/[^دحهعقصطكمنالبيسرو0-9]/g, '');

  return cleaned;
}

export async function extractLicensePlates(
  audioInput: AudioChunk | string,
  fileName: string,
  fallbackMimeType: string = "audio/wav"
): Promise<ProcessedResult> {
  const base64Audio = typeof audioInput === "string" ? audioInput : audioInput.data;
  const mimeType = typeof audioInput === "string" ? fallbackMimeType : audioInput.mimeType;

  const MAX_RETRIES = 3;
  let attempt = 0;

  const SYSTEM_PROMPT = `أنت خبير تدقيق وتحليل تسجيلات لوحات السيارات والمركبات في المملكة العربية السعودية.
مهمتك الأساسية: تحليل النص المستخرج من التسجيل الصوتي واستخراج جميع لوحات السيارات المذكورة وأي تفاصيل مرتبطة بها بدقة فائقة وبأعلى سرعة ممكنة، مع الالتزام بضوابط الملاحظات أدناه.

قواعد الملاحظات (Notes Extraction) - فهم طبيعة وصيغة الملاحظات:
1. **طبيعة وصيغة الملاحظات الميدانية (أمثلة إرشادية للصيغة وترتيب الجمل وليست حصراً)**:
   - خانة الملاحظات مخصصة لتوثيق معالم الطريق، المواقع، الشوارع، والمتاجر والجهات التي يسير فيها الحصر الميداني.
   - نماذج وأمثلة توضح صيغة هذه الملاحظات وكيف تُكتب وتترتب جملها:
     * جهات الممرات ومداخل الشوارع: (اول برحه يسار، اول برحه يمين، اول دخله يمين، اول جراش يسار، تالت جراش يمين، ثاني جراش يمين، رابع جراش يمين، شارع ببرحه، بعد اول دخله يمين، بعد دخله يمين).
     * استكمال المسار والتقاطعات: (مكمل بعد اول دخله يسار، مكمل بعد اول دخله يمين، مكمل بعد تاني دخله يسار، مكمل بعد تاني دخله يمين، مكمل بعد اخر دخله يسار، مكمل بعد اول تقاطع، مكمل بعد تقاطع السدين).
     * أسماء الشوارع والجهات: (شارع سدين الجنب الأول، شارع سدين الجنب التاني، مكمل بعد سور تله شارع سدين الجنب التاني، مكمل بعد دخله يسار سدين).
     * أمام المعالم والمتاجر والمنشآت: (امام مصرف الراجحي، امام السباكه والكهرباء، امام خياط غزاله للعبايات، امام سلطان سطور للعبايات، امام ضواحي الصمان، امام لمسه يارا للخياطه، امام مؤسسه رقي الألوان التجاريه، امام مخبز امنيه، خياط لمسه ندين، محل مركن الهدي، مكتب أسماء فهد، يبدا من مراتب طبيه وسرر، تموينات صقر، مدرسة منارات جدة، الزافر للمياه، تموينات الأمين).
   - **تنبيه هام جداً**: هذه القائمة هي **أمثلة توضيحية لأسلوب وصيغة الجمل** وليست حصراً أو حكراً على هذه الأسماء فقط!
   - إذا ذكر المتحدث أي معلم ميداني، موقع، اسم شارع، اسم متجر/مسجد/صيدلية/مدرسة/مستشفى، أو اتجاه (برحة/جراج/دخلة/تقاطع/مكمل بعد...) يتبع نفس هذه الصيغة والأسلوب، **اكتبه ووثقه بدقة في خانة notes**.

2. **ما يُمنع حصراً كتابته في خانة الملاحظات (notes)**:
   - ممنوع منعاً باتاً كتابة أوصاف لحالة السيارة أو أعطالها مثل: ("مركون"، "مصدوم"، "عطلان"، "خربان"، "واقف"، "لوحة طايحة"، "سليم").
   - ممنوع كتابة كلام المحادثات العابر والتحيات أو كلمات الدردشة غير المفهومة.
   - ممنوع كتابة أرقام وحروف اللوحة داخل الملاحظات.
   - إذا لم يذكر المتحدث أي موقع أو علامة ميدانية تخص السيارة، اترك خانة notes فارغة تماماً "".

3. **قواعد الارتباط والتسلسل الهامة جداً (Association & Sequence Rules)**:
   - أي نوع سيارة أو ملاحظة تُذكر قبل أو بعد اللوحة مباشرة تخص **تلك اللوحة ذاتها**، ولا يجوز نهائياً نقلها أو نسبها للسيارة التالية!
   - مثال توضيحي:
     إذا قال المتحدث: "حكا تسعة صفر خمسة ثلاثة دينا اول برحه يمين صعد واحد اتنين تلاته اربعه وانيت امام مصرف الراجحي"
     -> السطر الأول: اللوحة = "حكا9053" ، النوع = "دينا" ، الملاحظات = "اول برحه يمين"
     -> السطر الثاني: اللوحة = "صعد1234" ، النوع = "وانيت" ، الملاحظات = "امام مصرف الراجحي"

4. قواعد تفسير ونطق حروف اللوحة الرسمية السعودية (17 حرفاً فقط):
   - الحروف المسموح بها 17 فقط: (ا، ب، ح، د، ر، س، ص، ط، ع، ق، ك، ل، م، ن، ه، و، ي).
   - تحويل النطق والكلمات المسموعة إلى الحرف الرسمي:
     * (الف، ألف، الاف، الألف، الالف، أليف، اليف، alef) -> ا
     * (باء، الباء، باءه، الباءه، باءة، با، البا، باه، به، البه، ba) -> ب
     * (حاء، الحاء، حاءه، حا، الحا، حاه، حه، الحه، حء) -> ح
     * (دال، الدال، دا، الدا، ودر، dal) -> د
     * (راء، الراء، را، الرا، راه، ره، الره، ra) -> ر
     * (سين، السين، سا، السا، سينن، seen) -> س
     * (صاد، الصاد، صا، الصا، صاض، saad) -> ص
     * (طاء، الطاء، طا، الطا، طاه، طه، الطه، تاء، التاء، تا، التا، ته، الته، ت، ة، ض، ظ، ta) -> ط
     * (عين، العين، عا، العا، عينن، ain) -> ع
     * (قاف، القاف، قافة، القافة، قيف، القف، قف، قا، القا، جاف، الجاف، gaf) -> ق
     * (كاف، الكاف، كافه، كافة، كا، الكا، كف، الكف، كيف، الكيف، kaf) -> ك
     * (لام، اللام، لا، اللا، lam) -> ل
     * (ميم، الميم، ما، الما، مييم، meem) -> م
     * (نون، النون، نا، النا، نوون، noon) -> ن
     * (هاء، الهاء، ها، الها، هـ، الهـ، هيه، الهيه، هه، اه، هي، heh) -> ه
     * (واو، الواو، واوو، وو، وه، الو، waw) -> و
     * (ياء، الياء، يا، اليا، ياه، يه، اليه، ييه، اي، الاي، أي، yaa) -> ي
     * تصحيح النطق الصوتي: (ث -> س)، (ذ -> د)، (ز -> ر).
   - الترتيب الصارم لحروف اللوحة وتكرارها وموضعها (Letter Ordering & Repetition):
     * يجب الالتزام التام بترتيب الحروف كما نطقها المتحدث بالضبط دون أي تقديم أو تأخير أو تبديل للحروف:
       - إذا قيل: (س ص ص) أو (سين صاد صاد) أو (سين صادتين) -> تُكتب اللوحة: سصص (تحذير قطعي: ممنوع نهائياً كتابتها سسص!).
       - إذا قيل: (س س ص) أو (سين سين صاد) -> تُكتب: سسص.
       - إذا قيل: (ص س س) أو (صاد سين سين) -> تُكتب: صسس.
       - إذا قيل: (ص ص س) أو (صاد صاد سين) -> تُكتب: صصس.
     * التمييز الصوتي الصارم بين السين (س) والصاد (ص) وموضع كل منهما الأول والثاني والثالث.
   - الكلمات المدمجة التي تمثل 3 حروف لوحة شائعة:
     * (ريعسين -> رعس) | (رعس -> رعس) | (حرب -> حرب) | (بسم -> بسم) | (دسن -> دسن)
     * (صقر -> صقر) | (بدر -> بدر) | (سعد -> سعد) | (عمر -> عمر) | (نور -> نور)
     * (حمد -> حمد) | (رعد -> رعد) | (سند -> سند) | (هند -> هند) | (وعد -> وعد)
     * (ورد -> ورد) | (عهد -> عهد) | (ملك -> ملك) | (كرم -> كرم) | (قمر -> قمر) | (علم -> علم)

4. القواعد الذهبية لتفسير ودمج أرقام اللوحة (الفرق الحاسم بين وجود "الواو" وغيابها):
   - تُقرأ وتُكتب أرقام اللوحة من اليسار إلى اليمين بالترتيب. لا تقم أبداً بجمع قيمتين رياضياً إلا إذا كان بينهما حرف "واو".
   
   أ) الأرقام المربوطة بحرف "واو" (تُدمج كخانة واحدة في العشرات):
      - "اتنين وخمسين" -> 52.
      - "سبعة وعشرين" -> 27.
      - "خمسة وثلاثين" -> 35.
      - "تسعة وتسعين" -> 99.

   ب) الأرقام المتتالية بدون "واو" (تُرص الأرقام بجوار بعضها مباشرة كخانات متسلسلة):
      - "اتنين خمسين" -> نكتب 2 ثم 50 -> النتيجة: 250.
      - "اتنين سبعين" -> نكتب 2 ثم 70 -> النتيجة: 270.
      - "ستة ثلاثين" -> نكتب 6 ثم 30 -> النتيجة: 630.
      - "اربعين سبعتين" -> نكتب 40 ثم 77 -> النتيجة: 4077.
      - "سته تمانيه عشرين" -> نكتب 6 ثم 8 ثم 20 -> النتيجة: 6820.
      
   ج) أمثلة متقدمة لتكوين اللوحات كاملة (حروف وأرقام مدمجة بدون مسافات):
      - "حبو سبعة وعشرين زيرو تلاتة" -> (حبو) + (27) + (0) + (3) -> حبو2703.
      - "حبو اتنين سبعين تلاتة" -> (حبو) + (2) + (70) + (3) -> حبو2703.
      - "حرب سبعة واحد اثنين خمسة" -> (حرب) + (7) + (1) + (2) + (5) -> حرب7125.
      - "حرب سبعة واحد خمسة وعشرين" -> (حرب) + (7) + (1) + (25) -> حرب7125.
      - "واحد تلت اربعات" -> (1) + (444) -> 1444.
      - "حه كاف الف اربعين سبعتين" -> حكا4077.

   د) تفسير الكلمات الخاصة بالأرقام:
      - الصفر: (صفر، زيرو، صقر) -> 0.
      - العشرات (ين / ون): (عشرين->20، ثلاثين/تلاتين->30، أربعين/اربعين->40، خمسين->50، ستين->60، سبعين->70، ثمانين/تمانين/تمنين->80، تسعين/تسعون->90).
      - المزدوجات (تين): تكرار الرقم مرتين (صفرتين->00، وحدتين->11، خمستين->55، سبعتين->77، ستتين->66، اربعتين->44، ثمنتين->88، تسعتين->99). 
        * تنبيه هام جداً: كلمة "اتنين" أو "اثنين" أو "اثنتين" تعني الرقم 2 فقط ولا تكرر!
      - تكرار الأرقام بالجمع (العدد + الجمع): (تلت اربعات -> 444)، (اربع تسعات -> 9999)، (اتنين سبعات -> 77)، (تلت خمسات -> 555)، (ثلاث اربعات -> 444).
      - أرقام (11-19): (احدعشر/احداشر -> 11، اثنا عشر/اتناشر -> 12، تلتاشر -> 13، اربعتاشر -> 14، خمستاشر -> 15، ستاشر -> 16، سبعتاشر -> 17، ثمنتاشر/تمنتاشر -> 18، تسعتاشر -> 19).

   هـ) القاعدة الذهبية للوحات الرباعية بنمط (رقم مفرد + عشرات + رقم مفرد) مثل: تسعة تمنين أربعة = 9804:
      - في قراءة لوحات السيارات، عندما ينطق المتحدث: [رقم مفرد] ثم [لفظ عشرات: تمنين/تمانين/ثمانين/سبعين/ستين/خمسين/اربعين/تلاتين/عشرين] ثم [رقم مفرد]:
        * الرقم الأول يمثل خانة الآلاف (مثال: "تسعة" = 9).
        * لفظ العشرات يمثل خانة المئات والعشرات مع الصفر (مثال: "تمنين" أو "ثمانين" = 80).
        * الرقم الأخير يمثل خانة الآحاد (مثال: "أربعة" = 4).
        -> النتيجة لأرقام اللوحة الرباعية: 9804 (تسعة + تمنين + أربعة = 9804).
        * تحذير قطعي وصارم: ممنوع منعاً باتاً كتابتها "9894"! كلمة "تمنين" أو "ثمانين" تعني 80 فقط، وليست 89 وليست تسعين، ورقم 9 لا يتكرر إطلاقاً!
        * أمثلة متطابقة يجب الالتزام بها تماماً:
          - (س ص ص تسعة تمنين اربعة) -> اللوحة: سصص9804 (وليس سسص9894!).
          - "سبعة خمسين اتنين" -> (7) + (50) + (2) -> 7502.
          - "ستة ثلاثين واحد" -> (6) + (30) + (1) -> 6301.
          - "خمسة ستين تمانية" -> (5) + (60) + (8) -> 5608.
          - "اربعة سبعين خمسة" -> (4) + (70) + (5) -> 4705.
          - "واحد عشرين تلاتة" -> (1) + (20) + (3) -> 1203.
          - "تمانية تسعين ستة" -> (8) + (90) + (6) -> 8906.
          - "تلاتة تمانين سبعة" -> (3) + (80) + (7) -> 3807.
          - "اتنين تمنين تمانية" -> (2) + (80) + (8) -> 2808.

5. تنبيه هام جداً:
   - قواعد تصحيح الحروف أعلاه تطبق فقط على عمود اللوحة (plate).
   - عمود نوع السيارة (type) وعمود الملاحظات (notes) يظلان كما هما تماماً بالكلمات العربية الطبيعية دون أي تحويل للحروف.

6. قواعد أنواع السيارات وحالات المركبات (129 نوع وحالة معتمدة):
   - يجب استخراج وكتابة نوع السيارة بدقة بنفس الإملاء والصيغة المعتمدة أدناه:
     * سيارات الركاب والسيدان:
       (كامري، كورولا [تُكتب كورولا حتى لو قيلت كورلا]، سوناتا، اكورد [اكورد كوبيه]، اكسنت، ال اكس، اوبتيما، النترا، سيناتا [سينترا]، يارس [تُكتب يارس حتى لو قيلت ياريس]، ريو سيدان، تورس [تورس سيدان]، سيد، فوكتريا، سيراتيو، سيلتوس، فوكس، فيوجن، بيجاس [Beancan]، جراند I10، ازيرا، ال سيفن، شانجان ال سيفن فل، كابريس، امبالا، شارجر، شالنجر، كادنزا [تُكتب كادنزا حتى لو قيلت كادينزا]).
     * الجيوب والدفع الرباعي والعائلي:
       (باجيرو، اكسبلورر، تاهو، سانتافي جيب، جيب، جيب فورتشنر [فورتشنر]، جيب مصندق، جيب بكب، مصندق، سورينتو، توسان، باث فايندر، يوكون، سكويا، باترول 4 باب [باترول واجن]، Everest، انوفا فاغن).
     * النقل والبيك آب والخفيف:
       (وانيت [تُكتب وانيت حتى لو قيلت ونيت]، هايلكس [هيلوكس]، جران ماكس [سوزوكي جران ماكس]، ديلوكس طويل، بكب غمارتين، بكب غماره [بكب]، نقل، نقل بضائع).
     * النقل الجماعي والباصات:
       (كوستر، اتوبيس، باص، حافله، ميكروباص، اتش1).
     * الشاحنات والمعدات:
       (دينا، بضائع، فان بضاعه، سطحه، وايت ميه).
     * الأجرة والخدمات:
       (تاكسي، أجرة، اسعاف).
     * الدراجات:
       (دباب، دباب مغبر).
     * مركبات وحالات خاصة (تُكتب في خانة النوع type):
       (مركون، مركونه، لوحه صفرا [لوحه صفرا ت، لوحه صفرا دي كبيره]، حادث، متحرك، مغبره [مغبرة]، مترب [متربه، متربة]، متربه بدون لوحة خلفيه).
   - تنبيه فائق الأهمية وحاسم بخصوص (نقل) و (بضائع) و (نقل بضائع):
     * إذا قال المتحدث "نقل" (أو نوعها نقل، سيارة نقل، لوحة نقل) -> اكتب في خانة type: "نقل" فقط. تحذير قطعي وصارم: ممنوع منعاً باتاً كتابة "بضائع" بدلاً من "نقل"!
     * إذا قال المتحدث "بضائع" فقط -> اكتب في خانة type: "بضائع" فقط.
     * إذا قال المتحدث "نقل بضائع" -> اكتب في خانة type: "نقل بضائع" فقط.
     * الالتزام الصارم بما قاله المتحدث في التسجيل دون أي اجتهاد أو استبدال لكلمة بأخرى.
     * الأوصاف مثل "مركون"، "مركونه"، "لوحه صفرا"، "مترب"، "مغبره"، "حادث"، "سطحه" تعتبر في هذا التطبيق تصنيفات للمركبة وتُكتب في عمود **type** وليس في عمود notes!
     * إذا لم يذكر أي نوع أو تصنيف، اترك خانة type فارغة "".

إذا لم يحتوي النص على أي لوحة سيارات، أرجع مصفوفة entries فارغة.`;

  const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      transcript: {
        type: Type.STRING,
        description: "التفريغ الصوتي لما تم نطقه في التسجيل باللغة العربية"
      },
      entries: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: "نوع المركبة أو اللوحة التابع لهذه اللوحة تحديداً (مثل نقل، دينا، ونيت، تاكسي، إلخ) أو فارغ"
            },
            plate: {
              type: Type.STRING,
              description: "رقم اللوحة متصل بدون فواصل مثل حكا9053"
            },
            notes: {
              type: Type.STRING,
              description: "كافة الملاحظات والأوصاف والمكان وحالة السيارة أو أي تفاصيل ذكرها المتحدث تخص هذه اللوحة (مثل: برحه يمين، مركون، مصدوم، تنده، عطلان، إلخ) أو فارغ فقط إذا لم يُذكر أي تفصيل إضافي"
            }
          },
          required: ["type", "plate", "notes"]
        }
      }
    },
    required: ["entries"]
  };

  while (attempt < MAX_RETRIES) {
    try {
      let transcriptionText = "";
      
      // =========================================================================
      // الجزء الأول (Part 1): gemini-3.5-transcribe مسئول عن تحويل الصوت لنص فقط
      // ملهوش علاقة بالتنسيق ولا استخراج اللوحات
      // =========================================================================
      try {
        console.log(`[${fileName}] Step 1: Calling gemini-3.5-transcribe for pure transcription...`);
        const transcribeResponse = await ai.models.generateContent({
          model: "gemini-3.5-transcribe",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Audio,
                },
              },
              { 
                text: `أنت نموذج تفريغ صوتي فائق الدقة (Audio Transcription). مهمتك الاستماع للتسجيل الصوتي وتحويل كافة الكلمات المنطوقة إلى نص عربي دقيق جداً كلمة بكلمة كما نطقها المتحدث تماماً بدون أي اختصار أو تلخيص.
التسجيل عبارة عن مسح ميداني لحصر لوحات سيارات سعودية (حروف وأرقام عربية) وملاحظات جغرافية وأنواع مركبات.

إرشادات صوتية هامة لضمان الدقة:
1. التمييز الدقيق التام بين الحروف المتشابهة في النطق وترتيبها وموضعها كما نُطقت بالضبط:
   - التمييز الصارم بين السين (س) والصاد (ص):
     * إذا قال المتحدث: (س ص ص) أو (سين صاد صاد) -> اكتبها بدقة: "س ص ص" أو "سين صاد صاد" ولا تعكسها إلى سسص!
     * إذا قال: (س س ص) أو (سين سين صاد) -> اكتبها: "س س ص".
     * إذا قال: (ص س س) أو (صاد سين سين) -> اكتبها: "ص س س".
     * إذا قال: (ص ص س) أو (صاد صاد سين) -> اكتبها: "ص ص س".
2. تفريغ كلمات الأرقام بدقة بالغة دون تحريف:
   - كلمة (تمنين أو تمانين أو ثمانين) = تعني 80، اكتبها "تمنين" أو "ثمانين" كما نطقها ولا تخلط بينها وبين تسعين.
   - إذا قال: "تسعة تمنين اربعة" -> فرغها نصاً كما نطقها: "تسعة تمنين اربعة".
   - انتبه لألفاظ: (عشرين، تلاتين، اربعين، خمسين، ستين، سبعين، تمنين/ثمانين، تسعين).

أخرج النص العربي المنطوق كاملاً بدون أي زيادة أو حذف أو تلخيص أو جداول.` 
              },
            ],
          },
        });

        transcriptionText = transcribeResponse.text?.trim() || "";
        console.log(`[${fileName}] Raw Transcript from gemini-3.5-transcribe:`, transcriptionText);
      } catch (transcribeErr) {
        console.warn(`[${fileName}] gemini-3.5-transcribe error, will fall back to direct multimodal:`, transcribeErr);
      }

      let entries: LicensePlateEntry[] = [];

      // =========================================================================
      // الجزء الثاني (Part 2): gemini-3.8-flash السريع مسئول عن تحليل النص واستخراج اللوحات
      // والانواع والملاحظات بسرعة استجابة فائقة وبدون أي تأخير
      // =========================================================================
      if (transcriptionText) {
        const textAnalysisPrompt = `نص التفريغ الصوتي المستخرج من التسجيل:\n"""\n${transcriptionText}\n"""\n\nقم بتحليل هذا النص واستخراج كافة لوحات السيارات السعودية المذكورة فيه، ونوع كل مركبة (تنبيه صارم: إذا وردت كلمة "نقل" فاكتب "نقل" ولا تستبدلها أبداً بـ "بضائع"، وإذا قيل "بضائع" اكتب "بضائع"، وإذا قيل "نقل بضائع" اكتب "نقل بضائع")، وكافة الملاحظات والأوصاف في خانة notes بدقة فائقة حسب تعليمات النظام.`;

        try {
          console.log(`[${fileName}] Step 2: Calling gemini-3.8-flash for fast text analysis & plate extraction...`);
          const extractResponse = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: textAnalysisPrompt,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          });

          const responseText = extractResponse.text;
          console.log(`[${fileName}] Fast Text Extraction Response from gemini-3.8-flash:`, responseText);

          if (responseText) {
            try {
              const parsed = JSON.parse(responseText);
              if (Array.isArray(parsed)) {
                entries = parsed;
              } else if (parsed.entries && Array.isArray(parsed.entries)) {
                entries = parsed.entries;
              }
            } catch (e) {
              console.error("JSON parse error:", e);
            }
          }
        } catch (flashErr) {
          console.error(`[${fileName}] gemini-3.8-flash text analysis error:`, flashErr);
        }
      }

      // =========================================================================
      // Direct Multimodal Fallback (فقط إذا فشل التفريغ النصي بالكامل أو كان فارغاً)
      // =========================================================================
      if (entries.length === 0) {
        console.log(`[${fileName}] Step 3: Running direct audio extraction fallback with gemini-3.1-pro-preview...`);
        const audioFallbackParts = [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          { text: "استمع إلى هذا التسجيل الصوتي واستخرج جميع لوحات السيارات السعودية المذكورة مع نوع السيارة (تنبيه صارم: إذا قيل 'نقل' اكتب 'نقل' ولا تستبدلها بـ 'بضائع'، وإذا قيل 'بضائع' اكتب 'بضائع'، وإذا قيل 'نقل بضائع' اكتب 'نقل بضائع') وكافة الملاحظات والأوصاف وحالة السيارة وموقعها والتفريغ الصوتي بدقة تامة." },
        ];

        let directText = "";
        try {
          const directAudioResponse = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: { parts: audioFallbackParts },
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          });
          directText = directAudioResponse.text || "";
        } catch (audioProErr) {
          console.warn(`[${fileName}] Direct gemini-3.1-pro-preview error, falling back to gemini-3.8-flash:`, audioProErr);
          const directFlashResponse = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: { parts: audioFallbackParts },
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          });
          directText = directFlashResponse.text || "";
        }

        if (directText) {
          try {
            const parsed = JSON.parse(directText);
            if (parsed.transcript && !transcriptionText) {
              transcriptionText = parsed.transcript;
            }
            if (Array.isArray(parsed)) {
              entries = parsed;
            } else if (parsed.entries && Array.isArray(parsed.entries)) {
              entries = parsed.entries;
            }
          } catch (e) {
            console.error("Direct audio JSON parse error:", e);
          }
        }
      }

      // Sanitize and enforce Saudi plate rules, canonical vehicle types, and survey notes
      const sanitizedEntries: LicensePlateEntry[] = entries
        .map(entry => {
          const rawSanitized = sanitizeSaudiPlate(entry.plate || "");
          const reconciledPlate = reconcilePlateWithTranscript(rawSanitized, transcriptionText);
          const reconciledType = reconcileVehicleTypeWithTranscript(entry.type || "", reconciledPlate, transcriptionText);
          return {
            type: reconciledType,
            plate: reconciledPlate,
            notes: normalizeSurveyNote(entry.notes || "")
          };
        })
        .filter(entry => entry.plate.length > 0);

      return {
        source: fileName,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        transcript: transcriptionText || "تمت المعالجة (لم يتم التعرف على كلمات واضحة)",
        entries: sanitizedEntries,
      };

    } catch (error: any) {
      console.error(`AI Processing Error (Attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
      
      // Retry on transient errors
      if (error.status === 500 || error.status === 503 || error.status === 429 || error.message?.includes('500') || error.message?.includes('503') || error.message?.includes('429') || error.message?.includes('Internal error')) {
        attempt++;
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      return {
        source: fileName,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        entries: [],
        error: error.message || "حدث خطأ أثناء معالجة الملف",
      };
    }
  }

  return {
    source: fileName,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entries: [],
    error: "تم تجاوز الحد الأقصى للمحاولات",
  };
}
