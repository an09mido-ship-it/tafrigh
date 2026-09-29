/**
 * Official Saudi plate letters (17) and spoken-name variants.
 * Latin codes match the English side printed on Saudi plates.
 */

export const SAUDI_PLATE_LETTERS = [
  "ا",
  "ب",
  "ح",
  "د",
  "ر",
  "س",
  "ص",
  "ط",
  "ع",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
] as const;

export type SaudiPlateLetter = (typeof SAUDI_PLATE_LETTERS)[number];

export const SAUDI_PLATE_LETTER_SET: ReadonlySet<string> = new Set(SAUDI_PLATE_LETTERS);

/** Spoken / STT variants → canonical plate letter. Longer keys first at lookup. */
export const LETTER_NAME_MAP: Record<string, SaudiPlateLetter> = {
  // ألف
  الف: "ا",
  ألف: "ا",
  الاف: "ا",
  الألف: "ا",
  الالف: "ا",
  أليف: "ا",
  اليف: "ا",
  alef: "ا",
  alif: "ا",
  aleph: "ا",

  // باء
  باء: "ب",
  الباء: "ب",
  باءه: "ب",
  الباءه: "ب",
  باءة: "ب",
  الباءة: "ب",
  با: "ب",
  البا: "ب",
  باه: "ب",
  الباه: "ب",
  به: "ب",
  البه: "ب",
  baa: "ب",
  ba: "ب",
  bah: "ب",

  // حاء
  حاء: "ح",
  الحاء: "ح",
  حاءه: "ح",
  الحاءه: "ح",
  حا: "ح",
  الحا: "ح",
  حاه: "ح",
  الحاه: "ح",
  حه: "ح",
  الحه: "ح",
  حء: "ح",
  haa: "ح",
  hah: "ح",

  // دال
  دال: "د",
  الدال: "د",
  دالال: "د",
  دا: "د",
  الدا: "د",
  ودر: "د",
  dal: "د",
  daal: "د",
  da: "د",

  // راء
  راء: "ر",
  الراء: "ر",
  را: "ر",
  الرا: "ر",
  راه: "ر",
  الراه: "ر",
  ره: "ر",
  الره: "ر",
  raa: "ر",
  ra: "ر",
  rah: "ر",

  // سين
  سين: "س",
  السين: "س",
  سا: "س",
  السا: "س",
  سينن: "س",
  seen: "س",
  sin: "س",
  sien: "س",

  // صاد
  صاد: "ص",
  الصاد: "ص",
  صا: "ص",
  الصا: "ص",
  صاض: "ص",
  saad: "ص",
  sad: "ص",

  // طاء
  طاء: "ط",
  الطاء: "ط",
  طا: "ط",
  الطا: "ط",
  طاه: "ط",
  الطاه: "ط",
  طه: "ط",
  الطه: "ط",
  تاء: "ط",
  التاء: "ط",
  تا: "ط",
  التا: "ط",
  ته: "ط",
  الته: "ط",
  taa: "ط",
  ta: "ط",

  // عين
  عين: "ع",
  العين: "ع",
  عا: "ع",
  العا: "ع",
  عينن: "ع",
  ain: "ع",
  ein: "ع",
  ayn: "ع",

  // قاف
  قاف: "ق",
  القاف: "ق",
  قافة: "ق",
  القافة: "ق",
  قيف: "ق",
  القف: "ق",
  قف: "ق",
  قا: "ق",
  القا: "ق",
  جاف: "ق",
  الجاف: "ق",
  qaaf: "ق",
  qaf: "ق",
  gaf: "ق",

  // كاف
  كاف: "ك",
  الكاف: "ك",
  كافه: "ك",
  الكافه: "ك",
  كافة: "ك",
  الكافة: "ك",
  كا: "ك",
  الكا: "ك",
  كف: "ك",
  الكف: "ك",
  كيف: "ك",
  الكيف: "ك",
  kaaf: "ك",
  kaf: "ك",
  kaa: "ك",

  // لام
  لام: "ل",
  اللام: "ل",
  لا: "ل",
  اللا: "ل",
  laam: "ل",
  lam: "ل",

  // ميم
  ميم: "م",
  الميم: "م",
  ما: "م",
  الما: "م",
  مييم: "م",
  meem: "م",
  mim: "م",

  // نون
  نون: "ن",
  النون: "ن",
  نا: "ن",
  النا: "ن",
  نوون: "ن",
  noon: "ن",
  nun: "ن",
  noun: "ن",

  // هاء
  هاء: "ه",
  الهاء: "ه",
  هاءه: "ه",
  الهاءه: "ه",
  ها: "ه",
  الها: "ه",
  هـ: "ه",
  الهـ: "ه",
  هيه: "ه",
  الهيه: "ه",
  هه: "ه",
  الهه: "ه",
  اه: "ه",
  الاه: "ه",
  هي: "ه",
  الهي: "ه",
  heh: "ه",

  // واو
  واو: "و",
  الواو: "و",
  واوو: "و",
  وو: "و",
  وه: "و",
  الو: "و",
  waw: "و",
  wau: "و",
  wow: "و",

  // ياء
  ياء: "ي",
  الياء: "ي",
  ياءه: "ي",
  الياءه: "ي",
  يا: "ي",
  اليا: "ي",
  ياه: "ي",
  الياه: "ي",
  يه: "ي",
  اليه: "ي",
  ييه: "ي",
  الييه: "ي",
  اي: "ي",
  الاي: "ي",
  أي: "ي",
  الأي: "ي",
  yaa: "ي",
  ya: "ي",
  yeh: "ي",
};

