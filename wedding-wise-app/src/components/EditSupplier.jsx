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
import { auth, db } from "../fireBase/firebase";
import { doc } from "firebase/firestore";
import upload from "../fireBase/upload";
import { AppContext } from "../store/AppContext";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import { useUserStore } from "../fireBase/userStore";
import { updatePassword } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { geocodeAddress } from "../utilities/functions";

const EditSupplier = ({ supplierFirebase }) => {
  const { editSupplier, setEditSupplier, setSupplierData, setScrollToTop } =
    useContext(AppContext);
  const { sendData, resData, setResData, loading, error, setError } =
    useFetch();
  const [isVenue, setIsVenue] = useState(false);
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
  const { isLoading, setLoading } = useUserStore();
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {

    const updateUser = async () => {
      if (resData) {
        const { Password, ...rest } = currentSupplierData;
        setSupplierData(rest);


        try {
          await updateUserFirebase();
          setOpenUpdateSuccess(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          console.error("Error updating user:", error);
        } finally {
          setLoading(false);
        }
      }
      return () => {
        setResData(undefined);
      };
    };

    updateUser();
  }, [resData, currentSupplierData]);

  useEffect(() => {
    setCurrentDescription(supplierFirebase.description);
    setCurrentAddress(supplierFirebase.address);
  }, [supplierFirebase]);

  const updateUserFirebase = async () => {
    const username = currentSupplierData.businessName;
    const password = currentSupplierData.Password;
    const description = currentDescription;

    try {
      // Update password in Firebase Authentication
      const user = auth.currentUser;
      if (password) {
        await updatePassword(user, password);
      }

      // Upload new avatar if provided
      let imgUrl = null;
      if (avatar && avatar.file) {
        imgUrl = await upload(avatar.file);
      }

      // Update user details in Firestore
      const userRef = doc(db, "users", supplierFirebase.id);
      await updateDoc(userRef, {
        username: username || supplierFirebase.username,
        description: description || supplierFirebase.description,
        avatar: imgUrl || supplierFirebase.avatar,
      });
    } catch (err) {
      console.log(err);
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleFormSubmit(e) {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    delete data.description;
    delete data.userImage;

    setLoading(true);
    if (data.venueAddress) {
      const { latitude, longitude } = await geocodeAddress(data.venueAddress); // Need to address bad input if got time
      data.latitude = latitude;
      data.longitude = longitude;
    }

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
    // setOpen(true);
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

  // function showSuccessMessage() {
  //   return (
  //     <MessageDialog
  //       title="כל הכבוד!"
  //       btnValue="אוקיי!"
  //       open={open}
  //       onClose={() => setOpenUpdateSuccess(false)}
  //       xBtn={() => setOpenUpdateSuccess(false)}
  //       mode="success"
  //     >
  //       <Typography variant="h6" sx={{ textAlign: "center" }}>
  //         עדכון הפרטים החדשים שלך עבר בהצלחה
  //       </Typography>
  //     </MessageDialog>
  //   );
  // }


  if (isLoading) {
    return <Loading />
  }

  return (
    <RegisterContextProvider>

      {error && showErrorMessage(error)}
      {openUpdateConfirm && showUpdateConfirmDialog()}
      {/* {openUpdateSuccess && showSuccessMessage()} */}
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
                      value={editSupplier.capacity === null ? 0 : editSupplier.capacity}
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
                      value={currentAddress}
                      label="כתובת"
                      onChange={(e) => setCurrentAddress(e.target.value)}
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
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
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
                <Typography
                  variant="body1"
                  sx={{ textAlign: "left", color: "grey", pl: 3 }}
                >
                  קישורים לרשתות החברתיות
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="קישור ליוטיוב"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="קישור לאינסטגרם"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="קישור לפייסבוק"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="קישור ללינקדין"
                  sx={textFieldSX}
                />
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
