import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { DateClientFormat } from "../utilities/functions";

export const AppContext = createContext({
  coupleData: {},
  setCoupleData: () => {},
  updateCoupleData: () => {},
});

export default function AppContextProvider({ children }) {
  const [coupleData, setCoupleData] = useState(null);

  useEffect(() => {
    setCoupleData(JSON.parse(sessionStorage.getItem("currentUser")));
  }, []);

  function updateCoupleData(data) {
    if (data) {
      const formattedDate = DateClientFormat(data.desiredDate);
      data.desiredDate = formattedDate;
      delete data.password;
      sessionStorage.setItem("currentUser", JSON.stringify(data));
      setCoupleData({ ...data });
    }
  }

  const appContext = {
    coupleData,
    updateCoupleData,
    setCoupleData,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
