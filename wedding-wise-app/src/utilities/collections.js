export const VALIDATIONS = Object.freeze({
  Partner1Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{2,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  Partner2Name: {
    regex: /^$|^[ \u05D0-\u05EAa-zA-Z]{3,}$/,
    error: "שדה לא חוקי. יש להקליד אותיות בלבד.",
    valid: "",
  },
  NumberOfInvitees: {
    regex: /^$|^[1-9]\d{2,}$/,
    // regex: /^$|^[1-9]{3,}\d*$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו כמות המקסימילית (לפחות 100)",
  },
  Budget: {
    regex: /^$|^[1-9]\d{4,}$/,
    // regex: /^$|^[0-9]{5,}\d*$/,
    error: "שדה לא חוקי. יש להכניס רק מספרים.",
    valid: "ציינו סכום מקסימלי (לפחות 10,000)",
  },
  Email: {
    regex: /^$|^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    error: "שדה לא חוקי. אנא בדק שנית את כתובת המייל שהזנת",
    valid: "",
  },
  Password: {
    regex: /^(\s*|\S.{5,})$/,
    error: "שדה לא חוקי. הסיסמא חייב להכיל לפחות 6 תוים",
    valid: "",
  },
});

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

export const supplierCards = [
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
    stickerSrc: "assets/graphics/makeup/makeup-gray.png",
    stickerAlt: "איפור",
  },
  {
    stickerSrc: "assets/graphics/dress/dress-orange.png",
    stickerAlt: "שמלה",
  },
  {
    stickerSrc: "assets/graphics/rabbi/rabbi-gray.png",
    stickerAlt: "עורכי טקסים",
  },
];
export const taskListDefault = [
  {
    title:"יצירת רשימת מוזמנים",
    notes:"",
    completed:false,
    subtasks:[
      {
        title:"הוספת משפחה",
        completed:false
      },
      {
        title:"הוספת חברים",
        completed:false
      }
    ]
  },
  {
    title:"בחירת תאריך",
    notes:"",
    completed:false,
    subtasks:[

    ]
  },
  {
    "title": "פתיחת חשבון בנק משותף",
    "notes": "",
    "completed": false,
    "subtasks": []
  },
  {
    "title": "בחירת ספקים",
    "notes": "",
    "completed": false,
    "subtasks": [ {
      title:"מילוי שאלון העדפות",
      completed:false
    }, 
    {
      title:" מילוי שאלון העדפות",
      completed:false
    },
    {
      title:" אישור חבילה מוצעת",
      completed:false
    },
  ]
  },
  {
    "title": "יצירת סידור הושבה",
    "notes": "",
    "completed": false,
    "subtasks": []
  },
  {
    "title": "שליחת שמרו את התאריך",
    "notes": "",
    "completed": false,
    "subtasks": []
  },
  {
    "title": "עיצוב הזמנות לחתונה",
    "notes": "",
    "completed": false,
    "subtasks": []
  },
  
  {
    "title": "ניהול אישורי הגעה",
    "notes": "",
    "completed": false,
    "subtasks": []
  },
  {
    "title": "מתן ביקורות ספקים",
    "notes": "יכולים לעשות רק אחרי האירוע",
    "completed": false,
    "subtasks": []
  }
];