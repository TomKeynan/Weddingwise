import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RegisterContextProvider from "../store/RegisterContext";
import { customTheme } from "../store/Theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  regions,
  signupSupplierErrors,
  supplierTypes,
  VALIDATIONS,
} from "../utilities/collections";
import InputFileUpload from "./InputFileUpload";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";
import useFetch from "../utilities/useFetch";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import {
  convertDateToClientFormat,
  getFullDate,
  translateSupplierTypeToEnglish,
  translateSupplierTypeToHebrew,
} from "../utilities/functions";
import MessageDialog from "../components/Dialogs/MessageDialog";
import ReadOnlyPopup from "../components/Dialogs/ReadOnlyPopup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../fireBase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../fireBase/upload";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AppContext } from "../store/AppContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditSupplier = () => {
  //   const navigate = useNavigate();
  const { sendData, resData, loading, error, setError } = useFetch();
  const { editSupplier, setEditSupplier } = useContext(AppContext);
  //   console.log(editSupplier);
  const [showPassword, setShowPassword] = useState(false);
  const [isVenue, setIsVenue] = useState(false);
  // const [imageUrl, setImageUrl] = useState(null); // this state keep the supplies's profile image
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  // console.log(imageUrl)
  const [supplierDescription, setSupplierDescription] = useState("");
  // console.log(supplierDescription)
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [currentSupplierData, setCurrentSupplierData] = useState({});

  // Omri's
  useEffect(() => {
    if (resData) {
      setTimeout(() => {
        sessionStorage.setItem(
          "currentSupplier",
          JSON.stringify(currentSupplierData)
        );
        // navigate("/supplier-private-Profile");
        setOpen(false);
      }, 3000);
    }
  }, [resData]);

  //   useEffect(() => {
  //     const registerAndNavigate = async () => {
  //       //   console.log(resData);
  //       if (resData) {
  //         await registerFireBase();
  //         await loginFireBase();
  //         setTimeout(() => {
  //           sessionStorage.setItem("currentSupplier", JSON.stringify(currentSupplierData));
  //           navigate("/supplier-private-Profile");
  //         }, 4000);
  //       }
  //     };
  //     registerAndNavigate();
  //   }, [resData]);

  const loginFireBase = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        currentSupplierData.supplierEmail,
        currentSupplierData.Password
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Handle avatar file selection
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const registerFireBase = async () => {
    const username = currentSupplierData.businessName;
    const email = currentSupplierData.supplierEmail;
    const password = currentSupplierData.Password;

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

      const imgUrl = null;
      if (avatar.file) {
        const imgUrl = await upload(avatar.file);
      }

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        description: supplierDescription,
        avatar:
          imgUrl ||
          "https://firebasestorage.googleapis.com/v0/b/weddingwisetest-ecd19.appspot.com/o/images%2Favatar.png?alt=media&token=9f7020cf-fb7b-4170-8870-030e6dc9fbba",
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      await setDoc(doc(db, "supplierComments", res.user.uid), {
        comments: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // function handelImageUpload(imageObj) {
  //   debugger;
  //   console.log(imageObj);
  //   console.log(URL.createObjectURL(imageObj));
  //   if (imageObj) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImageUrl(reader.result);
  //     };
  //     reader.readAsDataURL(imageObj);
  //   }
  // }

  function handleFormSubmit(e) {
    debugger;
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setSupplierDescription(data.description);
    data.supplierType = translateSupplierTypeToEnglish(data.supplierType);
    delete data.userImage;

    const newErrors = {};
    for (let field in data) {
      //   if (field === "Password") return;
      if (
        VALIDATIONS.hasOwnProperty(field) &&
        !VALIDATIONS[field].regex.test(data[field])
      ) {
        newErrors[field] = VALIDATIONS[field].error;
      } else {
        if (data[field] === "") newErrors[field] = "שדה זה נדרש להיות מלא";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setCurrentSupplierData(data);
      setOpen(true);
      setErrors({});
      sendData("/Suppliers/updateSupplier", "PUT", data);
    }
  }

  function handleInputChange(e) {
    let name = e.target.name;
    if (name === "Password") {
      setEditSupplier((prevData) => {
        return { ...prevData, password: e.target.value };
      });
    }
    setEditSupplier((prevData) => {
      return { ...prevData, [name]: e.target.value };
    });
  }

  function addAvailableDates(date) {
    // const dateObject = getFullDate(date);
    // const dataString = convertDateToClientFormat(`${dateObject}T`);
    // console.log(dataString);
  }

  // ================ error handling ================
  function handleCloseMessage() {
    setOpen(false);
    setError(undefined);
  }

  function showErrorMessage(status) {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={handleCloseMessage}
        xBtn={handleCloseMessage}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {signupSupplierErrors[status]}
        </Typography>
      </MessageDialog>
    );
  }

  function showSuccessMessage() {
    return (
      <ReadOnlyPopup
        title="🎉 ברוכים הבאים ל- WeddingWise🎉"
        text="תהליך ההרשמה עבר הצלחה👏🏼"
        open={open}
        mode="success"
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
        >
          {signupSupplierErrors[200]}
        </Typography>
      </ReadOnlyPopup>
    );
  }

  return (
    <RegisterContextProvider>
      {loading && <Loading />}
      {error && showErrorMessage(error)}
      {resData === 204 && showSuccessMessage()}
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: "90%",
          margin: "auto",
          minHeight: "inherit",
          pb: 10,
        }}
      >
        <Paper variant="elevation" elevation={6} sx={paperSX}>
          <form onSubmit={handleFormSubmit}>
            <Grid container sx={{ rowGap: 3 }}>
              <Grid item xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    label="תאריך"
                    showDaysOutsideCurrentMonth
                    onChange={(newValue) => addAvailableDates(newValue)}
                    required
                    disablePast={true}
                    slotProps={{
                      textField: {
                        name: "desiredDate",
                        variant: "outlined",
                        sx: textFieldSX,
                      },
                    }}
                  />
                </LocalizationProvider>
                <Grid container sx={{ rowGap: 3 }}>
                  {editSupplier["availableDates"].length > 0 ? (
                    editSupplier["availableDates"].map((date, index) => (
                      <Grid item key={index} xs={12} sm={4} md={4}>
                        <Typography variant="h6">{date}</Typography>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12} sx={{ py: 1, px: 2, color: "red" }}>
                      <Alert severity="warning">לא נבחרו תאריכים פנויים</Alert>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} sx={{ alignContent: "" }}>
                <TextField
                  variant="filled"
                  type="text"
                  label="שם העסק"
                  name="businessName"
                  max={5}
                  sx={textFieldSX}
                  inputProps={{ maxLength: 30 }}
                  helperText="שם העסק יופיע בפרופיל שלכם"
                  value={editSupplier.businessName}
                  onChange={handleInputChange}
                />
                {errors.businessName && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.businessName}
                  </Alert>
                )}
              </Grid>
              {/* SupplierTypes */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={supplierTypes}
                  freeSolo={false}
                  value={translateSupplierTypeToHebrew(
                    editSupplier.supplierType
                  )}
                  onChange={(event, newValue) => {
                    if (newValue === "אולם שמחות") setIsVenue(true);
                    else setIsVenue(false);
                    setEditSupplier((prevData) => {
                      return {
                        ...prevData,
                        supplierType: translateSupplierTypeToEnglish(newValue),
                      };
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="סוג העסק"
                      name="supplierType"
                      sx={textFieldSX}
                    />
                  )}
                />
                {errors.supplierType && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.supplierType}
                  </Alert>
                )}
              </Grid>
              {isVenue && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="filled"
                      type="text"
                      label="כמות אורחים"
                      name="capacity"
                      sx={textFieldSX}
                      value={editSupplier.capacity === null && 0}
                      onChange={handleInputChange}
                    />
                    {errors.capacity && (
                      <Alert severity="error" sx={errorAlertSX}>
                        {errors.capacity}
                      </Alert>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="filled"
                      type="text"
                      label="כתובת"
                      name="venueAddress"
                      sx={textFieldSX}
                    />
                    {errors.venueAddress && (
                      <Alert severity="error" sx={errorAlertSX}>
                        {errors.venueAddress}
                      </Alert>
                    )}
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="מחיר"
                  name="price"
                  sx={textFieldSX}
                  helperText="המחיר הממוצע עבור השירות שלכם"
                  value={editSupplier.price}
                  onChange={handleInputChange}
                />
                {errors.price && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.price}
                  </Alert>
                )}
              </Grid>
              {/* Region */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={regions}
                  freeSolo={false}
                  value={editSupplier.availableRegion}
                  onChange={(event, newValue) => {
                    setEditSupplier((prevData) => {
                      return {
                        ...prevData,
                        availableRegion: newValue,
                      };
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="איזור"
                      name="availableRegion"
                      sx={textFieldSX}
                    />
                  )}
                />
                {errors.availableRegion && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.availableRegion}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  value={editSupplier.phoneNumber}
                  label="מס' טלפון"
                  name="phoneNumber"
                  sx={textFieldSX}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.phoneNumber}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="תיאור"
                  multiline
                  maxRows={5}
                  sx={textareaSX}
                  helperText="תיאור זה יופיע בפרופיל - כתבו תיאור הולם עבור העסק והשירות שאתם מציעים"
                />
                {errors.description && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.description}
                  </Alert>
                )}
              </Grid>
              {/* Password */}
              <Grid item xs={12} md={6}>
                <FormControl
                  color="primary"
                  variant="filled"
                  sx={textFieldSX}
                  value={editSupplier.Password}
                >
                  <TextField
                    id="password-input"
                    name="Password"
                    label="סיסמא"
                    type={showPassword ? "text" : "password"}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fill: customTheme.palette.primary.main,
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {errors.Password && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.Password}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  name="userImage"
                  sx={textFieldSX}
                  onChange={handleAvatar}
                >
                  <InputFileUpload isUpload={avatar.file} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <SupplierOutlineBtn
                  type="submit"
                  value="צור חשבון"
                  width="100%"
                  fontSize={{ xs: 16, sm: 20 }}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Stack>
    </RegisterContextProvider>
  );
};

export default EditSupplier;

const paperSX = {
  py: 3,
  px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,0.8)",
};

const textFieldSX = {
  width: "95%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: { xs: 12, sm: 15 },
  },
};

const textareaSX = {
  width: "98%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: { xs: 12, sm: 15 },
  },
};

const errorAlertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  width: "90%",
  m: "12px auto 0",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
};
