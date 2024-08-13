import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext({
  coupleData: {},
  setCoupleData: () => {},
  updateCoupleData: () => {},
  supplierData: {},
  setSupplierData: () => {},
  editSupplier: {},
  setEditSupplier: () => {},
  offeredPackage: {},
  setOfferedPackage: () => {},
  updateOfferedPackage: () => {},
  invitees: [],
  setInvitees: () => {},
  addInvitee: () => {},
  removeInvitee: () => {},
  editCoupleComeFrom: [],
  setEditCoupleComeFrom: () => { },
  coupleAnswers: [],
  setCoupleAnswers: () => {},
  onSelectOption: () => {},
});

const initialStateCoupleData = JSON.parse(
  sessionStorage.getItem("currentCouple")
);
const initialStateSupplierData = JSON.parse(
  sessionStorage.getItem("currentSupplier")
);

const initialArray = Array.from({ length: 15 }, () => 1);

export default function AppContextProvider({ children }) {
  const [coupleData, setCoupleData] = useState(initialStateCoupleData);

  const [supplierData, setSupplierData] = useState(initialStateSupplierData);

  const [editSupplier, setEditSupplier] = useState(initialStateSupplierData);

  const [offeredPackage, setOfferedPackage] = useState(null);

  const [invitees, setInvitees] = useState([]);
  
  const [coupleAnswers, setCoupleAnswers] = useState(initialArray);
  
  // this state responsible to tell EditCoupleForm which page the couple should be
  // sent to after updating their details-
  // if they came from the navbar item they will redirect to their own profile
  // if they came from the UserWithoutPackage they will redirect to questionnaire page.
  const [editCoupleComeFrom, setEditCoupleComeFrom] = useState("navbar");

  useEffect(() => {
    setOfferedPackage(JSON.parse(sessionStorage.getItem("offeredPackage")));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("currentSupplier", JSON.stringify(supplierData));
    setEditSupplier(supplierData);
  }, [supplierData]);

  function updateCoupleData(data) {
    if (data.hasOwnProperty("password")) data.password = null;

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

  function onSelectOption(activePage, optionValue) {
    const updatedArray = [...coupleAnswers];
    updatedArray[activePage] = Number(optionValue);
    setCoupleAnswers([...updatedArray]);
  }

  function addInvitee(invitee) {
    setInvitees((prevInvitees) => [...prevInvitees, invitee]);
  }

  function removeInvitee(index) {
    setInvitees((prevInvitees) => prevInvitees.filter((_, i) => i !== index));
  }

  const appContext = {
    coupleData,
    setCoupleData,
    updateCoupleData,
    supplierData,
    setSupplierData,
    editSupplier,
    setEditSupplier,
    offeredPackage,
    updateOfferedPackage,
    setOfferedPackage,
    invitees,
    setInvitees,
    addInvitee,
    removeInvitee,
    editCoupleComeFrom,
    setEditCoupleComeFrom,
    coupleAnswers,
    setCoupleAnswers,
    onSelectOption
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
