import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Container,
  Stack,
  Box,
  Paper,
  Typography,
  Button,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
} from "@mui/material/";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Login() {
  // useMediaQuery return a boolean that indicates rather the screen size
  // matches the breakpoint/string media query , or not
  const screenAboveSM = useMediaQuery("(min-width: 600px)");

  const navigate = useNavigate();

  function routeToHome() {
    navigate("/");
  }

  function routeToSignUp() {
    navigate("/sign-up");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    // navigate("/profile");
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container sx={containerSX} maxWidth="xxl">
      <Stack direction="row" height="100%">
        <Stack sx={loginStackSX}>
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Stack
              direction="column"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <CloseIcon
                sx={{ alignSelf: "end", fontSize: 30, p: 1, cursor: "pointer" }}
                onClick={routeToHome}
              />
              <Typography sx={titleTypoSX} color="primary">
                היי, כיף שאתם פה!
              </Typography>
              <Typography sx={subtitleTypoSX}>
                רוצים לצפות בפרופיל שלכם?
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack
                  direction="column"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* EMAIL INPUT */}
                  <FormControl color="primary" variant="outlined">
                    <InputLabel htmlFor="user-email">אימייל</InputLabel>
                    <OutlinedInput
                      id="user-email"
                      label="אימייל"
                      name="email"
                      type="text"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disableRipple
                            edge="end"
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fill: customTheme.palette.primary.main,
                              },
                              "&.MuiButtonBase-root ": {
                                cursor: "default",
                              },
                            }}
                          >
                            <AccountCircleIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  {/* PASSWORD INPUT */}
                  <FormControl color="primary" variant="outlined">
                    <InputLabel htmlFor="password-input">סיסמא</InputLabel>
                    <OutlinedInput
                      id="password-input"
                      label="סיסמא"
                      name="password"
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
                  </FormControl>
                  {/* <PasswordInput /> */}
                  <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                      width: "100%",
                      py: 0.5,
                      fontSize: { xs: 17, sm: 20 },
                    }}
                  >
                    התחברו
                  </Button>
                </Stack>
              </form>
              <Stack direction="column" spacing={2} pt={2} alignItems="center">
                <Typography sx={subtitleTypoSX} px={4}>
                  עדיין לא הצטרפתם למהפכה של WeddingWise?
                </Typography>
                <Button
                  variant="contained"
                  onClick={routeToSignUp}
                  sx={{ py: 1, fontSize: { xs: 17, sm: 20 }, color: "white" }}
                >
                  הרשמו עכשיו!
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        {screenAboveSM && <Box sx={imageBoxSX}></Box>}
      </Stack>
    </Container>
  );
}

export default Login;

// ============================== styles ==============================

const containerSX = {
  height: "100vh",
  "&.MuiContainer-root": {
    padding: 0,
  },
};

const loginStackSX = {
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  background: customTheme.colorBg.main,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.5,
  },
};

const paperSX = {
  width: { xs: "90%" },
  maxWidth: "500px",
  minHeight: "600px",
  backgroundColor: "transparent",
  position: "relative",
};

const imageBoxSX = {
  backgroundImage: `url(assets/login.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  maxWidth: "700px",
  width: "60%",
  height: "100%",
};

const titleTypoSX = {
  typography: { xs: "h4", sm: "h3", lg: "h2" },
  textAlign: "center",
  px: 2,
};

const subtitleTypoSX = {
  typography: { xs: "h6", sm: "h5" },
  position: "relative",
  textAlign: "center",
};