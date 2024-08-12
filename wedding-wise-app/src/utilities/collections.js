export const VALIDATIONS = Object.freeze({
  partner1Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  partner2Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  numberOfInvitees: {
    regex: /^(8[0-9]|[1-7][0-9]{2}|800)$/,
    error: "ניתן להכניס כמות בין 80 ל-800",
    valid: "כמות המוזמנים נעה בין 80 ל-800",
  },
  budget: {
    regex: /^$|^[1-9]\d{5,}$/,
    error: "יש להכניס סכום מעל 100,000 ₪",
    valid: "ציינו סכום מקסימלי (לפחות 100,000 ₪)",
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

export const signupCoupleValidations = Object.freeze({
  partner1Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  partner2Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  numberOfInvitees: {
    regex: /^(8[0-9]|[1-7][0-9]{2}|800)?$/,
    error: "ניתן להכניס כמות בין 80 ל-800",
    valid: "כמות המוזמנים נעה בין 80 ל-800",
  },
  budget: {
    regex: /^$|^[1-9]\d{5,}$/,
    error: "יש להכניס סכום מעל 100,000 ₪",
    valid: "ציינו סכום מקסימלי (לפחות 100,000 ₪)",
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

export const editCoupleValidations = Object.freeze({
  partner1Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  partner2Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  numberOfInvitees: {
    regex: /^(8[0-9]|[1-7][0-9]{2}|800)$/,
    error: "יש להכניס כמות בין 80 ל-800",
    valid: "כמות המוזמנים נעה בין 80 ל-800",
  },
  budget: {
    regex: /^$|^[1-9]\d{5,}$/,
    error: "יש להכניס סכום מעל 100,000 ₪",
    valid: "ציינו סכום מקסימלי (לפחות 100,000 ₪)",
  },
  email: {
    regex: /^$|^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    error: "שדה לא חוקי. אנא בדק שנית את כתובת המייל שהזנת",
    valid: "",
  },
  password: {
    regex: /^$|^.{6,}$/,
    error: "שדה הסיסמא חייב להכיל לפחות 6 תווים",
    valid: "",
  },
});

export const signupSupplierValidations = Object.freeze({
  businessName: {
    regex: /^.{2,30}$/,
    error: "שם העסק חייב להכיל לפחות 2 תווים",
  },
  phoneNumber: {
    regex: /^\d{9,10}$/,
    error: "ניתן להכניס מספר בין 9 עד 10 ספרות",
  },
  venueAddress: {
    regex: /[0-9,\p{Hebrew}\p{Pd}\s]/,
    error: "שם העסק חייב להכיל לפחות 5 תווים",
  },
  capacity: {
    regex: /^$|^[1-9]\d{2,}$/,
    error: "יש להכניס רק מספרים",
    // valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  price: {
    regex: /^\d{3,6}$/,
    error: "יש להכניס רק מספרים",
    // valid: "ציינו סכום מקסימלי (לפחות 100,000)",
  },
  description: {
    regex: /^.{5,}$/,
    error: "תיאור חייב להכיל לפחות 5 תווים",
  },
  password: {
    regex: /^.{6,}$/,
    error: "שדה הסיסמא חייב להכיל לפחות 6 תווים",
    valid: "",
  },
});

export const editSupplierValidations = Object.freeze({
  businessName: {
    regex: /^.{2,30}$/,
    error: "שם העסק חייב להכיל לפחות 2 תווים",
  },
  phoneNumber: {
    regex: /^\d{9,10}$/,
    error: "ניתן להכניס מספר בין 9 עד 10 ספרות",
    // valid: "ציינו סכום מקסימלי (לפחות 100,000)",
  },
  venueAddress: {
    regex: /[0-9,\p{Hebrew}\p{Pd}\s]/,
    error: "שם העסק חייב להכיל לפחות 5 תווים",
  },
  capacity: {
    regex: /^$|^[1-9]\d{2,}$/,
    error: "יש להכניס רק מספרים",
    // valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  price: {
    regex: /^\d{3,6}$/,
    error: "יש להכניס רק מספרים",
    // valid: "ציינו סכום מקסימלי (לפחות 100,000)",
  },
  description: {
    regex: /^.{5,}$/,
    error: "תיאור חייב להכיל לפחות 5 תווים",
  },
  password: {
    regex: /^$|^.{6,}$/,
    error: "שדה הסיסמא חייב להכיל לפחות 6 תווים",
    valid: "",
  },
});

export const inviteesValidations = Object.freeze({
  name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "יש להקליד אותיות בלבד",
  },
  email: {
    regex: /^\d{9,10}$/,
    error: "ניתן להכניס מספר בין 9 עד 10 ספרות",
    // regex: /^$|^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    // error: "אנא בדק שנית את כתובת המייל שהזנת",
  },
  numberOfInvitees: {
    regex: /^(1[0-9]|20|[1-9])$/,
    error: "מקסימום 20 מוזמנים לאורח",
  },
});

export const expensesValidations = Object.freeze({
  serviceName: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "יש להקליד אותיות בלבד",
  },
  sponsorName: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "יש להקליד אותיות בלבד",
  },
  totalCost: {
    regex: /^(0*[1-9]\d*)$/,
    error: "עלות השירות חייב להיות יותר מ-0 ₪",
  },
  downPayment: {
    regex: /^(0*[1-9]\d*)$/,
    error: " המקדמה חייבת להיות יותר מ-0 ₪",
  },
});

export const supplierTypes = [
  "אולם שמחות",
  "דיי ג'יי",
  "צילום אירועים",
  "עיצוב שמלות",
  "איפור כלות",
  "רב / עורך טקסים",
];

export const loginResponse = Object.freeze({
  200: "הצלחה",
  400: "אופס! משהו השתבש , נסה שנית.",
  401: "משתמש זה אינו פעיל",
  404: "סיסמא או אימייל אינם נכונים",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const signupResponse = Object.freeze({
  200: "הצלחה",
  400: "אופס! משהו השתבש , נסה שנית.",
  401: "משתמש זה אינו פעיל",
  404: "סיסמא או אימייל אינם נכונים",
  409: "כתובת המייל שהזנת כבר רשומה במערכת. אנא הזן כתובת חדשה",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const signupSupplierErrors = Object.freeze({
  200: "מיד תועבר לפרופיל החדש שלך!",
  400: "אופס! משהו השתבש , נסה שנית.",
  401: "משתמש זה אינו פעיל",
  404: "סיסמא או אימייל אינם נכונים.",
  409: "כתובת המייל שהזנת כבר רשומה במערכת. אנא הזן כתובת חדשה",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const insertPackageResponse = Object.freeze({
  200: "🎊 יש לכם נבחרת של נותני שירות מעולים במיוחד עבורכם👏🏼👏🏼 החתונה שלכם קרובה מתמיד🎉 אתם עכשיו מוזמנים ליצור קשר עם הספקים שבחרתם דרך הצ'אט",
  204: "חבילת נותני השירות שלכם עודכנה בהצלחה, אנו שמחים שהצלחתם למצוא את רשימת הספקים המתאימה עבורכם. אתם עכשיו מוזמנים ליצור קשר עם הספקים שבחרתם דרך הצ'אט!",
  400: "אופס! משהו השתבש, נסה שנית.",
  409: "אישור חבילה חדשה, דורש החלפה של נותן שירות אחד או יותר.",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const updateCoupleDetailsResponse = Object.freeze({
  204: "פרטי החתונה החדשים שהזנתם עודכנו בהצלחה.",
  400: "אופס! משהו השתבש, נסה שנית.",
  404: " נראה שהפרטים שמסרתם לא הניבו חבילת נותני שירות מתאימה. אנא הזינו פרטים חדשים",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const rateSupplierResponse = Object.freeze({
  400: "אופס! משהו השתבש, נסה שנית.",
  409: "נראה שכבר הוספת תגובה ודירוג בעבר, תודה בכל מקרה",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const taskSettings = [
  { id: 1, text: "הערות" },
  { id: 2, text: "מחק משימה" },
];

export const regions = [
  "",
  "רמת הגולן",
  "הגליל",
  "חיפה",
  "העמקים",
  "חדרה",
  "זכרון יעקב",
  "השרון",
  "ירושלים",
  "יהודה ושומרון ובקעת הירדן",
  "באר שבע וצפון הנגב",
  "אילת",
  "תל אביב וגוש דן",
];

export const questionsArray = [
  {
    title: "אולם יוקרתי או תקליטן מוכשר",
    options: { supplier_1: "אולם", supplier_2: "תקליטן" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/dj/dj-gray.png",
  },
  {
    title: "אולם יוקרתי או צלם מצוין",
    options: { supplier_1: "אולם", supplier_2: "צלם" },
    sticker_1: "assets/graphics/venue/venue-gray.png",
    sticker_2: "assets/graphics/photographer/camera-orange.png",
  },
  {
    title: "אולם יוקרתי או מעצב/ת שמלות כלה מפורסמת",
    options: { supplier_1: "אולם", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/dress/dress-gray.png",
  },
  {
    title: "אולם יוקרתי או רב מוערך",
    options: { supplier_1: "אולם", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/venue/venue-gray.png",
    sticker_2: "assets/graphics/rabbi/rabbi-orange.png",
  },
  {
    title: "אולם יוקרתי או אמנ/ית איפור מקצועית",
    options: { supplier_1: "אולם", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/venue/venue-orange.png",
    sticker_2: "assets/graphics/makeup/makeup-gray.png",
  },
  {
    title: "תקליטן מוכשר או צלם מצוין",
    options: { supplier_1: "תקליטן", supplier_2: "צלם" },
    sticker_1: "assets/graphics/dj/dj-gray.png",
    sticker_2: "assets/graphics/photographer/camera-orange.png",
  },
  {
    title: "תקליטן מוכשר או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "תקליטן", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/dj/dj-orange.png",
    sticker_2: "assets/graphics/dress/dress-gray.png",
  },
  {
    title: "תקליטן מוכשר או רב מוערך",
    options: { supplier_1: "תקליטן", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/dj/dj-gray.png",
    sticker_2: "assets/graphics/rabbi/rabbi-orange.png",
  },
  {
    title: "תקליטן מוכשר או אמנ/ית איפור מקצועית",
    options: { supplier_1: "תקליטן", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/dj/dj-orange.png",
    sticker_2: "assets/graphics/makeup/makeup-gray.png",
  },
  {
    title: "צלם מצוין או מעצבת שמלות כלה מפורסמת",
    options: { supplier_1: "צלם", supplier_2: "מעצב/ת שמלות" },
    sticker_1: "assets/graphics/photographer/camera-gray.png",
    sticker_2: "assets/graphics/dress/dress-orange.png",
  },
  {
    title: "צלם מצוין או רב מוערך",
    options: { id: 1, supplier_1: "צלם", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/photographer/camera-orange.png",
    sticker_2: "assets/graphics/rabbi/rabbi-gray.png",
  },
  {
    title: "צלם מצוין או אמנית איפור מקצועית",
    options: { supplier_1: "צלם", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/photographer/camera-gray.png",
    sticker_2: "assets/graphics/makeup/makeup-orange.png",
  },
  {
    title: "מעצבת שמלות כלה מפורסמת או רב מוערך",
    options: { supplier_1: "מעצב/ת שמלות", supplier_2: "רב/עורך טקסים" },
    sticker_1: "assets/graphics/dress/dress-orange.png",
    sticker_2: "assets/graphics/rabbi/rabbi-gray.png",
  },
  {
    title: "מעצבת שמלות כלה מפורסמת או אמנית איפור מקצועית",
    options: { supplier_1: "מעצב/ת שמלות", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/dress/dress-gray.png",
    sticker_2: "assets/graphics/makeup/makeup-orange.png",
  },
  {
    title: "רב מוערך או אמנית איפור מקצועית ",
    options: { supplier_1: "רב/עורך טקסים", supplier_2: "אמנ/ית איפור" },
    sticker_1: "assets/graphics/rabbi/rabbi-orange.png",
    sticker_2: "assets/graphics/makeup/makeup-gray.png",
  },
];

export const stickers = [
  {
    stickerSrc: "assets/graphics/venue/venue-orange.png",
    stickerAlt: "אולם",
  },
  {
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "תקליטן",
  },
  {
    stickerSrc: "assets/graphics/photographer/camera-orange.png",
    stickerAlt: "צלם",
  },
  {
    stickerSrc: "assets/graphics/dress/dress-gray.png",
    stickerAlt: "שמלה",
  },
  {
    stickerSrc: "assets/graphics/rabbi/rabbi-orange.png",
    stickerAlt: "עורכי טקסים",
  },
  {
    stickerSrc: "assets/graphics/makeup/makeup-gray.png",
    stickerAlt: "איפור",
  },
];

