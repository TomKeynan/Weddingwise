import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useControlled,
} from "@mui/material";
import RegisterContextProvider from "../store/RegisterContext";
import { customTheme } from "../store/Theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  editSupplierValidations,
  regions,
  signupSupplierErrors,
  signupSupplierValidations,
  supplierTypes,
  VALIDATIONS,
} from "../utilities/collections";
import InputFileUpload from "../components/InputFileUpload";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";
import useFetch from "../utilities/useFetch";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { translateSupplierTypeToEnglish } from "../utilities/functions";
import MessageDialog from "../components/Dialogs/MessageDialog";
import ReadOnlyPopup from "../components/Dialogs/ReadOnlyPopup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../fireBase/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../fireBase/upload";
import { signInWithEmailAndPassword } from "firebase/auth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import { AppContext } from "../store/AppContext";
import { geocodeAddress } from "../utilities/functions";

const SupplierSignUp = () => {
  const navigate = useNavigate();
  const { sendData, resData, loading, error, setError } = useFetch();
  const { setSupplierData } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isVenue, setIsVenue] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [supplierDescription, setSupplierDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [currentSupplierData, setCurrentSupplierData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    Instagram: "",
    Facebook: "",
    YouTube: "",
    LinkedIn: "",
  });

  useEffect(() => {
    const registerAndNavigate = async () => {
      if (resData) {
        try {
          setSupplierData(resData);
          setIsLoading(true);

          await registerFireBase();
          await loginFireBase();

          navigate("/supplier-private-Profile");
        } catch (err) {
          console.error(
            "Registration, login, or fetching user info failed:",
            err
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    registerAndNavigate();
  }, [resData]);

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
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      let imgUrl = null;
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      }

      const socialLinksWithDefaults = {
        Instagram: socialLinks.Instagram || "",
        Facebook: socialLinks.Facebook || "",
        YouTube: socialLinks.YouTube || "",
        LinkedIn: socialLinks.LinkedIn || "",
      };

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        description: supplierDescription || "",
        avatar: imgUrl || "assets/chat_pics/avatar.png",
        id: res.user.uid,
        blocked: [],
        comments: [],
        socialLinks: socialLinksWithDefaults,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setSupplierDescription(data.description);
    data.supplierType = translateSupplierTypeToEnglish(data.supplierType);
    delete data.userImage;

    setSocialLinks({
      Instagram: data.Instagram,
      Facebook: data.Facebook,
      Youtube: data.YouTube,
      LinkedIn: data.LinkedIn,
    });

    delete data.Instagram;
    delete data.Facebook;
    delete data.YouTube;
    delete data.LinkedIn;

    if (data.venueAddress) {
      const { latitude, longitude } = await geocodeAddress(data.venueAddress); // Need to address bad input if got time
      data.latitude = latitude;
      data.longitude = longitude;
    }

    console.log(data);
    // Validate fields
    const newErrors = {};
    for (let field in data) {
      if (
        signupSupplierValidations.hasOwnProperty(field) &&
        !signupSupplierValidations[field].regex.test(data[field])
      ) {
        newErrors[field] = signupSupplierValidations[field].error;
      } else {
        if (data[field] === "") {
          console.log(field);
          newErrors[field] = "שדה זה נדרש להיות מלא";
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setCurrentSupplierData(data);
      setOpen(true);
      setErrors({});
      sendData("/Suppliers/registerSupplier", "POST", data);
    }
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

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <RegisterContextProvider>
      {error && showErrorMessage(error)}
      {resData && showSuccessMessage()}
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: { xs: "90%", sm: "70%", md: "60%" },
          margin: "auto",
          minHeight: "inherit",
          pb: 10,
          position: "relative",
        }}
      >
        <Paper variant="elevation" elevation={6} sx={paperSX}>
          <Box
            sx={{
              position: "absolute",
              right: 10,
              top: 0,
              fontSize: { xs: 28, sm: 32 },
              cursor: "pointer",
            }}
            onClick={() => navigate("/suppliers")}
          >
            x
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 26, md: 32 },
              fontFamily: customTheme.font.main,
              pb: 3,
            }}
          >
            הצטרפו אלינו והתחילו להרחיב את מעגל הלקוחות שלכם!
          </Typography>
          <Typography
            sx={{
              pb: 3,
              fontWeight: "bold",
              fontSize: { xs: 18, sm: 24, md: 26 },
              color: customTheme.supplier.colors.primary.main,
            }}
          >
            הרשמה מהירה וקלה לשירות הפשוט והחכם לתכנון חתונות מוצלחות.
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container sx={{ rowGap: 3 }}>
              <Grid item xs={12} md={6} sx={{ alignContent: "" }}>
                <TextField
                  variant="outlined"
                  type="text"
                  label="שם העסק"
                  name="businessName"
                  max={5}
                  sx={textFieldSX}
                  inputProps={{ maxLength: 30 }}
                  helperText="שם העסק יופיע בפרופיל שלכם"
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
                  onChange={(event, newValue) => {
                    if (newValue === "אולם שמחות") setIsVenue(true);
                    else setIsVenue(false);
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
                      variant="outlined"
                      type="text"
                      label="כמות אורחים"
                      name="capacity"
                      sx={textFieldSX}
                    />
                    {errors.capacity && (
                      <Alert severity="error" sx={errorAlertSX}>
                        {errors.capacity}
                      </Alert>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
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
                  variant="outlined"
                  type="text"
                  label="מחיר"
                  name="price"
                  sx={textFieldSX}
                  helperText="המחיר הממוצע עבור השירות שלכם"
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
                  variant="outlined"
                  label="מס' טלפון"
                  name="phoneNumber"
                  sx={textFieldSX}
                />
                {errors.phoneNumber && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.phoneNumber}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="text"
                  label="אימייל"
                  name="supplierEmail"
                  sx={textFieldSX}
                />
                {errors.supplierEmail && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.supplierEmail}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="תיאור"
                  multiline
                  maxRows={5}
                  sx={textareaSX}
                  name="description"
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
                  variant="outlined"
                  sx={textFieldSX}
                >
                  <TextField
                    id="password-input"
                    name="password"
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
                {errors.password && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.password}
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
                  variant="outlined"
                  type="text"
                  name="YouTube"
                  label="קישור ליוטיוב"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="text"
                  name="Instagram"
                  label="קישור לאינסטגרם"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="text"
                  label="קישור לפייסבוק"
                  name="Facebook"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="text"
                  name="LinkedIn"
                  label="קישור ללינקדין"
                  sx={textFieldSX}
                />
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
          <Stack
            direction="row"
            justifyContent="space-around"
            flexWrap="wrap"
            sx={{ pt: 5, rowGap: 1 }}
          >
            <Button onClick={() => navigate("/supplier-login")}>
              <ArrowForwardIcon />
              <Typography sx={{ pl: 1, fontSize: { xs: 18, sm: 20 } }}>
                יש לי כבר חשבון
              </Typography>
            </Button>

            <Button onClick={() => navigate("/suppliers")}>
              <Typography sx={{ pr: 1, fontSize: { xs: 18, sm: 20 } }}>
                חזור לדף הבית
              </Typography>
              <HomeIcon />
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </RegisterContextProvider>
  );
};

export default SupplierSignUp;

const paperSX = {
  minHeight: "600px",
  p: 5,
  backgroundColor: "rgba(255,255,255,0.6)",
};

const textFieldSX = {
  width: "95%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: 15,
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
    fontSize: 15,
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
