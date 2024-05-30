import React, { createContext, useContext, useEffect, useState } from "react";
import { VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
import { SelectAllOutlined } from "@mui/icons-material";
// import useFetch from "../utilities/useFetch";

export const RegisterContext = createContext({
  userDetails: {},
  editValue: {},
  date: "",
  error: null,
  loading: false,
  updateUserDetails: () => {},
  updateEditValue: () => {},
  saveDateValue: () => {},
  isFormCompleted: () => {},
  isFormValid: () => {},
  handleSubmit: () => {},
});
export default function RegisterContextProvider({ children }) {
  const initialValues = JSON.parse(sessionStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const { sendData, resData, error, loading } = useFetch();
 

  const { updateCoupleData } = useContext(AppContext);

  useEffect(() => {
    if (resData) {
      updateCoupleData(resData);
      navigate("/profile");
    }
  }, [resData]);

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    partner1Name: "",
    partner2Name: "",
    PhoneNumber: "000",
    desiredDate: "",
    desiredRegion: "",
    budget: "",
    numberOfInvitees: "",
    relationship: "",
  });

  const [editValue, setEditValue] = useState(initialValues);

  const todayDate = new Date().toLocaleDateString();
  const [dateValue, setDateValue] = useState(todayDate);

  function updateUserDetails(currentInput) {
    setUserDetails((prevData) => {
      return { ...prevData, ...currentInput };
    });
  }

  function updateEditValue(currentInput) {
    setEditValue((prevData) => {
      return { ...prevData, ...currentInput };
    });
  }

  //checks if all fields has been filled by the user.
  function isFormCompleted(userDetails) {
    const keys = Object.keys(userDetails);
    //result is counting how many fields still empty
    const result = keys.reduce((acc, currentKey) => {
      if (userDetails[currentKey] === "") return (acc += 1);
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
    sendData("/Couples/registerCouple", "POST", userDetails);
  }

  const registerCtx = {
    userDetails,
    editValue,
    date: dateValue,
    error,
    loading,
    updateUserDetails,
    updateEditValue,
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
