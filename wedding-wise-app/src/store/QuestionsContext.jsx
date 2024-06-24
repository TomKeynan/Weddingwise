import React, { useState, createContext, useContext, useEffect } from "react";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
import { capitalizeKeys } from "../utilities/functions";
import { useNavigate } from "react-router-dom";

export const QuestionsContext = createContext({
  isLoading: false,
  coupleAnswers: [],
  onSelectOption: () => {},
  handleCreateNewPackage: () => {},
});

const initialArray = Array.from({ length: 15 }, () => 4);

export default function QuestionsContextProvider({ children }) {
  const { sendData, resData, loading } = useFetch();
  const { coupleData, updateCoupleData } = useContext(AppContext);
  const [coupleAnswers, setCoupleAnswers] = useState(initialArray);
  const navigate = useNavigate();

  useEffect(() => {
    if (resData) {
      updateCoupleData(resData);
      navigate("/package");
    }
  }, [resData]);

  function onSelectOption(activePage, optionValue) {
    const updatedArray = [...coupleAnswers];
    updatedArray[activePage] = Number(optionValue);
    setCoupleAnswers([...updatedArray]);
  }

  function handleCreateNewPackage() {
    let newUserData = capitalizeKeys(coupleData);
    sendData("/Packages/getPackage", "POST", {
      couple: newUserData,
      questionnaireAnswers: coupleAnswers,
    });
  }

  const questionsCtx = {
    isLoading: loading,
    coupleAnswers,
    onSelectOption,
    handleCreateNewPackage,
  };

  return (
    <QuestionsContext.Provider value={questionsCtx}>
      {children}
    </QuestionsContext.Provider>
  );
}
