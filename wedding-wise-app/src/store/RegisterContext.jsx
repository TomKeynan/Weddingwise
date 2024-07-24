import React, { createContext, useContext, useEffect, useState } from "react";
import { VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
// import useFetch from "../utilities/useFetch";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../fireBase/firebase';
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

export const RegisterContext = createContext({
  userDetails: {},
  editValue: {},
  date: "",
  error: null,
  loading: false,
  updateUserDetails: () => { },
  updateEditValue: () => { },
  saveDateValue: () => { },
  isFormCompleted: () => { },
  isFormValid: () => { },
  isEditFormValid: () => { },
  handleSubmit: () => { },
});
export default function RegisterContextProvider({ children }) {
  const navigate = useNavigate();

  const { sendData, resData, error, loading } = useFetch();

  const { updateCoupleData } = useContext(AppContext);



  // Omri's
  // useEffect(() => {
  //   if (resData) {
  //     updateCoupleData(resData);
  //     navigate("/profile");
  //   }
  // }, [resData]);


  useEffect(() => {
    const registerAndNavigate = async () => {
      if (resData) {
        updateCoupleData(resData);
        await registerFireBase();
        navigate("/profile");
      }
    };

    registerAndNavigate();
  }, [resData]);

  const registerFireBase = async () => {
   
    const username = userDetails.partner1Name + ' ו' + userDetails.partner2Name;  // Need to fix?
    const email = userDetails.email;
    const password = userDetails.password

    // Validate unique username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      // Create user with email and password using auth of firebase
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // if the creating is succesful res is the user with propreties. 

      // Set user document in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: "assets/chat_pics/avatar.png", // I think its already default
        id: res.user.uid,
        blocked: []
      });

      // Set user chats document in Firestore
      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
    
    }
  };

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    partner1Name: "",
    partner2Name: "",
    PhoneNumber: "000",
    desiredDate: "",
    desiredRegion: "",
    budget: "",
    numberOfInvitees: "",
    relationship: "",
  });

  const [editValue, setEditValue] = useState(
    JSON.parse(sessionStorage.getItem("currentCouple"))
  );
  const todayDate = new Date().toLocaleDateString();
  const [dateValue, setDateValue] = useState(todayDate);

  function updateUserDetails(currentInput) {
    setUserDetails((prevData) => {
      // currentInput.hasownproprety('password')
      return { ...prevData, ...currentInput };
    });
  }

  function updateEditValue(currentInput) {
    setEditValue((prevData) => {
      return { ...prevData, ...currentInput };
    });
  }

  //checks if all fields has been filled by the user.
  function isFormCompleted(userDetails) {
    const keys = Object.keys(userDetails);
    //result is counting how many fields still empty
    const result = keys.reduce((acc, currentKey) => {
      if (userDetails[currentKey] === "") return (acc += 1);
      else return acc;
    }, 0);
    return result === 0 && userDetails["desiredRegion"] !== null;
  }

  // filter all fields that don't need to pass validation check.
  function filterNonRequiredFields() {
    const keys = Object.keys(userDetails);
    const filteredKeys = keys.filter((key) => {
      if (VALIDATIONS.hasOwnProperty(key)) return key;
    });
    return filteredKeys;
  }

  // checks if all fields are valid.
  function isFormValid(userDetails) {
    const filteredKeys = filterNonRequiredFields();
    //result is counting how many fields passed test validation.
    const result = filteredKeys.reduce((acc, currentKey) => {
      if (VALIDATIONS[currentKey].regex.test(userDetails[currentKey]))
        return (acc += 1);
      else return acc;
    }, 0);
    return result === filteredKeys.length;
  }

  // checks if all fields are valid.
  function isEditFormValid(userDetails) {
    const filteredKeys = filterNonRequiredFields();
    const newKeys = filteredKeys.filter((key) => {
      return key !== "password";
    });
    //result is counting how many fields passed test validation.
    const result = newKeys.reduce((acc, currentKey) => {
      if (VALIDATIONS[currentKey].regex.test(userDetails[currentKey]))
        return (acc += 1);
      else return acc;
    }, 0);
    return result === newKeys.length;
  }

  function saveDateValue(dateInput) {
    setDateValue(dateInput);
  }

  function handleSubmit() {
    delete userDetails.Relationship;
    sendData("/Couples/registerCouple", "POST", userDetails);
  }

  const registerCtx = {
    userDetails,
    editValue,
    date: dateValue,
    error,
    loading,
    updateUserDetails,
    updateEditValue,
    saveDateValue,
    isFormCompleted,
    isEditFormValid,
    isFormValid,
    handleSubmit,
  };

  return (
    <RegisterContext.Provider value={registerCtx}>
      {children}
    </RegisterContext.Provider>
  );
}
