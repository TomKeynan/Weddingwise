import React, { useState } from "react";
import {
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
import { regions, supplierTypes, VALIDATIONS } from "../utilities/collections";
import InputFileUpload from "./InputFileUpload";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";

const SupplierSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVenue, setIsVenue] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
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
    data.userImage = imageUrl;
    console.log(data);
    const newErrors = {};
    for (let field in data) {
      if (
        VALIDATIONS.hasOwnProperty(field) &&
        !VALIDATIONS.field.regex.test(data[field])
      ) {
        newErrors[field] = VALIDATIONS.field.error;
      }
    }
  }

  return (
    <RegisterContextProvider>
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: { xs: "90%", sm: "70%", md: "60%" },
          margin: "auto",
          minHeight: "inherit",
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
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="text"
                  label="שם העסק"
                  name="supplierName"
                  max={5}
                  sx={textFieldSX}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              {/* SupplierTypes */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={supplierTypes}
                  freeSolo={false}
                  onChange={(event, newValue) => {
                    //   updateUserDetails({ desiredRegion: newValue });
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
                      // helperText="בחרו את האיזור בו תערך החתונה"
                      // required
                    />
                  )}
                />
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      type="text"
                      label="כתובת"
                      name="venueAddress"
                      sx={textFieldSX}
                    />
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
                />
              </Grid>
              {/* Region */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={regions}
                  freeSolo={false}
                  // onChange={(event, newValue) => {
                  //   updateUserDetails({ desiredRegion: newValue });
                  // }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="איזור"
                      name="region"
                      sx={textFieldSX}
                      // helperText="בחרו את האיזור בו תערך החתונה"
                      // required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  label="מס' טלפון"
                  name="phoneNumber"
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  type="email"
                  label="אימייל"
                  name="email"
                  onInvalid={() => {
                    return "דכשדכגשד";
                  }}
                  sx={textFieldSX}
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
