import React, { useState, createContext, useContext, useEffect } from "react";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
import { capitalizeKeys } from "../utilities/functions";
import { useNavigate } from "react-router-dom";

export const QuestionsContext = createContext({
  isLoading: false,
  coupleAnswers: [],
  error: null,
  setError: () => {},
  onSelectOption: () => {},
  handleCreateNewPackage: () => {},
});

const initialArray = Array.from({ length: 15 }, () => 3);

export default function QuestionsContextProvider({ children }) {
  const { resData, loading, sendData, error, setError } = useFetch();
  const { coupleData, updateOfferedPackage } = useContext(AppContext);
  const [coupleAnswers, setCoupleAnswers] = useState(initialArray);
  const navigate = useNavigate();

  useEffect(() => {
    if (resData) {
      updateOfferedPackage(resData);
      navigate("/package");
    }
  }, [resData]);

  function onSelectOption(activePage, optionValue) {
    const updatedArray = [...coupleAnswers];
    updatedArray[activePage] = Number(optionValue);
    setCoupleAnswers([...updatedArray]);
  }

  function handleCreateNewPackage() {
    console.log(coupleData);
    const coupleDataCopy = JSON.parse(JSON.stringify(coupleData));
    coupleDataCopy.numberOfInvitees = parseInt(coupleDataCopy.numberOfInvitees);
    coupleDataCopy.budget = parseInt(coupleDataCopy.budget);
    console.log(coupleDataCopy);

    let newUserData = capitalizeKeys(coupleDataCopy);
    sendData("/Packages/getPackage", "POST", {
      couple: newUserData,
      questionnaireAnswers: coupleAnswers,
    });
  }

  const questionsCtx = {
    isLoading: loading,
    coupleAnswers,
    error,
    setError,
    onSelectOption,
    handleCreateNewPackage,
  };

  return (
    <QuestionsContext.Provider value={questionsCtx}>
      {children}
    </QuestionsContext.Provider>
  );
}
