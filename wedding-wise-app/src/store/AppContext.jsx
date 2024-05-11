import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { handleDataTimeFormat } from "../utilities/functions";
import useFetch from "../utilities/useFetch";

export const AppContext = createContext({
  userData: {},
  updateUserData: () => { },
});

// const INITIAL_STATE = JSON.parse(sessionStorage.getItem("currentUser"));
export default function AppContextProvider({ children }) {
  
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem("currentUser")));
  }, []);
  // console.log(userData);

  function updateUserData(data) {
    if (data) {
      const formattedDate = handleDataTimeFormat(data.desiredDate);
      data.desiredDate = formattedDate;
      delete data.password;
      sessionStorage.setItem("currentUser", JSON.stringify(data));
      setUserData({ ...data });
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
