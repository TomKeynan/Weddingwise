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

const initialArray = Array.from({ length: 15 }, () => 0);

export default function QuestionsContextProvider({ children }) {
  const { sendData, resData, loading } = useFetch();
  const { userData, updateUserData } = useContext(AppContext);
  const [coupleAnswers, setCoupleAnswers] = useState(initialArray);
  const navigate = useNavigate();

  useEffect(() => {
    if (resData) {
      updateUserData(resData);
      navigate("/package");
    }
  }, [resData]);

  function onSelectOption(activePage, optionValue) {
    const updatedArray = [...coupleAnswers];
    updatedArray[activePage] = Number(optionValue);
    setCoupleAnswers([...updatedArray]);
  }

  function handleCreateNewPackage() {
    const newUserData = capitalizeKeys(userData);
    console.log(newUserData);
    sendData("/Packages/getPackage", "POST", {
      couple: {
        Email: "eti@gmail.com",
        Partner1Name: "אתי",
        Partner2Name: "יוסי",
        DesiredDate: "2024-08-10",
        DesiredRegion: "חדרה",
        Budget: 200000,
        NumberOfInvitees: 300,
      },
      questionnaireAnswers: coupleAnswers,
    });
  }
  // function handleCreateNewPackage() {
  //   const newUserData = capitalizeKeys(userData);
  //   console.log(newUserData);
  //   sendData("/Packages/getPackage", "POST", {
  //     couple: userData,
  //     questionnaireAnswers: coupleAnswers,
  //   });
  // }

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
