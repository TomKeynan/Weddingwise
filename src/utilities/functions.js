import { VALIDATIONS } from "./collections";

//generic validation function
export function validationCheck(event) {
  const currentInput = { [event.target.name]: event.target.value };
  const key = Object.keys(currentInput)[0];

  if (VALIDATIONS[key].regex.test(currentInput[key]))
    return { name: key, isValid: true, validMsg: VALIDATIONS[key].valid };
  else return { name: key, isValid: false, errorMsg: VALIDATIONS[key].error };
}


