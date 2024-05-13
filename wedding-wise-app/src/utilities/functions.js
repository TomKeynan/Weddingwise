import { VALIDATIONS } from "./collections";

//generic validation function
export function validationCheck(event) {
  const currentInput = { [event.target.name]: event.target.value };
  const key = Object.keys(currentInput)[0];

  if (VALIDATIONS[key].regex.test(currentInput[key]))
    return { name: key, isValid: true, validMsg: VALIDATIONS[key].valid };
  else return { name: key, isValid: false, errorMsg: VALIDATIONS[key].error };
}

export function DateClientFormat(dateTimeString) {
  const indexOfT = dateTimeString.indexOf("T");
  let newDateString = "";
  if (indexOfT !== -1) {
    newDateString = dateTimeString.slice(0, indexOfT);
  } else return console.log("something went wrong- T was not found");
  const parts = newDateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function dateTimeServerFormat(dateString) {
  const parts = dateString.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
    stickersArray.map((sticker) => {
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
  keys.map((key) => {
    if (key == type) {
      imageSrc = arr[key][Math.floor(Math.random() * 5)];
    }
  });
  return imageSrc;
}
