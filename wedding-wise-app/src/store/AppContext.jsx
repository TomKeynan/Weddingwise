import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext({
  coupleData: {},
  offeredPackage: {},
  setCoupleData: () => {},
  setOfferedPackage: () => {},
  updateCoupleData: () => {},
  updateOfferedPackage: () => {},
  invitees: [],
  setInvitees: () => {},
  addInvitee: () => {},
  removeInvitee: () => {},
});

const initialState = JSON.parse(sessionStorage.getItem("currentCouple"))
export default function AppContextProvider({ children }) {
  
  const [coupleData, setCoupleData] = useState(initialState);
  // const [coupleData, setCoupleData] = useState(null);

  const [offeredPackage, setOfferedPackage] = useState(null);

  const [invitees, setInvitees] = useState([]);

  useEffect(() => {
    // setCoupleData(JSON.parse(sessionStorage.getItem("currentCouple")));
    setOfferedPackage(JSON.parse(sessionStorage.getItem("offeredPackage")));
  }, []);

  function updateCoupleData(data) {
    debugger;
    if (data.package === null) {
      sessionStorage.setItem("currentCouple", JSON.stringify(data));
      setCoupleData({ ...data });
    } else {
      updateOfferedPackage(data);
      sessionStorage.setItem("currentCouple", JSON.stringify(data));
      setCoupleData({ ...data });
    }
  }

  function updateOfferedPackage(data) {
    debugger;
    const packageAndTypeWeights = {
      ...data.package,
      typeWeights: data.typeWeights,
    };
    sessionStorage.setItem(
      "offeredPackage",
      JSON.stringify(packageAndTypeWeights)
    );
    setOfferedPackage(packageAndTypeWeights);
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
    updateOfferedPackage,
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
