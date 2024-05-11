import React, { useState, createContext } from "react";
// import { useNavigate } from "react-router-dom";

export const QuestionsContext = createContext({
  userAnswers: [],
  onSelectOption: () => {},
});

const initialArray = Array.from({ length: 15 }, () => 1 );

export default function QuestionsContextProvider({ children }) {
  // const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState(initialArray);

  function onSelectOption(activePage, optionValue) {
    const updatedArray = [...userAnswers];
    updatedArray[activePage] = Number(optionValue)
    setUserAnswers([...updatedArray]);
  }
  // console.log(userAnswers)
  
  const questionsCtx = {
    userAnswers,
    onSelectOption,
  };

  return (
    <QuestionsContext.Provider value={questionsCtx}>
      {children}
    </QuestionsContext.Provider>
  );
}

