import React, { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { customTheme } from "../store/Theme";
import { RegisterContext } from "../store/RegisterContext";
import { VALIDATIONS } from "../utilities/collections";
import { TextField } from "@mui/material";

const PasswordInput = () => {
  const { userData, updateUserDetails } = useContext(RegisterContext);

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
    <FormControl color="primary" variant="outlined" sx={{ width: "100%" }}>
    <TextField
      id="password-input"
      name="password"
      onChange={handleChange}
      value={userData.password}
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
    // <FormControl color="primary" variant="outlined" name="password">
    //   <InputLabel htmlFor="password-input">סיסמא</InputLabel>
    //   <OutlinedInput
    //     id="password-input"
    //     label="סיסמא"
    //     type={showPassword ? "text" : "password"}
    //     endAdornment={
    //       <InputAdornment position="end">
    //         <IconButton
    //           aria-label="toggle password visibility"
    //           onClick={handleClickShowPassword}
    //           onMouseDown={handleMouseDownPassword}
    //           edge="end"
    //           sx={{
    //             "& .MuiSvgIcon-root": {
    //               fill: customTheme.palette.primary.main,
    //             },
    //           }}
    //         >
    //           {showPassword ? <VisibilityOff /> : <Visibility />}
    //         </IconButton>
    //       </InputAdornment>
    //     }
    //   />
    // </FormControl>
  );
};

export default PasswordInput;


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