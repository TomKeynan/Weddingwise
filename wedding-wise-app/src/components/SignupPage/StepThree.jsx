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
import InputFileUpload from "../InputFileUpload";

const StepThree = () => {
  const { userDetails, updateUserDetails } = useContext(RegisterContext);

  const [check, setCheck] = useState({ isValid: true });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  // Handle avatar file selection
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // const handleChange = (event) => {
  //   const key = event.target.name;
  //   const value = event.target.value;
  //   if (VALIDATIONS[key].regex.test(value))
  //     setCheck({ isValid: true, validMsg: VALIDATIONS[key].valid });
  //   else setCheck({ isValid: false, errorMsg: VALIDATIONS[key].error });

  //   updateUserDetails({ [event.target.name]: event.target.value });
  // };

  return (
    <Grid
      container
      spacing={2}
      sx={{ width: { xs: 270, md: 600 }, margin: "0 auto" }}
    >
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={userDetails.relationship === "male" ? "שם החתן" : "שם הכלה"}
          name="partner1Name"
          value={userDetails.partner1Name}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={userDetails.relationship === "female" ? "שם הכלה" : "שם החתן"}
          name="partner2Name"
          value={userDetails.partner2Name}
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
          <TextInput
            id="password-input"
            name="password"
            value={userDetails.password}
            label="סיסמא"
            type={showPassword ? "text" : "password"}
            sx={textFieldSX}
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
      <Grid item xs={12} >
        <FormControl name="userImage" sx={textFieldSX} onChange={handleAvatar}>
          <InputFileUpload isUpload={avatar.file} />
        </FormControl>
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
