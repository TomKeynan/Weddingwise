import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext({
  coupleData: {},
  supplierData: {},
  editSupplier: {},
  offeredPackage: {},
  setCoupleData: () => {},
  setOfferedPackage: () => {},
  updateCoupleData: () => {},
  updateOfferedPackage: () => {},
  setEditSupplier: () => {},
  invitees: [],
  setInvitees: () => {},
  addInvitee: () => {},
  removeInvitee: () => {},
});

const initialStateCoupleData = JSON.parse(
  sessionStorage.getItem("currentCouple")
);

const initialStateSupplierData = JSON.parse(
  sessionStorage.getItem("currentSupplier")
);
if (initialStateSupplierData.rating === null)
  initialStateSupplierData.rating = 0;
export default function AppContextProvider({ children }) {
  const [coupleData, setCoupleData] = useState(initialStateCoupleData);

  const [supplierData, setSupplierData] = useState(initialStateSupplierData);

  const [editSupplier, setEditSupplier] = useState(initialStateSupplierData);

  const [offeredPackage, setOfferedPackage] = useState(null);

  const [invitees, setInvitees] = useState([]);

  useEffect(() => {
    // setCoupleData(JSON.parse(sessionStorage.getItem("currentCouple")));
    setOfferedPackage(JSON.parse(sessionStorage.getItem("offeredPackage")));
  }, []);

  function updateCoupleData(data) {
    // debugger;
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
    // debugger;
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
    supplierData,
    offeredPackage,
    editSupplier,
    setEditSupplier,
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
