import React, { useState } from "react";
import { createContext } from "react";
import { VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import { Api } from "../utilities/fetchData";

export const AppContext = createContext({
  userData: {},
  updateUserData: () => {},
  // loading: false,
  // setLoading: () => {},
});

export default function AppContextProvider({ children }) {
  const [userData, setUserData] = useState({
    isLogin: false,
    userType: null,
    package: null,
  });

  // const Api = new ApiClass(false);
  

  // const [loading, setLoading] = useState(false);

  function updateUserData(data) {
    setUserData((prevData) => {
      return { ...prevData, ...data };
    });
  }
  // console.log(userData);

  const appContext = {
    userData,
    updateUserData,
    // loading,
    // Api,
    // setLoading,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
