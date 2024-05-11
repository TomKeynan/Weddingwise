import { VALIDATIONS } from "./collections";

//generic validation function
export function validationCheck(event) {
  const currentInput = { [event.target.name]: event.target.value };
  const key = Object.keys(currentInput)[0];

  if (VALIDATIONS[key].regex.test(currentInput[key]))
    return { name: key, isValid: true, validMsg: VALIDATIONS[key].valid };
  else return { name: key, isValid: false, errorMsg: VALIDATIONS[key].error };
}

export function handleDataTimeFormat(dateOriginalString) {
  const indexOfT = dateOriginalString.indexOf("T");
  let newDateString = "";
  if (indexOfT !== -1) {
    newDateString = dateOriginalString.slice(0, indexOfT);
  } else return console.log("something went wrong- T was not found");
  const parts = newDateString.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function getFullDate(input) {
  const date = new Date(input);
  const fullDate = `${date.getFullYear()}-${addZero(
    date.getMonth() + 1
  )}-${addZero(date.getDate())}`;
  return { DesiredDate: fullDate };
}

function addZero(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}