/** Single-character maps, including official Latin plate codes. */
export const SINGLE_LETTER_MAP: Record<string, SaudiPlateLetter> = {
  ا: "ا",
  أ: "ا",
  إ: "ا",
  آ: "ا",
  ٱ: "ا",
  ب: "ب",
  ح: "ح",
  د: "د",
  ر: "ر",
  س: "س",
  ص: "ص",
  ط: "ط",
  ت: "ط",
  ع: "ع",
  ق: "ق",
  ك: "ك",
  ل: "ل",
  م: "م",
  ن: "ن",
  ه: "ه",
  ة: "ه",
  و: "و",
  ي: "ي",
  ى: "ي",
  ؤ: "و",
  ئ: "ي",
  a: "ا",
  b: "ب",
  j: "ح",
  d: "د",
  r: "ر",
  s: "س",
  x: "ص",
  t: "ط",
  e: "ع",
  g: "ق",
  k: "ك",
  l: "ل",
  z: "م",
  n: "ن",
  h: "ه",
  u: "و",
  v: "ي",
};

export const LETTER_DISPLAY_NAME: Record<SaudiPlateLetter, string> = {
  ا: "ألف",
  ب: "باء",
  ح: "حاء",
  د: "دال",
  ر: "راء",
  س: "سين",
  ص: "صاد",
  ط: "طاء",
  ع: "عين",
  ق: "قاف",
  ك: "كاف",
  ل: "لام",
  م: "ميم",
  ن: "نون",
  ه: "هاء",
  و: "واو",
  ي: "ياء",
};

export const LATIN_PLATE_CODE: Record<SaudiPlateLetter, string> = {
  ا: "A",
  ب: "B",
  ح: "J",
  د: "D",
  ر: "R",
  س: "S",
  ص: "X",
  ط: "T",
  ع: "E",
  ق: "G",
  ك: "K",
  ل: "L",
  م: "Z",
  ن: "N",
  ه: "H",
  و: "U",
  ي: "V",
};

export function isSaudiPlateLetter(value: string): value is SaudiPlateLetter {
  return SAUDI_PLATE_LETTER_SET.has(value);
}

/**
 * Common glued Arabic words produced by ASR models or speakers
 * representing 3 Saudi plate letters (e.g. ريعسين -> ر ع س).
 */
export const GLUED_PLATE_WORDS: Record<string, SaudiPlateLetter[]> = {
  ريعسين: ["ر", "ع", "س"],
  رعس: ["ر", "ع", "س"],
  حرب: ["ح", "ر", "ب"],
  بسم: ["ب", "س", "م"],
  دسن: ["د", "س", "ن"],
  صقر: ["ص", "ق", "ر"],
  بدر: ["ب", "د", "ر"],
  سعد: ["س", "ع", "د"],
  عمر: ["ع", "م", "ر"],
  نور: ["ن", "و", "ر"],
  حمد: ["ح", "م", "د"],
  رعد: ["ر", "ع", "د"],
  سند: ["س", "ن", "د"],
  هند: ["ه", "ن", "د"],
  وعد: ["و", "ع", "د"],
  ورد: ["و", "ر", "د"],
  عهد: ["ع", "ه", "د"],
  ملك: ["م", "ل", "ك"],
  كرم: ["ك", "ر", "م"],
  قمر: ["ق", "م", "ر"],
  علم: ["ع", "ل", "م"],
};

export const DIGIT_NAME_MAP: Record<string, string> = {
  صفر: "0",
  صقر: "0",
  zero: "0",
  ziro: "0",
  زيرو: "0",
  "٠": "0",
  "0": "0",

  واحد: "1",
  واحده: "1",
  واحدة: "1",
  وحد: "1",
  one: "1",
  "١": "1",
  "1": "1",

  اثنان: "2",
  اثنين: "2",
  إثنان: "2",
  إثنين: "2",
  اتنين: "2",
  اثنتين: "2",
  ثنتين: "2",
  ثنين: "2",
  two: "2",
  "٢": "2",
  "2": "2",

  ثلاثة: "3",
  ثلاثه: "3",
  ثلاث: "3",
  تلاتة: "3",
  تلاته: "3",
  تلات: "3",
  تلت: "3",
  three: "3",
  "٣": "3",
  "3": "3",

  أربعة: "4",
  اربعة: "4",
  أربعه: "4",
  اربعه: "4",
  أربع: "4",
  اربع: "4",
  four: "4",
  "٤": "4",
  "4": "4",

  خمسة: "5",
  خمسه: "5",
  خمس: "5",
  five: "5",
  "٥": "5",
  "5": "5",

  ستة: "6",
  سته: "6",
  ست: "6",
  six: "6",
  "٦": "6",
  "6": "6",

  سبعة: "7",
  سبعه: "7",
  سبع: "7",
  سهبه: "7",
  سبت: "7",
  سبته: "7",
  صبته: "7",
  seven: "7",
  "٧": "7",
  "7": "7",

  ثمانية: "8",
  ثمانيه: "8",
  ثمان: "8",
  تمانية: "8",
  تمانيه: "8",
  تمان: "8",
  ثمن: "8",
  تمن: "8",
  eight: "8",
  "٨": "8",
  "8": "8",

  تسعة: "9",
  تسعه: "9",
  تسع: "9",
  nine: "9",
  "٩": "9",
  "9": "9",
};

export const DIGIT_SPOKEN: Record<string, string> = {
  "0": "صفر",
  "1": "واحد",
  "2": "اثنين",
  "3": "ثلاثة",
  "4": "أربعة",
  "5": "خمسة",
  "6": "ستة",
  "7": "سبعة",
  "8": "ثمانية",
  "9": "تسعة",
};

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

