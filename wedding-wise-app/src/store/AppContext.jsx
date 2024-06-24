import React, { useEffect, useState, createContext } from "react";
import { DateClientFormat } from "../utilities/functions";

export const AppContext = createContext({
  coupleData: {},
  offeredPackage: {},
  setCoupleData: () => {},
  setOfferedPackage: () => {},
  updateCoupleData: () => {},
  invitees: [],
  setInvitees: () => {},
  addInvitee: () => {},
  removeInvitee: () => {},
});

export default function AppContextProvider({ children }) {
  const [coupleData, setCoupleData] = useState(null);

  const [offeredPackage, setOfferedPackage] = useState(null);

  const [invitees, setInvitees] = useState([]);

  useEffect(() => {
    setCoupleData(JSON.parse(sessionStorage.getItem("currentCouple")));
    setOfferedPackage(JSON.parse(localStorage.getItem("offeredPackage")));
  }, []);

  function updateCoupleData(data) {
    if (data.package !== null) {
      const packageAndTypeWeights = {
        ...data.package,
        typeWeights: data.typeWeights,
      };
      localStorage.setItem(
        "offeredPackage",
        JSON.stringify(packageAndTypeWeights)
      );
      setOfferedPackage(packageAndTypeWeights);
    }
    sessionStorage.setItem("currentCouple", JSON.stringify(data));
    setCoupleData({ ...data });
  }

  function addInvitee(invitee) {
    setInvitees((prevInvitees) => [...prevInvitees, invitee]);
  }

  function removeInvitee(index) {
    setInvitees((prevInvitees) => prevInvitees.filter((_, i) => i !== index));
  }

  const appContext = {
    coupleData,
    offeredPackage,
    updateCoupleData,
    setCoupleData,
    setOfferedPackage,
    invitees,
    setInvitees,
    addInvitee,
    removeInvitee,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
