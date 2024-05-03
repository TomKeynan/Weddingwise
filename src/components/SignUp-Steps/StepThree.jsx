import React, { useState, useContext } from "react";
import { RegisterContext } from "../../store/RegisterContext";
import { Grid, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { customTheme } from "../../store/Theme";
import TextInput from "../TextInput";
import { VALIDATIONS } from "../../utilities/collections";



const StepThree = () => {
  const { userDetails, updateUserDetails } = useContext(RegisterContext);

  const [check, setCheck] = useState({isValid: true});

  const handleChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    if (VALIDATIONS[key].regex.test(value))
      setCheck({ isValid: true, validMsg: VALIDATIONS[key].valid });
    else
      setCheck({ isValid: false, errorMsg: VALIDATIONS[key].error });

    updateUserDetails({ [event.target.name]: event.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: { xs: 250, md: 600 }, margin: "0 auto" }}
    >
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={
            userDetails.kind === "male" || userDetails.kind === ""
              ? "שם החתן"
              : "שם הכלה"
          }
          name="groomName"
          value={userDetails.groomName}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={
            userDetails.kind === "female" || userDetails.kind === ""
              ? "שם הכלה"
              : "שם החתן"
          }
          name="brideName"
          value={userDetails.brideName}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="email"
          label="אימייל"
          name="email"
          value={userDetails.email}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl color="primary" variant="outlined" sx={{ width: "100%" }}>
          <TextField
            id="password-input"
            name="password"
            onChange={handleChange}
            value={userDetails.password}
            label="סיסמא"
            type={showPassword ? "text" : "password"}
            sx={textFieldSX}
            error={check.isValid !== true}
            helperText={
              check.isValid === true ? check.validMsg : check.errorMsg
            }
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
              )
            }}
          />
        </FormControl>
        {/* <FormControl color="primary" variant="outlined" sx={{ width: "100%" }}>
          <InputLabel htmlFor="password-input">סיסמא</InputLabel>
          <OutlinedInput
            id="password-input"
            name="password"
            onChange={handleChange}
            value={userDetails.password}
            label="סיסמא"
            type={showPassword ? "text" : "password"}
            endAdornment={
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
            }
          />
        </FormControl> */}
      </Grid>
    </Grid>
  );
};

export default StepThree;

// ============================== styles ==============================

const textFieldSX = {
  p: 0,
  width: "100%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 15, sm: 18 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: 15,
  },
};