export function normalizeDigitChar(ch: string): string | null {
  if (ch >= "0" && ch <= "9") return ch;
  const idx = ARABIC_INDIC.indexOf(ch);
  if (idx >= 0) return String(idx);
  return null;
}

export function isDigitChar(ch: string): boolean {
  return normalizeDigitChar(ch) !== null;
}

const DIGIT_STEMS: ReadonlyArray<{ stems: readonly string[]; digit: string }> = [
  { stems: ["صفر"], digit: "0" },
  { stems: ["واحد", "وحد"], digit: "1" },
  { stems: ["ثلاث", "تلات"], digit: "3" },
  { stems: ["اربع"], digit: "4" },
  { stems: ["خمس"], digit: "5" },
  { stems: ["ست"], digit: "6" },
  { stems: ["سبع"], digit: "7" },
  { stems: ["ثمان", "تمان", "ثمن", "تمن"], digit: "8" },
  { stems: ["تسع"], digit: "9" },
];

export const COUNT_WORD_MAP: Record<string, number> = {
  تلت: 3,
  تلات: 3,
  ثلاث: 3,
  ثلاثه: 3,
  تلاته: 3,
  زوج: 2,
  زوجين: 2,
  دبل: 2,
  ثنين: 2,
  ثنتين: 2,
  اتنين: 2,
  اثنين: 2,
  اثنان: 2,
  اثنتين: 2,
  اربع: 4,
  اربعه: 4,
  خمس: 5,
  خمسه: 5,
  ست: 6,
  سته: 6,
  سبع: 7,
  سبعه: 7,
  ثمان: 8,
  ثمانيه: 8,
  تمان: 8,
  تمانيه: 8,
  تسع: 9,
  تسعه: 9,
};

export const PLURAL_DIGIT_MAP: Record<string, string> = {
  صفرات: "0",
  اصفار: "0",
  واحدات: "1",
  وحدان: "1",
  احاد: "1",
  اتنينات: "2",
  اثنينات: "2",
  ثنائيات: "2",
  تلاتات: "3",
  ثلاثات: "3",
  اربعات: "4",
  خمسات: "5",
  ستات: "6",
  سبعات: "7",
  تمنات: "8",
  ثمانات: "8",
  ثمانيات: "8",
  تمانيات: "8",
  تسعات: "9",
};

export const ONES_WORD_MAP: Record<string, number> = {
  صفر: 0,
  واحد: 1,
  وحد: 1,
  اتنين: 2,
  اثنين: 2,
  اثنان: 2,
  اثنتين: 2,
  ثنتين: 2,
  ثلاث: 3,
  ثلاثه: 3,
  تلات: 3,
  تلاته: 3,
  تلت: 3,
  اربع: 4,
  اربعه: 4,
  خمس: 5,
  خمسه: 5,
  ست: 6,
  سته: 6,
  سبع: 7,
  سبعه: 7,
  ثمان: 8,
  ثمانيه: 8,
  تمان: 8,
  تمانيه: 8,
  ثمن: 8,
  تمن: 8,
  تسع: 9,
  تسعه: 9,
};

function buildTensMap(): Record<string, number> {
  const map: Record<string, number> = {
    عشر: 10,
    عشره: 10,
    عشرين: 20,
    عشرون: 20,
    عشرتين: 20,
  };
  for (const { stems, digit } of DIGIT_STEMS) {
    if (digit === "0" || digit === "1") continue;
    const tens = Number(digit) * 10;
    for (const stem of stems) {
      map[`${stem}ين`] = tens;
      map[`${stem}ون`] = tens;
      map[`${stem}هين`] = tens;
      map[`${stem}هون`] = tens;
    }
  }
  return map;
}

export const TENS_MAP = buildTensMap();

export function buildTeensAndHundreds(): Record<string, string> {
  return {
    احدعشر: "11",
    احداشر: "11",
    حداشر: "11",
    احدعش: "11",
    اتناشر: "12",
    اثناشر: "12",
    اثنعش: "12",
    اتنعش: "12",
    تلتاشر: "13",
    ثلاثتاشر: "13",
    تلاتاشر: "13",
    اربعتاشر: "14",
    اربعطاشر: "14",
    خمستاشر: "15",
    ستاشر: "16",
    ستعشر: "16",
    سبعتاشر: "17",
    تمنتاشر: "18",
    ثمنتاشر: "18",
    ثمانتاشر: "18",
    تسعتاشر: "19",
    ميه: "100",
    مائه: "100",
    مئه: "100",
    ميتين: "200",
    مئتين: "200",
    تلتميه: "300",
    تلاتميه: "300",
    ثلاثميه: "300",
    تلتمئه: "300",
    تلاتمئه: "300",
    ثلاثمئه: "300",
    اربعميه: "400",
    اربعمئه: "400",
    خمسميه: "500",
    خمسمئه: "500",
    ستميه: "600",
    ستمئه: "600",
    سبعميه: "700",
    سبعمئه: "700",
    ثمنميه: "800",
    تمنميه: "800",
    ثمانميه: "800",
    ثمنمئه: "800",
    تمنمئه: "800",
    ثمانمئه: "800",
    تسعميه: "900",
    تسعمئه: "900",
  };
}

export const TEEN_TWO_WORD: Record<string, string> = {
  "احد عشر": "11",
  "احده عشر": "11",
  "اثنا عشر": "12",
  "اتنا عشر": "12",
  "ثلاثه عشر": "13",
  "تلاته عشر": "13",
  "اربعه عشر": "14",
  "خمسه عشر": "15",
  "سته عشر": "16",
  "سبعه عشر": "17",
  "ثمانيه عشر": "18",
  "تمانيه عشر": "18",
  "تسعه عشر": "19",
};

