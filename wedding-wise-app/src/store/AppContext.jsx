import React, { useState } from "react";
import { createContext } from "react";
import { handleDataTimeFormat } from "../utilities/functions";

export const AppContext = createContext({
  userData: {},
  updateUserData: () => {},
});

export default function AppContextProvider({ children }) {
  const [userData, setUserData] = useState({});

  function updateUserData(data) {
    if (data) {
      const formattedDate = handleDataTimeFormat(data.desiredDate);
      data.desiredDate = formattedDate;
      setUserData({ ...data });
      sessionStorage.setItem("currentUser", JSON.stringify(data));
    }
  }

  const appContext = {
    userData,
    updateUserData,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
