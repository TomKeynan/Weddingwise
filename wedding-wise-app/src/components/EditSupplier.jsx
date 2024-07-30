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
import ConfirmDialog from "./Dialogs/ConfirmDialog";

const EditSupplier = () => {
  const { editSupplier, setEditSupplier, setSupplierData } =
    useContext(AppContext);
  const { sendData, resData, setResData, loading, error, setError } =
    useFetch();
  const [isVenue, setIsVenue] = useState(false);
  const [supplierDescription, setSupplierDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [currentSupplierData, setCurrentSupplierData] = useState(null);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  // const [openConfirm, setOpenConfirm] = useState(false);
  // const [imageUrl, setImageUrl] = useState(null); // this state keep the supplies's profile image

  // Omri's
  useEffect(() => {
    if (resData) {
      const { Password, ...rest } = currentSupplierData
      setSupplierData(rest);
      setOpenUpdateSuccess(true);
    }
    return () => {
      setResData(undefined);
    };
  }, [resData, currentSupplierData]);

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
    // debugger;
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setSupplierDescription(data.description);
    delete data.description;
    delete data.userImage;

    // data validation
    const newErrors = {};
    for (let field in data) {
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
      setCurrentSupplierData({ ...editSupplier, ...data });
      setOpen(true);
      setOpenUpdateConfirm(true);
      setErrors({});
    }
  }

  function handleInputChange(e) {
    setEditSupplier((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
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

  // ================ Confirm update handling ================

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function handleApprovalUpdateConfirm() {
    sendData("/Suppliers/updateSupplier", "PUT", currentSupplierData);
    setOpenUpdateConfirm(false);
    setOpen(true);
  }

  function showUpdateConfirmDialog() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
        onApproval={handleApprovalUpdateConfirm}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          האם את\ה בטוחים שאתם רוצים לעדכן את הפרטים?
        </Typography>
      </ConfirmDialog>
    );
  }

  // ================  Updated success handling ================

  function showSuccessMessage() {
    return (
      <MessageDialog
        title="כל הכבוד!"
        btnValue="אוקיי!"
        open={open}
        onClose={() => setOpenUpdateSuccess(false)}
        xBtn={() => setOpenUpdateSuccess(false)}
        mode="success"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          עדכון הפרטים החדשים שלך עבר בהצלחה
        </Typography>
      </MessageDialog>
    );
  }

  return (
    <RegisterContextProvider>
      {loading && <Loading />}
      {error && showErrorMessage(error)}
      {openUpdateConfirm && showUpdateConfirmDialog()}
      {openUpdateSuccess && showSuccessMessage()}
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
              <Grid item xs={12} md={6}>
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
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}
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
              {editSupplier.supplierType === "venue" && (
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
              <Grid item xs={12}>
                <TextField
                  name="description"
                  variant="filled"
                  label="תיאור"
                  value={"פה צריך להציג את התיאור מה-firebase"}
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

              <Grid item xs={12} md={6}>
                <FormControl
                  color="primary"
                  variant="outlined"
                  sx={textFieldSX}
                >
                  <TextField
                    id="password-input"
                    name="Password"
                    label="סיסמא"
                    type={showPassword ? "text" : "password"}
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
                  value="עדכן פרטים"
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