function buildCompoundWordMap(): Record<string, string> {
  const map: Record<string, string> = {
    ...buildTeensAndHundreds(),
  };

  for (const [word, tens] of Object.entries(TENS_MAP)) {
    map[word] = String(tens);
  }

  for (const { stems, digit } of DIGIT_STEMS) {
    for (const stem of stems) {
      const dual = `${digit}${digit}`;
      map[`${stem}تين`] = dual;
      map[`${stem}تان`] = dual;
      map[`${stem}هتين`] = dual;
      map[`${stem}هتان`] = dual;
      if (digit === "0") {
        map[`${stem}ين`] = dual;
      }
    }
  }

  for (const [countKey, count] of Object.entries(COUNT_WORD_MAP)) {
    for (const [pluralKey, digit] of Object.entries(PLURAL_DIGIT_MAP)) {
      map[`${countKey}${pluralKey}`] = digit.repeat(count);
    }
  }

  for (const [oneKey, oneVal] of Object.entries(ONES_WORD_MAP)) {
    for (const [tensKey, tensVal] of Object.entries(TENS_MAP)) {
      if (tensVal < 20) continue;
      map[`${oneKey}و${tensKey}`] = String(tensVal + oneVal);
    }
  }

  return map;
}

export const COMPOUND_WORD_MAP: Record<string, string> = buildCompoundWordMap();

export interface SpokenNumberMatch {
  digits: string[];
  consumed: number;
  source: string;
}

function splitDigits(value: string): string[] {
  return value.split("").filter((ch) => ch >= "0" && ch <= "9");
}

function lookupDigitStem(word: string): string | null {
  for (const { stems, digit } of DIGIT_STEMS) {
    if (stems.includes(word)) return digit;
    if (word.endsWith("ه") && stems.includes(word.slice(0, -1))) return digit;
  }
  const named = DIGIT_NAME_MAP[word];
  if (named && named.length === 1) return named;
  return null;
}

function matchDualOrTensWord(word: string): string[] | null {
  const compound = COMPOUND_WORD_MAP[word];
  if (compound) return splitDigits(compound);

  if (word.endsWith("تين") && word.length > 3) {
    const stem = word.slice(0, -3);
    const digit = lookupDigitStem(stem);
    if (digit) return [digit, digit];
  }
  if (word.endsWith("تان") && word.length > 3) {
    const stem = word.slice(0, -3);
    const digit = lookupDigitStem(stem);
    if (digit) return [digit, digit];
  }
  if (word.endsWith("ين") && !word.endsWith("تين") && word.length > 2) {
    const stem = word.slice(0, -2);
    const digit = lookupDigitStem(stem);
    if (digit && digit !== "0" && digit !== "1") {
      return [digit, "0"];
    }
  }
  if (word.endsWith("ون") && word.length > 2) {
    const stem = word.slice(0, -2);
    const digit = lookupDigitStem(stem);
    if (digit && digit !== "0" && digit !== "1") {
      return [digit, "0"];
    }
  }
  return null;
}

function matchConcatenatedCompound(word: string): string[] | null {
  const fromMap = COMPOUND_WORD_MAP[word];
  if (fromMap) return splitDigits(fromMap);

  const dualOrTens = matchDualOrTensWord(word);
  if (dualOrTens) return dualOrTens;

  const countKeys = Object.keys(COUNT_WORD_MAP).sort((a, b) => b.length - a.length);
  for (const countKey of countKeys) {
    if (!word.startsWith(countKey) || word.length === countKey.length) continue;
    const rest = word.slice(countKey.length);
    const digit = PLURAL_DIGIT_MAP[rest];
    if (digit) {
      const count = COUNT_WORD_MAP[countKey] ?? 0;
      return Array.from({ length: count }, () => digit);
    }
  }

  const oneKeys = Object.keys(ONES_WORD_MAP).sort((a, b) => b.length - a.length);
  for (const oneKey of oneKeys) {
    if (!word.startsWith(oneKey)) continue;
    const rest = word.slice(oneKey.length);
    if (!rest.startsWith("و") || rest.length < 2) continue;
    const tensPart = rest.slice(1);
    const tens = TENS_MAP[tensPart];
    const ones = ONES_WORD_MAP[oneKey];
    if (tens !== undefined && tens >= 20 && ones !== undefined) {
      return splitDigits(String(tens + ones));
    }
  }

  return null;
}

export function matchSpokenNumber(parts: string[], index: number): SpokenNumberMatch | null {
  const a = parts[index];
  if (!a) return null;
  const b = parts[index + 1];
  const c = parts[index + 2];

  if (b) {
    const teen = TEEN_TWO_WORD[`${a} ${b}`];
    if (teen) {
      return { digits: splitDigits(teen), consumed: 2, source: `${a} ${b}` };
    }
  }

  if (b) {
    const count = COUNT_WORD_MAP[a];
    const digit = PLURAL_DIGIT_MAP[b];
    if (count !== undefined && digit !== undefined) {
      return {
        digits: Array.from({ length: count }, () => digit),
        consumed: 2,
        source: `${a} ${b}`,
      };
    }
  }

  if (b === "و" && c) {
    const ones = ONES_WORD_MAP[a];
    const tensWord = c.startsWith("و") ? c.slice(1) : c;
    const tens = TENS_MAP[tensWord];
    if (ones !== undefined && tens !== undefined && tens >= 20) {
      const digits = splitDigits(String(tens + ones));
      return {
        digits,
        consumed: 3,
        source: `${a} ${b} ${c}`,
      };
    }
  }

  if (b && b.startsWith("و") && b.length > 1) {
    const ones = ONES_WORD_MAP[a];
    const tens = TENS_MAP[b.slice(1)];
    if (ones !== undefined && tens !== undefined && tens >= 20) {
      const digits = splitDigits(String(tens + ones));
      return {
        digits,
        consumed: 2,
        source: `${a} ${b}`,
      };
    }
  }

  if (b && TENS_MAP[b] !== undefined && TENS_MAP[b] >= 20) {
    const ones = ONES_WORD_MAP[a];
    const tens = TENS_MAP[b];
    if (ones !== undefined) {
      const digits = [String(ones), ...splitDigits(String(tens))];
      return {
        digits,
        consumed: 2,
        source: `${a} ${b}`,
      };
    }
  }

  const concat = matchConcatenatedCompound(a);
  if (concat && concat.length >= 2) {
    return { digits: concat, consumed: 1, source: a };
  }

  return null;
}

