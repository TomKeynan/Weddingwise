import React, { useEffect, useState, createContext } from "react";
import { DateClientFormat } from "../utilities/functions";

export const AppContext = createContext({
  coupleData: {},
  setCoupleData: () => {},
  updateCoupleData: () => {},
  invitees: [],
  setInvitees: () => {},
  addInvitee: () => {},
  removeInvitee: () => {},
});

export default function AppContextProvider({ children }) {
  const [coupleData, setCoupleData] = useState(null);
  const [invitees, setInvitees] = useState([]);

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

  function addInvitee(invitee) {
    setInvitees(prevInvitees => [...prevInvitees, invitee]);
  }

  function removeInvitee(index) {
    setInvitees(prevInvitees => prevInvitees.filter((_, i) => i !== index));
  }

  const appContext = {
    coupleData,
    updateCoupleData,
    setCoupleData,
    invitees,
    setInvitees,
    addInvitee,
    removeInvitee,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
