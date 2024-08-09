import React, { createContext, useContext, useEffect, useState } from "react";
import { editCoupleValidations, VALIDATIONS } from "../utilities/collections";
import { useNavigate } from "react-router-dom";
import useFetch from "../utilities/useFetch";
import { AppContext } from "./AppContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../fireBase/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../fireBase/upload";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserStore } from "../fireBase/userStore";
import { useGlobalStore } from "../fireBase/globalLoading";
export const RegisterContext = createContext({
  userDetails: {},
  editValue: {},
  date: "",
  error: null,
  loading: false,
  avatar: null,
  updateUserDetails: () => { },
  updateEditValue: () => { },
  saveDateValue: () => { },
  isFormCompleted: () => { },
  isFormValid: () => { },
  isEditFormValid: () => { },
  handleSubmit: () => { },
  handleAvatar: () => { },
});
export default function RegisterContextProvider({ children }) {
  const navigate = useNavigate();
  const { updateCoupleData } = useContext(AppContext);
  const [editValue, setEditValue] = useState(
    JSON.parse(sessionStorage.getItem("currentCouple"))
  );
  const todayDate = new Date().toLocaleDateString();
  const [dateValue, setDateValue] = useState(todayDate);
  const { fetchUserInfo } = useUserStore();
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
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const { sendData, resData, error, setError, loading } = useFetch();
  const { setGlobalLoading } = useGlobalStore();
  useEffect(() => {
    const registerAndNavigate = async () => {
      if (resData) {
        updateCoupleData(resData);
        try {
          await registerFireBase();
          await loginFireBase();
          if (auth.currentUser?.uid) {
            await fetchUserInfo(auth.currentUser.uid);

            navigate("/profile");
          }
        } catch (err) {
          console.log(err);
          setGlobalLoading(false);
        }
        finally{
          setGlobalLoading(false);
        }
      } else if (error) {
        setGlobalLoading(false);
      }
    };

    registerAndNavigate();
  }, [resData, error]);


  
  const loginFireBase = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
    } catch (err) {
      console.log(err);
      setGlobalLoading(false);
    }
  };


  const registerFireBase = async () => {
    const username = `${userDetails.partner1Name} ו${userDetails.partner2Name}`;
    const email = userDetails.email;
    const password = userDetails.password;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      let imgUrl = null;
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      }
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl || "assets/chat_pics/avatar.png",
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });
    } catch (err) {
      console.log(err);
      setGlobalLoading(false);
    }
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

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
  function isFormCompleted(userDetails, isEditMode = false) {
    const keys = Object.keys(userDetails);
    //result is counting how many fields still empty
    const result = keys.reduce((acc, currentKey) => {
      if (isEditMode && currentKey === "password") {
        return acc;
      }
      if (userDetails[currentKey] === "") return (acc += 1);
      else return acc;
    }, 0);
    return result === 0 && userDetails["desiredRegion"] !== null;
  }

  // filter all fields that don't need to pass validation check.
  function filterNonRequiredFields(isEditMode) {
    let validator = VALIDATIONS;
    if (isEditMode) {
      validator = editCoupleValidations;
    }
    const keys = Object.keys(userDetails);
    const filteredKeys = keys.filter((key) => {
      if (validator.hasOwnProperty(key)) return key;
    });
    return filteredKeys;
  }

  // checks if all fields are valid.
  function isFormValid(userDetails) {
    const filteredKeys = filterNonRequiredFields(false);
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
    if (userDetails.password === null) {
      userDetails.password = "";
    }
    const filteredKeys = filterNonRequiredFields(true);
    //result is counting how many fields passed test validation.
    const result = filteredKeys.reduce((acc, currentKey) => {
      if (editCoupleValidations[currentKey].regex.test(userDetails[currentKey]))
        return (acc += 1);
      else return acc;
    }, 0);
    return result === filteredKeys.length;

  }

  function saveDateValue(dateInput) {
    setDateValue(dateInput);
  }


  function handleSubmit() {
    delete userDetails.Relationship;
    setGlobalLoading(true);
    sendData("/Couples/registerCouple", "POST", userDetails);
  }

  const registerCtx = {
    userDetails,
    editValue,
    date: dateValue,
    error,
    loading,
    avatar,
    updateUserDetails,
    updateEditValue,
    saveDateValue,
    isFormCompleted,
    isEditFormValid,
    isFormValid,
    handleSubmit,
    handleAvatar,
  };

  return (
    <RegisterContext.Provider value={registerCtx}>
      {children}
    </RegisterContext.Provider>
  );
}