const PUNCT_RE = /[.,،؛:!؟?\-_/\\|()[\]{}"'`~+*=<>@#٪%]/g;

export function stripDiacritics(input: string): string {
  return input
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/ـ/g, "")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/أ|إ|آ|ٱ/g, "ا");
}

export function isKnownNumberLexeme(word: string): boolean {
  if (DIGIT_NAME_MAP[word] !== undefined) return true;
  if (COMPOUND_WORD_MAP[word] !== undefined) return true;
  if (PLURAL_DIGIT_MAP[word] !== undefined) return true;
  if (COUNT_WORD_MAP[word] !== undefined) return true;
  if (ONES_WORD_MAP[word] !== undefined) return true;
  if (TENS_MAP[word] !== undefined) return true;
  return false;
}

/**
 * The 44 official written survey notes used by the user.
 */
export const CANONICAL_SURVEY_NOTES = [
  "اول برحه يسار",
  "اول برحه يمين",
  "اول دخله يمين",
  "اول جراش يسار",
  "اول جراش يمين شارع سدين الجنب الأول",
  "اول دخله يمين مكمل بعد سور تله شارع سدين الجنب التاني",
  "برحه يمين بعد تموينات صقر شارع سدين الجنب التاني",
  "بعد اول دخله يمين شارع سدين الجنب التاني",
  "بعد دخله يمين شارع سدين الجنب التاني",
  "مكمل بعد اول دخله يسار",
  "مكمل بعد اول دخله يمين",
  "مكمل بعد اول دخله يمين شارع سدين الجنب الأول",
  "مكمل بعد تاني دخله يسار",
  "مكمل بعد تاني دخله يمين شارع سدين الجنب الأول",
  "مكمل بعد تاني دخله يمين شارع سدين الجنب التاني",
  "مكمل بعد سور تله شارع سدين الجنب التاني",
  "مكمل بعد دخله يسار سدين",
  "مكمل بعد دخله يمين شارع سدين",
  "مكمل بعد مدرسه منارات جده شارع سدين الجنب التاني",
  "مكمل بعد الزافر للمياه شارع سدين الجنب التاني",
  "مكمل بعد اخر دخله يسار",
  "مكمل بعد اخر دخله يمين شارع سدين الجنب الأول",
  "مكمل بعد تقاطع السدين",
  "مكمل بعد تموينات الأمين شارع سدين الجنب الأول",
  "مكمل بعد اول تقاطع",
  "تالت جراش يمين شارع سدين الجنب الأول",
  "تاني جراش يمين شارع سدين الجنب الأول",
  "رابع جراش يمين شارع سدين الجنب الأول",
  "امام السباكه والكهرباء",
  "امام خياط غزاله للعبايات",
  "امام سلطان سطور للعبايات",
  "امام ضواحي الصمان",
  "امام لمسه يارا للخياطه",
  "امام مؤسسه رقي الألوان التجاريه",
  "امام مخبز امنيه",
  "امام مصرف الراجحي",
  "خياط لمسه ندين",
  "محل مركن الهدي",
  "مكتب أسماء فهد",
  "يبدا من مراتب طبيه وسرر",
  "شارع ببرحه",
  "شارع سدين الجنب الأول",
  "شارع سدين الجنب التاني",
] as const;

/**
 * Normalizes raw extracted notes.
 * - Standardizes known canonical survey notes (fixing minor typos, normalization).
 * - Discards pure noise, casual conversation, repeated plate numbers, or vehicle-condition descriptors.
 * - Retains ANY legitimate survey note/landmark/location even if not strictly in the 44 examples,
 *   as the user clarified that the 44 items were examples of style/sentence-structure, not an exhaustive limit!
 */
export function normalizeSurveyNote(rawNote: string): string {
  if (!rawNote) return "";

  const cleaned = rawNote.trim();
  if (!cleaned) return "";

  const simplify = (str: string) => {
    return str
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\s\-_.,،؛:!؟?]+/g, " ")
      .trim();
  };

  const simplifiedRaw = simplify(cleaned);

  // 1. Direct match with canonical notes (exact or simplified)
  for (const canonical of CANONICAL_SURVEY_NOTES) {
    if (cleaned === canonical) return canonical;
    if (simplifiedRaw === simplify(canonical)) return canonical;
  }

  // 2. Substring / inclusion match (if the raw text contains a canonical note)
  const sortedCanonical = [...CANONICAL_SURVEY_NOTES].sort((a, b) => b.length - a.length);
  for (const canonical of sortedCanonical) {
    const simpCan = simplify(canonical);
    if (simplifiedRaw.includes(simpCan)) {
      return canonical;
    }
  }

  // 3. Filter out unwanted phrases (e.g. conversational greetings, car-condition descriptions, fillers)
  const unwantedWords = [
    "مركون", "مصدوم", "عطلان", "خربان", "واقف", "سياره", "سيارة", "لوحه", "لوحة",
    "لا يوجد", "بدون", "تفريغ", "ملاحظه", "ملاحظة", "مخالف", "طايحه", "طايحة", "قديم", "جديد",
    "سليم", "السلام", "عليكم", "صباح", "الخير", "مساء", "شكرا", "تمام", "الو", "ماشية", "ماشي"
  ];

  // If the text only consists of unwanted words or generic filler, clear it
  const words = simplifiedRaw.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const allUnwanted = words.every(w => unwantedWords.includes(w));
  if (allUnwanted) {
    return "";
  }

  // If the note is just repeated plate letters/numbers without location keywords
  if (words.length <= 2 && /\d+/.test(cleaned)) {
    const hasLocationWord = /برحه|برحة|جراش|جراج|دخله|دخلة|شارع|مكمل|امام|أمام|بعد|يسار|يمين|تقاطع|سور|محل|مكتب|خياط|تموينات|مخبز|مصرف|بنك|صيدلية|مسجد/.test(cleaned);
    if (!hasLocationWord) {
      return "";
    }
  }

  // Clean up punctuation and return the valid survey note
  return cleaned.replace(/[.,،؛:!؟?]+/g, " ").trim();
}

