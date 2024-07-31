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
    regex: /^$|^[1-9]\d{2,}$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  budget: {
    regex: /^$|^[1-9]\d{5,}$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו סכום מקסימלי (לפחות 100,000)",
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
  businessName: {
    regex: /^.{2,30}$/,
    error: "שם העסק חייב להכיל לפחות 2 תווים",
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
  phoneNumber: {
    regex: /^\d{9,10}$/,
    error: "ניתן להכניס מספר בין 9 עד 10 ספרות",
    // valid: "ציינו סכום מקסימלי (לפחות 100,000)",
  },
  Password: {
    regex: /^.{5,}$/,
    error: "שדה הסיסמא חייב להכיל לפחות 6 תווים",
    valid: "",
  },
  supplierEmail: {
    regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    error: "אנא בדק שנית את כתובת המייל שהזנת",
    valid: "",
  },
  capacity: {
    regex: /^\d{2,4}$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  venueAddress: {
    regex: /^.{5,30}$/,
    error: "שם העסק חייב להכיל לפחות 5 תווים",
  },
});

// export const supplierTypes = [
//   "venue",
//   "dj",
//   "photographer",
//   "dress",
//   "rabbi",
//   "hair and makeup"
// ];

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
  404: "סיסמא או אימייל אינם נכונים.",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const signupResponse = Object.freeze({
  200: "הצלחה",
  400: "אופס! משהו השתבש , נסה שנית.",
  401: "משתמש זה אינו פעיל",
  404: "סיסמא או אימייל אינם נכונים.",
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
  200: "🎊יש לכם נבחרת של נותני שירות מעולים במיוחד עבורכם👏🏼👏🏼 החתונה שלכם קרובה מתמיד🎉",
  204: "חבילת נותני השירות שלכם עודכנה בהצלחה, אנו שמחים שהצלחתם למצוא את רשימת הספקים המתאימה עבורכם. אתם עכשיו מוזמנים ליצור קשר עם הספקים שבחרתם דרך הצ'אט!",
  400: "אופס! משהו השתבש, נסה שנית.",
  409: "אישור חבילה חדשה, דורש החלפה של נותן שירות אחד או יותר.",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const updateCoupleDetailsResponse = Object.freeze({
  204: "פרטי החתונה החדשים שהזנתם עודכנו בהצלחה.",
  400: "אופס! משהו השתבש, נסה שנית.",
  404: "אופס! משהו השתבש, נסה שנית.",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const rateSupplierResponse = Object.freeze({
  400: "אופס! משהו השתבש, נסה שנית.",
  409: "נראה שכבר הוספת תגובה ודירוג בעבר, תודה בכל מקרה",
  500: "אופס! משהו השתבש , נסה שנית.",
});

export const carouselTheme = Object.freeze({
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 800 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
});

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

export const supplierCards = [
  {
    imageSrc: "./assets/suppliers_pics/venue1.png",
    imageAlt: "אולם חתונות החן",
    stickerSrc: "assets/graphics/venue/venue-orange.png",
    stickerAlt: "אייקון של אולם",
    name: "אולם חתונות החן",
    phone: "055-265-9832",
    email: "nbrgtprt@example.com",
    price: "167900",
  },
  {
    imageSrc: "./assets/suppliers_pics/supplier-dj.png",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/dj/dj-gray.png",
    stickerAlt: "אייקון של",
    name: "יוחאי גלאס",
    phone: "055-265-9832",
    email: "yohai@gmail.com",
    price: "10,000",
  },
  {
    imageSrc: "./assets/suppliers_pics/photo4.jpg",
    imageAlt: "תמונה של צלם",
    stickerSrc: "assets/graphics/photographer/camera-orange.png",
    stickerAlt: "אייקון של",
    name: "צלם שטיין",
    phone: "096301598",
    email: "shyly24@example.com",
    price: "11700",
  },
  {
    imageSrc: "./assets/suppliers_pics/dress1.png",
    imageAlt: "תמונה של מעצבת שמלות",
    stickerSrc: "assets/graphics/dress/dress-gray.png",
    stickerAlt: "אייקון של",
    name: "גאנם שמלות",
    phone: "04-3975424",
    email: "rkhmym@example.net",
    price: "5,500",
  },
  {
    imageSrc: "assets/suppliers_pics/rabbi1.jpeg",
    imageAlt: "תמונה של רב",
    stickerSrc: "assets/graphics/rabbi/rabbi-orange.png",
    stickerAlt: "אייקון של",
    name: "הרב יצחק",
    phone: "02-5637-300",
    email: "mrhlyn@example.org",
    price: "1700",
  },
  {
    imageSrc: "assets/suppliers_pics/Makeup1.jpeg",
    imageAlt: "תמונה של תקליטן",
    stickerSrc: "assets/graphics/makeup/makeup-gray.png",
    stickerAlt: "אייקון של",
    name: "אברמוב איפור ושיער",
    phone: "054-3629005",
    email: "oshytryt@example.com",
    price: "2900",
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
export const taskListDefault = [
  {
    title: "יצירת רשימת מוזמנים",
    notes: "",
    completed: false,
    subtasks: [
      {
        title: "הוספת משפחה",
        completed: false,
      },
      {
        title: "הוספת חברים",
        completed: false,
      },
    ],
  },
  {
    title: "בחירת תאריך",
    notes: "",
    completed: false,
    subtasks: [],
  },
  {
    title: "פתיחת חשבון בנק משותף",
    notes: "",
    completed: false,
    subtasks: [],
  },
  {
    title: "בחירת ספקים",
    notes: "",
    completed: false,
    subtasks: [
      {
        title: "מילוי שאלון העדפות",
        completed: false,
      },
      {
        title: " מילוי שאלון העדפות",
        completed: false,
      },
      {
        title: " אישור חבילה מוצעת",
        completed: false,
      },
    ],
  },
  {
    title: "יצירת סידור הושבה",
    notes: "",
    completed: false,
    subtasks: [],
  },
  {
    title: "שליחת שמרו את התאריך",
    notes: "",
    completed: false,
    subtasks: [],
  },
  {
    title: "עיצוב הזמנות לחתונה",
    notes: "",
    completed: false,
    subtasks: [],
  },

  {
    title: "ניהול אישורי הגעה",
    notes: "",
    completed: false,
    subtasks: [],
  },
  {
    title: "מתן ביקורות ספקים",
    notes: "יכולים לעשות רק אחרי האירוע",
    completed: false,
    subtasks: [],
  },
];

export const suppliersImage = {
  venue: [
    "assets/suppliers_pics/venue1.png",
    "assets/suppliers_pics/venue2.png",
    "assets/suppliers_pics/venue3.jpeg",
    "assets/suppliers_pics/venue4.jpeg",
    "assets/suppliers_pics/venue5.jpeg",
    "assets/suppliers_pics/venue6.png",
  ],
  dj: [
    "assets/suppliers_pics/dj1.jpg",
    "assets/suppliers_pics/dj1.jpg",
    "assets/suppliers_pics/DJ2.jpeg",
    "assets/suppliers_pics/dj2.jpg",
    "assets/suppliers_pics/DJ3.jpg",
    "assets/suppliers_pics/DJ5.jpeg",
  ],
  photographer: [
    "assets/suppliers_pics/photographer3.jpeg",
    "assets/suppliers_pics/camera2.jpeg",
    "assets/suppliers_pics/photo1.jpg",
    "assets/suppliers_pics/photo4.jpg",
    "assets/suppliers_pics/camera5.jpeg",
    "assets/suppliers_pics/camera6.jpeg",
  ],
  dress: [
    "assets/suppliers_pics/dress1.png",
    "assets/suppliers_pics/dress2.jpeg",
    "assets/suppliers_pics/dress3.png",
    "assets/suppliers_pics/dress4.png",
    "assets/suppliers_pics/dress5.jpeg",
    "assets/suppliers_pics/dress6.png",
  ],
  rabbi: [
    "assets/suppliers_pics/rabbi1.jpeg",
    "assets/suppliers_pics/rabbi2.jpeg",
    "assets/suppliers_pics/rabbi3.jpeg",
    "assets/suppliers_pics/rabbi4.jpeg",
    "assets/suppliers_pics/rabbi5.jpeg",
    "assets/suppliers_pics/rabbi6.jpeg",
  ],
  "hair and makeup": [
    "assets/suppliers_pics/Makeup1.jpeg",
    "assets/suppliers_pics/Makeup2.png",
    "assets/suppliers_pics/Makeup3.jpeg",
    "assets/suppliers_pics/Makeup4.jpeg",
    "assets/suppliers_pics/Makeup5.jpeg",
    "assets/suppliers_pics/Makeup6.jpeg",
  ],
};
