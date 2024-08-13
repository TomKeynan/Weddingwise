import React, { useState, createContext, useContext, useEffect } from "react";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
import { capitalizeKeys } from "../utilities/functions";
import { useNavigate } from "react-router-dom";

export const QuestionsContext = createContext({
  isLoading: false,
  error: null,
  setError: () => {},
  handleCreateNewPackage: () => {},
});

export default function QuestionsContextProvider({ children }) {
  const { resData, loading, sendData, error, setError } = useFetch();
  const { coupleData, updateOfferedPackage, coupleAnswers, setCoupleAnswers } =
    useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (resData) {
      setCoupleAnswers(Array.from({ length: 15 }, () => 0));
      updateOfferedPackage(resData);
      navigate("/package");
    }
  }, [resData]);

  function handleCreateNewPackage() {
    const coupleDataCopy = JSON.parse(JSON.stringify(coupleData));
    coupleDataCopy.numberOfInvitees = parseInt(coupleDataCopy.numberOfInvitees);
    coupleDataCopy.budget = parseInt(coupleDataCopy.budget);

    let newUserData = capitalizeKeys(coupleDataCopy);
    sendData("/Packages/getPackage", "POST", {
      couple: newUserData,
      questionnaireAnswers: coupleAnswers,
    });
  }

  const questionsCtx = {
    isLoading: loading,
    error,
    setError,
    handleCreateNewPackage,
  };

  return (
    <QuestionsContext.Provider value={questionsCtx}>
      {children}
    </QuestionsContext.Provider>
  );
}