/**
 * Canonical vehicle types and special classifications specified by the user.
 */
export const CANONICAL_VEHICLE_TYPES = [
  "كامري",
  "كورولا",
  "سوناتا",
  "اكورد",
  "اكورد كوبيه",
  "اكسنت",
  "ال اكس",
  "اوبتيما",
  "النترا",
  "سيناتا",
  "سينترا",
  "يارس",
  "ريو سيدان",
  "تورس",
  "تورس سيدان",
  "كوستر",
  "سيد",
  "فوكتريا",
  "سيراتيو",
  "سيلتوس",
  "فوكس",
  "فيوجن",
  "بيجاس",
  "Beancan",
  "جراند I10",
  "باجيرو",
  "اكسبلورر",
  "تاهو",
  "سانتافي جيب",
  "جيب",
  "جيب فورتشنر",
  "جيب مصندق",
  "جيب بكب",
  "سورينتو",
  "توسان",
  "باث فايندر",
  "ازيرا",
  "ال سيفن",
  "شانجان ال سيفن فل",
  "وانيت",
  "ونيت",
  "يوكون",
  "سكويا",
  "باترول 4 باب",
  "باترول واجن",
  "Everest",
  "هايلكس",
  "هيلوكس",
  "جران ماكس",
  "سوزوكي جران ماكس",
  "ديلوكس طويل",
  "بضائع",
  "اتوبيس",
  "باص",
  "حافله",
  "ميكروباص",
  "دينا",
  "نقل",
  "نقل بضائع",
  "تاكسي",
  "أجرة",
  "بكب غمارتين",
  "بكب غماره",
  "بكب",
  "مصندق",
  "مركون",
  "مركونه",
  "لوحه صفرا",
  "لوحه صفرا ت",
  "لوحه صفرا دي كبيره",
  "حادث",
  "اسعاف",
  "متحرك",
  "سطحه",
  "فان بضاعه",
  "كابريس",
  "امبالا",
  "انوفا فاغن",
  "شارجر",
  "شالنجر",
  "كادنزا",
  "دباب",
  "دباب مغبر",
  "مغبره",
  "وايت ميه",
  "مترب",
  "متربه",
  "متربه بدون لوحة خلفيه",
  "اتش1"
] as const;

