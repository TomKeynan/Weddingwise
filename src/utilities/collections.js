export const VALIDATIONS = Object.freeze({
  groomName: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  brideName: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{3,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  // weddingDate: {
  //   error:
  //     "תאריך לידה לא חוקי. רק משתמשים בגילאי 18 עד 120 רשאים להירשם למערכת ",
  // },
  numOfGuests: {
    regex: /^$|^[0-9]{3,}\d*$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  budget: {
    regex: /^$|^[0-9]{5,}\d*$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו סכום מקסימלי (לפחות 10,000)",
  },
  email: {
    regex: /^$|^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    error: "שדה לא חוקי. אנא בדק שנית את כתובת המייל שהזנת",
    valid: "",
  },
  password: {
    regex: /^(\s*|\S.{5,})$/,
    error: "שדה לא חוקי. הסיסמא חייב להכיל לפחות 6 תוים",
    valid: "",
  },
});

export const regions = [
  "רמת הגולן",
  "הגליל",
  "חיפה",
  "חוף הכרמל",
  "העמקים",
  "חדרה",
  "זכרון יעקב",
  "שרון",
  "תל אביב",
  "גוש דן",
  "ירושלים",
  "שפלת הים התיכון",
  "יהודה ושומרון ובקעת הירדן",
];

export const questionsArray = [
  {
    title: "אולם יוקרתי או תקליטן מוכשר",
    options: { supplier_1: "אולם", supplier_2: "תקליטן" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/dj/dj-gray.png",
  },
  {
    title: "תקליטן מוכשר או צלם מצוין",
    options: { supplier_1: "תקליטן", supplier_2: "צלם" },
    sticker_1: "assets/graphics/dj/dj-gray.png",
    sticker_2: "assets/graphics/photographer/camera-orange.png",
  },
  {
    title: "אולם יוקרתי או צלם מצוין",
    options: { supplier_1: "אולם", supplier_2: "צלם" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/photographer/camera-gray.png",
  },
  {
    title: "אולם יוקרתי או אמנ/ית איפור מקצועית",
    options: { supplier_1: "אולם", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/venue/venue-gray.png",
    sticker_2: "assets/graphics/makeup/makeup-orange.png",
  },
  {
    title: "אולם יוקרתי או רב מוערך",
    options: { supplier_1: "אולם", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/rabbi/rabbi-gray.png",
  },
  {
    title: "אולם יוקרתי או מעצב/ת שמלות כלה מפורסמת",
    options: { supplier_1: "אולם", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/venue/venue-gray.png",
    sticker_2: "assets/graphics/dress/dress-orange.png",
  },
  {
    title: "תקליטן מוכשר או אמנ/ית איפור מקצועית",
    options: { supplier_1: "תקליטן", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/dj/dj-orange.png",
    sticker_2: "assets/graphics/makeup/makeup-gray.png",
  },
  {
    title: "תקליטן מוכשר או רב מוערך",
    options: { supplier_1: "תקליטן", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/dj/dj-gray.png",
    sticker_2: "assets/graphics/rabbi/rabbi-orange.png",
  },
  {
    title: "תקליטן מוכשר או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "תקליטן", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/dj/dj-orange.png",
    sticker_2: "assets/graphics/dress/dress-gray.png",
  },
  {
    title: "צלם מצוין או אמנית איפור מקצועית",
    options: { supplier_1: "צלם", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/photographer/camera-gray.png",
    sticker_2: "assets/graphics/makeup/makeup-orange.png",
  },
  {
    title: "צלם מצוין או רב מוערך",
    options: { id: 1, supplier_1: "צלם", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/photographer/camera-orange.png",
    sticker_2: "assets/graphics/rabbi/rabbi-gray.png",
  },
  {
    title: "צלם מצוין או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "צלם", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/photographer/camera-gray.png",
    sticker_2: "assets/graphics/dress/dress-orange.png",
  },
  {
    title: "אמנית איפור מקצועית או רב מוערך",
    options: { supplier_1: "אמנ/ית איפור", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/makeup/makeup-orange.png",
    sticker_2: "assets/graphics/rabbi/rabbi-gray.png",
  },
  {
    title: "אמנית איפור מקצועית או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "אמנ/ית איפור", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/makeup/makeup-gray.png",
    sticker_2: "assets/graphics/dress/dress-orange.png",
  },
  {
    title: "רב מוערך או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "רב/עורך טקסים", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/rabbi/rabbi-orange.png",
    sticker_2: "assets/graphics/dress/dress-gray.png",
  },
];

export const test = {
  groomName: "עומרי",
  brideName: "רוני",
  numOfGuests: 500,
  date: "06/06/2024",
  package: [],
  expenses: {
    venue: 22000,
    design: 9000,
    dj: 12000,
    photographer: 14500,
  },
  taksComplation: 0.25,
};

export const supplierCard = [
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של תקליטן",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
];

export const typeWeights = [
  {
    name: "אולם",
    stickerSrc: "assets/graphics/venue/venue-orange.png",
    stickerAlt: "אולם",
    weight: 0.202321,
  },
  {
    name: "תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "תקליטן",
    weight: 0.202321,
  },
  {
    name: "צלם",
    stickerSrc: "assets/graphics/photographer/camera-orange.png",
    stickerAlt: "צלם",
    weight: 0.15023123,
  },
  {
    name: "איפור",
    stickerSrc: "assets/graphics/makeup/makeup-gray.png",
    stickerAlt: "איפור",
    weight: 0.150321312,
  },
  {
    name: "שמלה",
    stickerSrc: "assets/graphics/dress/dress-orange.png",
    stickerAlt: "שמלה",
    weight: 0.203213,
  },
  {
    name: "עורכי טקסים",
    stickerSrc: "assets/graphics/rabbi/rabbi-gray.png",
    stickerAlt: "רב",
    weight: 0.1032123,
  },
];
