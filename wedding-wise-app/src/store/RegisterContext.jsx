import React, { createContext, useContext, useEffect, useState } from "react";
import { VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
// import useFetch from "../utilities/useFetch";

export const RegisterContext = createContext({
  userDetails: {},
  date: "",
  error: null,
  loading: false,
  updateUserDetails: () => {},
  saveDateValue: () => {},
  isFormCompleted: () => {},
  isFormValid: () => {},
  handleSubmit: () => {},
});

export default function RegisterContextProvider({ children }) {
  const navigate = useNavigate();

  const { sendData, resData, error, loading } = useFetch();

  const { updateUserData } = useContext(AppContext);

  useEffect(() => {
    if (resData) {
      updateUserData(resData);
      navigate("/profile");
    }
  }, [resData]);

  const [userDetails, setUserDetails] = useState({
    Email: "",
    Password: "",
    Partner1Name: "",
    Partner2Name: "",
    PhoneNumber: "000",
    DesiredDate: "",
    DesiredRegion: null,
    Budget: "",
    NumberOfInvitees: "",
    Relationship: "",
  });

  const todayDate = new Date().toLocaleDateString();
  const [dateValue, setDateValue] = useState(todayDate);

  function updateUserDetails(currentInput) {
    setUserDetails((prevData) => {
      return { ...prevData, ...currentInput };
    });
  }


  //checks if all fields has been filled by the user.
  function isFormCompleted(userDetails) {
    const keys = Object.keys(userDetails);
    //result is counting how many fields still empty
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
    //result is counting how many fields passed test validation.
    const result = filteredKeys.reduce((acc, currentKey) => {
      if (VALIDATIONS[currentKey].regex.test(userDetails[currentKey]))
        return (acc += 1);
      else return acc;
    }, 0);
    return result === filteredKeys.length;
  }

  function saveDateValue(dateInput) {
    setDateValue(dateInput);
  }

  function handleSubmit() {
    delete userDetails.Relationship;
    console.log(userDetails);
    sendData("/Couples/registerCouple", "POST", userDetails);
  }

  const registerCtx = {
    userDetails,
    date: dateValue,
    error,
    loading,
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