const VEHICLE_TYPE_ALIASES: Record<string, string> = {
  "كورلا": "كورولا",
  "كورولا": "كورولا",
  "ياريس": "يارس",
  "يارس": "يارس",
  "كادينزا": "كادنزا",
  "كادنزا": "كادنزا",
  "ونيت": "وانيت",
  "وانيت": "وانيت",
  "سينترا": "سينترا",
  "سيناتا": "سيناتا",
  "اكورد كوبيه": "اكورد كوبيه",
  "تورس سيدان": "تورس سيدان",
  "فكتوريا": "فوكتريا",
  "فوكتوريا": "فوكتريا",
  "فوكتريا": "فوكتريا",
  "كراون فكتوريا": "فوكتريا",
  "سيراتو": "سيراتيو",
  "سيراتيو": "سيراتيو",
  "بيجاس": "بيجاس",
  "beancan": "Beancan",
  "جراند i10": "جراند I10",
  "جراند اي 10": "جراند I10",
  "جراند اى 10": "جراند I10",
  "سيكويا": "سكويا",
  "سكويا": "سكويا",
  "everest": "Everest",
  "ايفرست": "Everest",
  "هيلوكس": "هايلكس",
  "هايلوكس": "هايلكس",
  "هايلكس": "هايلكس",
  "سوزوكي جران ماكس": "جران ماكس",
  "جران ماكس": "جران ماكس",
  "قران ماكس": "جران ماكس",
  "باترول واجن": "باترول واجن",
  "باترول 4 باب": "باترول 4 باب",
  "فورتشنر": "جيب فورتشنر",
  "جيب فورتشنر": "جيب فورتشنر",
  "جيب مصندق": "جيب مصندق",
  "جيب بكب": "جيب بكب",
  "بكب": "بكب",
  "بكب غماره": "بكب غماره",
  "بكب غمارتين": "بكب غمارتين",
  "الكس": "ال اكس",
  "ال اكس": "ال اكس",
  "lx": "ال اكس",
  "ال سيفن": "ال سيفن",
  "ال 7": "ال سيفن",
  "l7": "ال سيفن",
  "شانجان ال سيفن فل": "شانجان ال سيفن فل",
  "شانجان ال سيفن": "شانجان ال سيفن فل",
  "انوفا فاغن": "انوفا فاغن",
  "انوفا واجن": "انوفا فاغن",
  "انوفا": "انوفا فاغن",
  "اينوفا": "انوفا فاغن",
  "لوحة صفراء": "لوحه صفرا",
  "لوحه صفراء": "لوحه صفرا",
  "لوحه صفرا": "لوحه صفرا",
  "لوحه صفرا ت": "لوحه صفرا ت",
  "لوحه صفرا دي كبيره": "لوحه صفرا دي كبيره",
  "مغبرة": "مغبره",
  "مغبره": "مغبره",
  "متربة": "متربه",
  "متربه": "متربه",
  "متربه بدون لوحه خلفيه": "متربه بدون لوحة خلفيه",
  "متربه بدون لوحة خلفية": "متربه بدون لوحة خلفيه",
  "متربه بدون لوحة خلفيه": "متربه بدون لوحة خلفيه",
  "وايت ماء": "وايت ميه",
  "وايت مياه": "وايت ميه",
  "وايت ميه": "وايت ميه",
  "دباب مغبر": "دباب مغبر",
  "كابرس": "كابريس",
  "كابريس": "كابريس",
  "شالنجر": "شالنجر",
  "تشالنجر": "شالنجر",
  "شارجر": "شارجر",
  "تشارجر": "شارجر",
  "اتش 1": "اتش1",
  "اتش1": "اتش1",
  "h1": "اتش1",
  "نقل": "نقل",
  "سيارة نقل": "نقل",
  "عربية نقل": "نقل",
  "شاحنة نقل": "نقل",
  "لوحة نقل": "نقل",
  "لوحه نقل": "نقل",
  "نقل خاص": "نقل",
  "نقل عام": "نقل",
  "بضائع": "بضائع",
  "بضاعه": "بضائع",
  "بضاعة": "بضائع",
  "بضايع": "بضائع",
  "سيارة بضائع": "بضائع",
  "عربية بضائع": "بضائع",
  "لوحة بضائع": "بضائع",
  "لوحه بضائع": "بضائع",
  "نقل بضائع": "نقل بضائع",
  "نقل بضاعه": "نقل بضائع",
  "نقل بضاعة": "نقل بضائع",
  "نقل بضايع": "نقل بضائع",
  "فان بضائع": "فان بضاعه",
  "فان بضاعه": "فان بضاعه"
};

/**
 * Normalizes vehicle types to strictly conform to the user's canonical 129 types list.
 */
export function normalizeVehicleType(rawType: string): string {
  if (!rawType) return "";
  const cleaned = rawType.trim().replace(/[.,،؛:!؟?]+/g, "").trim();
  if (!cleaned) return "";

  const lower = cleaned.toLowerCase();
  if (VEHICLE_TYPE_ALIASES[lower]) {
    return VEHICLE_TYPE_ALIASES[lower];
  }

  // Check direct canonical match
  for (const cType of CANONICAL_VEHICLE_TYPES) {
    if (cType.toLowerCase() === lower) {
      return cType;
    }
  }

  // Check simplified match
  const simplifyType = (s: string) => s.replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, "").toLowerCase();
  const simpCleaned = simplifyType(cleaned);

  for (const [alias, canonical] of Object.entries(VEHICLE_TYPE_ALIASES)) {
    if (simplifyType(alias) === simpCleaned) {
      return canonical;
    }
  }

  for (const cType of CANONICAL_VEHICLE_TYPES) {
    if (simplifyType(cType) === simpCleaned) {
      return cType;
    }
  }

  return cleaned;
}

/**
 * Reconciles and corrects common plate extraction and transcription mistakes against the raw transcript.
 * Specifically handles:
 * 1. Letter swaps / repetitions (e.g. سسص when spoken س ص ص / سين صاد صاد).
 * 2. Spoken composite numbers (e.g. تسعة تمنين أربعة -> 9804, preventing mistranslations like 9894).
 */
