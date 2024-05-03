import React, { createContext, useContext, useState } from "react";
import { VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export const RegisterContext = createContext({
  userDetails: {},
  date: "",
  updateUserDetails: () => {},
  saveDateValue: () => {},
  isFormCompleted: () => {},
  isFormValid: () => {},
  handleSubmit: () => {},
});

export default function RegisterContextProvider({ children }) {
  const navigate = useNavigate();
  const { updateUserData } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState({
    kind: "",
    numOfGuests: "",
    budget: "",
    region: null,
    weddingDate: "",
    groomName: "",
    brideName: "",
    email: "",
    password: "",
  });

  const todayDate = new Date().toLocaleDateString();
  const [dateValue, setDateValue] = useState(todayDate);

  function updateUserDetails(currentInput) {
    console.log(currentInput);
    setUserDetails((prevData) => {
      return { ...prevData, ...currentInput };
    });
  }

  //checks if all fields has been filled by the user.
  function isFormCompleted(userDetails) {
    const keys = Object.keys(userDetails);
    const result = keys.reduce((acc, currentKey) => {
      if (userDetails[currentKey] === "" || userDetails[currentKey] === null)
        return (acc += 1);
      else return acc;
    }, 0);

    return result === 0;
  }

  // filter all fields that don't need to pass validation check.
  function filterNonRequiredFields() {
    const keys = Object.keys(userDetails);
    const filteredKeys = keys.filter((key) => {
      if (VALIDATIONS.hasOwnProperty(key)) return key;
    });
    return filteredKeys;
  }

  // checks if all fields are valid.
  function isFormValid(userDetails) {
    const filteredKeys = filterNonRequiredFields();
    const result = filteredKeys.reduce((acc, currentKey) => {
      if (VALIDATIONS[currentKey].regex.test(userDetails[currentKey]))
        return (acc += 1);
      else return acc;
    }, 0);
    return result === filteredKeys.length;
  }

  // this function gets executed only after all fields pass validation
  function handleSubmit() {
    updateUserData(userDetails);
    sessionStorage.clear();
    sessionStorage.setItem("currentUser", JSON.stringify(userDetails));
    navigate("/profile");
  }

  function saveDateValue(dateInput) {
    setDateValue(dateInput);
  }

  const registerCtx = {
    userDetails,
    date: dateValue,
    updateUserDetails,
    saveDateValue,
    isFormCompleted,
    isFormValid,
    handleSubmit,
  };

  return (
    <RegisterContext.Provider value={registerCtx}>
      {children}
    </RegisterContext.Provider>
  );
}
