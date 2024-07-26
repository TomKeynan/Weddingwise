import React, { useEffect, useState } from "react";
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
import { translateSupplierTypeToEnglish } from "../utilities/functions";
import MessageDialog from "../components/Dialogs/MessageDialog";
import ReadOnlyPopup from "../components/Dialogs/ReadOnlyPopup";

const SupplierSignUp = () => {
  const navigate = useNavigate();
  const { sendData, resData, loading, error, setError } = useFetch();
  const [showPassword, setShowPassword] = useState(false);
  const [isVenue, setIsVenue] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // this state keep the supplies's profile image
  // console.log(imageUrl)
  const [supplierDescription, setSupplierDescription] = useState("");
  // console.log(supplierDescription)
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [currentSupplierData, setCurrentSupplierData] = useState({});

  useEffect(() => {
    if (resData) {
      setTimeout(() => {
        sessionStorage.setItem(
          "currentSupplier",
          JSON.stringify(currentSupplierData)
        );
        navigate("/supplier-private-Profile");
      }, 4000);
    }
  }, [resData]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  function handelImageUpload(imageObj) {
    if (imageObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(imageObj);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);
    setSupplierDescription(data.description);
    data.supplierType = translateSupplierTypeToEnglish(data.supplierType);
    delete data.userImage;

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

  return (
    <RegisterContextProvider>
      {loading && <Loading />}
      {error && showErrorMessage(error)}
      {resData == 200 && showSuccessMessage()}
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: { xs: "90%", sm: "70%", md: "60%" },
          margin: "auto",
          minHeight: "inherit",
          pb: 10,
        }}
      >
        <Paper variant="elevation" elevation={6} sx={paperSX}>
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
                  name="description"
                  label="תיאור"
                  multiline
                  maxRows={5}
                  sx={textareaSX}
                  helperText="תיאור זה יופיע בפרופיל - כתבו תיאור הולם עבור העסק והשירות שאתם מציעים"
                />
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
                  onChange={(e) => handelImageUpload(e.target.files[0])}
                >
                  <InputFileUpload isUpload={imageUrl} />
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
