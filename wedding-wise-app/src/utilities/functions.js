import { VALIDATIONS } from "./collections";

export async function reverseGeocoding(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=he`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
}

export async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&accept-language=he`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: lat, longitude: lon };
    } else {
      return { latitude: null, longitude: null, message: "Address not found" };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { latitude: null, longitude: null, message: "Error fetching coordinates" };
  }
}


//generic validation function
export function validationCheck(event) {
  const currentInput = { [event.target.name]: event.target.value };
  const key = Object.keys(currentInput)[0];

  if (VALIDATIONS[key].regex.test(currentInput[key]))
    return { name: key, isValid: true, validMsg: VALIDATIONS[key].valid };
  else return { name: key, isValid: false, errorMsg: VALIDATIONS[key].error };
}

export function convertDateToClientFormat(dateTimeString) {
  const indexOfT = dateTimeString.indexOf("T");
  let newDateString = "";
  if (indexOfT !== -1) {
    newDateString = dateTimeString.slice(0, indexOfT);
  } else return console.log("something went wrong- T was not found");
  const parts = newDateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function convertDateToDateServerFormat(dateString) {
  const parts = dateString.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
}

export function getFullDate(input) {
  const date = new Date(input);
  const fullDate = `${date.getFullYear()}-${addZero(
    date.getMonth() + 1
  )}-${addZero(date.getDate())}`;
  return { desiredDate: fullDate };
}

function addZero(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

export function getDayWeek(dateString) {
  const date = new Date(dateString);
  const dayOfWeekNumber = date.getDay();
  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
  return dayOfWeekName;
}

export function capitalizeKeys(obj) {
  const newObj = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      newObj[capitalizedKey] = obj[key];
    }
  }
  return newObj;
}

// get executed at UserPackage Component
export function buildTypeWeightsCard(typeWeightsObj, stickersArray) {
  const typeWeightsArray = Object.entries(typeWeightsObj).map(
    ([type, weight]) => {
      if (type === "hair and makeup") {
        type = "makeup";
      }
      return {
        type,
        weight,
      };
    }
  );
  const typeWeightCardsArray = typeWeightsArray.map((item) => {
    stickersArray.forEach((sticker) => {
      if (sticker.stickerSrc.includes(item.type)) {
        item.stickerSrc = sticker.stickerSrc;
        item.stickerAlt = sticker.stickerAlt;
        return;
      }
    });
    return { ...item };
  });
  return typeWeightCardsArray;
}

export function getRandomSupplierImage(arr, type) {
  let imageSrc = "";
  const keys = Object.keys(arr);
  keys.forEach((key) => {
    if (key === type) {
      imageSrc = arr[key][Math.floor(Math.random() * 6)];
    }
  });
  return imageSrc;
}

export function translateSupplierTypeToEnglish(type) {
  let translatedType = "";
  switch (type) {
    case "אולם שמחות":
      translatedType = "venue";
      break;
    case "דיי ג'יי":
      translatedType = "dj";
      break;
    case "צילום אירועים":
      translatedType = "photographer";
      break;
    case "עיצוב שמלות":
      translatedType = "dress";
      break;
    case "רב / עורך טקסים":
      translatedType = "rabbi";
      break;
    case "איפור כלות":
      translatedType = "hair and makeup";
      break;
    default:
      translatedType = "";
  }
  return translatedType;
}

export function translateSupplierTypeToHebrew(type) {
  let translatedType = "";
  switch (type) {
    case "venue":
      translatedType = "אולם שמחות";
      break;
    case "dj":
      translatedType = "דיי ג'יי";
      break;
    case "photographer":
      translatedType = "צילום אירועים";
      break;
    case "dress":
      translatedType = "עיצוב שמלות";
      break;
    case "rabbi":
      translatedType = "רב / עורך טקסים";
      break;
    case "hair and makeup":
      translatedType = "איפור כלות";
      break;
    default:
      translatedType = "";
  }
  return translatedType;
}

export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export function addCommasToNumber(number) {
  // Convert the number to a string
  let numberString = number.toString();
  
  // Use a regular expression to add commas
  let formattedNumber = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return formattedNumber;
}