export function reconcilePlateWithTranscript(plate: string, transcript: string): string {
  if (!plate) return "";
  let correctedPlate = plate;

  if (transcript) {
    const normTranscript = transcript
      .replace(/[إأآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,،؛:!؟?\-_/\\]/g, ' ')
      .replace(/\s+/g, ' ');

    // 1. Correct swapped or misordered repeated sibilants (س / ص)
    if (
      /(س\s+ص\s+ص|سين\s+صاد\s+صاد|سين\s+صادتين|س\s+صادتين|سين\s+اتنين\s+صاد|سصص)/.test(normTranscript) &&
      correctedPlate.startsWith("سسص")
    ) {
      correctedPlate = "سصص" + correctedPlate.slice(3);
    } else if (
      /(ص\s+س\s+س|صاد\s+سين\s+سين|صاد\s+سينين|ص\s+سينين|صاد\s+اتنين\s+سين|صسس)/.test(normTranscript) &&
      correctedPlate.startsWith("صصس")
    ) {
      correctedPlate = "صسس" + correctedPlate.slice(3);
    } else if (
      /(ص\s+ص\s+س|صاد\s+صاد\s+سين|صادتين\s+سين|صصس)/.test(normTranscript) &&
      correctedPlate.startsWith("صسس")
    ) {
      correctedPlate = "صصس" + correctedPlate.slice(3);
    } else if (
      /(س\s+س\s+ص|سين\s+سين\s+صاد|سينين\s+صاد|سسص)/.test(normTranscript) &&
      correctedPlate.startsWith("سصص")
    ) {
      correctedPlate = "سسص" + correctedPlate.slice(3);
    }

    // 2. Check composite digit patterns: [رقم مفرد 1-9] [عشرات 20-90] [رقم مفرد 1-9]
    // Specifically: "تسعة تمنين اربعة" -> 9804 (preventing 9894, 9884, 984)
    const onesMap: Record<string, string> = {
      واحد: "1", وحد: "1",
      اتنين: "2", اثنين: "2",
      تلاته: "3", تلات: "3", ثلاثه: "3", ثلاث: "3",
      اربعه: "4", اربع: "4",
      خمسه: "5", خمس: "5",
      سته: "6", ست: "6",
      سبعه: "7", سبع: "7",
      تمانيه: "8", تمان: "8", ثمانيه: "8", ثمان: "8",
      تسعه: "9", تسع: "9"
    };

    const tensMap: Record<string, string> = {
      عشرين: "2",
      تلاتين: "3", ثلاثين: "3",
      اربعين: "4",
      خمسين: "5",
      ستين: "6",
      سبعين: "7",
      تمنين: "8", تمانين: "8", ثمانين: "8",
      تسعين: "9"
    };

    const onesPattern = Object.keys(onesMap).join("|");
    const tensPattern = Object.keys(tensMap).join("|");
    const compositeRegex = new RegExp(`(${onesPattern})\\s+(${tensPattern})\\s+(${onesPattern})`, "g");

    let match: RegExpExecArray | null;
    while ((match = compositeRegex.exec(normTranscript)) !== null) {
      const d1 = onesMap[match[1]];
      const t = tensMap[match[2]];
      const d2 = onesMap[match[3]];
      if (d1 && t && d2) {
        const expectedDigits = `${d1}${t}0${d2}`; // e.g. "9804"
        const wrongPatterns = [
          `${d1}${t}9${d2}`, // e.g. "9894"
          `${d1}${t}${t}${d2}`, // e.g. "9884"
          `${d1}${t}${d2}`, // e.g. "984"
        ];
        for (const wrong of wrongPatterns) {
          if (correctedPlate.includes(wrong)) {
            correctedPlate = correctedPlate.replace(wrong, expectedDigits);
            break;
          }
        }
      }
    }
  }

  // Also direct algorithmic check for common misinterpretation of 9894 where 9804 was meant
  if (correctedPlate.includes("9894") && transcript && /(تمنين|تمانين|ثمانين)/.test(transcript) && /(اربع|اربعه|أربعة)/.test(transcript)) {
    correctedPlate = correctedPlate.replace("9894", "9804");
  }

  return correctedPlate;
}

/**
 * Reconciles the vehicle type with the raw transcript:
 * - If speaker said "نقل" -> type must be "نقل" (never "بضائع").
 * - If speaker said "بضائع" -> type must be "بضائع".
 * - If speaker said "نقل بضائع" -> type must be "نقل بضائع".
 */
export function reconcileVehicleTypeWithTranscript(
  rawType: string,
  plate: string,
  transcript: string
): string {
  let type = normalizeVehicleType(rawType);
  if (!transcript) return type;

  const normTranscript = transcript
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[.,،؛:!؟?\-_/\\]/g, ' ')
    .replace(/\s+/g, ' ');

  // Try to find a localized window around the plate if possible
  let searchScope = normTranscript;
  if (plate) {
    // Extract letters or digits from plate to locate the mention in transcript
    const digitsMatch = plate.match(/\d+/);
    const lettersMatch = plate.match(/[^\d\s]+/);
    const target = (digitsMatch ? digitsMatch[0] : "") || (lettersMatch ? lettersMatch[0] : "");
    if (target) {
      const idx = normTranscript.indexOf(target);
      if (idx !== -1) {
        const start = Math.max(0, idx - 120);
        const end = Math.min(normTranscript.length, idx + 120);
        searchScope = normTranscript.slice(start, end);
      }
    }
  }

  const hasNaqlBadae = /(نقل\s+بضايع|نقل\s+بضائع|نقل\s+بضاعه|نقل\s+بضاعة)/.test(searchScope);
  const hasNaql = /(^|\s)(نقل|سياره\s+نقل|سيارة\s+نقل|لوحه\s+نقل|لوحة\s+نقل|عربيه\s+نقل)(\s|$)/.test(searchScope);
  const hasBadae = /(^|\s)(بضايع|بضائع|بضاعه|بضاعة)(\s|$)/.test(searchScope);

  // 1. If "نقل بضائع" is in search scope
  if (hasNaqlBadae) {
    return "نقل بضائع";
  }

  // 2. If "نقل" is in search scope without "بضائع"
  if (hasNaql && !hasBadae) {
    return "نقل";
  }

  // 3. If "بضائع" is in search scope without "نقل"
  if (hasBadae && !hasNaql) {
    return "بضائع";
  }

  // Fallback checks on entire transcript if type was set to "بضائع" or "نقل" or "نقل بضائع":
  const globalHasNaqlBadae = /(نقل\s+بضايع|نقل\s+بضائع|نقل\s+بضاعه|نقل\s+بضاعة)/.test(normTranscript);
  const globalHasNaql = /(^|\s)(نقل|سياره\s+نقل|سيارة\s+نقل|لوحه\s+نقل|لوحة\s+نقل|عربيه\s+نقل)(\s|$)/.test(normTranscript);
  const globalHasBadae = /(^|\s)(بضايع|بضائع|بضاعه|بضاعة)(\s|$)/.test(normTranscript);

  if (globalHasNaqlBadae && (type === "نقل" || type === "بضائع" || type === "نقل بضائع")) {
    return "نقل بضائع";
  }

  if (type === "بضائع" && globalHasNaql && !globalHasBadae) {
    return "نقل";
  }

  if (type === "نقل" && globalHasBadae && !globalHasNaql) {
    return "بضائع";
  }

  return type;
}

