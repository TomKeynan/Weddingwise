import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import useFetch from "../utilities/useFetch";
import { loginResponse } from "../utilities/collections";
import {
  Container,
  Stack,
  Box,
  Paper,
  Typography,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Alert,
} from "@mui/material/";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import SupplierContainBtn from "../components/buttons/SupplierContainBtn";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";
import { auth } from "../fireBase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AppContext } from "../store/AppContext";
import { useUserStore } from "../fireBase/userStore";
import { useGlobalStore } from "../fireBase/globalLoading";

function SupplierLogin() {
  const { sendData, resData, error, loading } = useFetch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState(false);
  const { setSupplierData, setEditSupplier } = useContext(AppContext);
  const {  fetchUserInfo } = useUserStore(); 
  const navigate = useNavigate();

  const { setGlobalLoading,globalLoading } = useGlobalStore(); 

  useEffect(() => {
    const loginAndNavigate = async () => {
      if (resData) {
        try {
      
          await loginFireBase();

          if (auth.currentUser?.uid) {
            await fetchUserInfo(auth.currentUser.uid);
          }
          sessionStorage.setItem("currentSupplier", JSON.stringify(resData));
          setSupplierData(resData);
          setEditSupplier(resData);
          navigate("/supplier-private-Profile");
          
        } catch (err) {
          setGlobalLoading(false);
          console.error("Login or navigation failed:", err);
        } finally {
          setGlobalLoading(false);
        }
      }
    };

    loginAndNavigate();
  }, [resData, email, password, fetchUserInfo, navigate]);

  const loginFireBase = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setFirebaseError(true);
      throw new Error("Login failed. Please check your credentials.");
    }
  };
  // useMediaQuery return a boolean that indicates rather the screen size
  // matches the breakpoint/string media query , or not
  const screenAboveSM = useMediaQuery("(min-width: 600px)");

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setEmail(data.Email);
    setPassword(data.Password);
    setGlobalLoading(true);
    sendData("/Suppliers/getSupplier", "POST", data);
    setFirebaseError(false);
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container sx={containerSX} maxWidth="xxl">
      {globalLoading && <Loading />}
      <Stack direction="row" height="100%">
        {screenAboveSM && <Box sx={imageBoxSX}></Box>}
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
                onClick={() => navigate("/suppliers")}
              />
              <Typography sx={titleTypoSX}>היי, טוב לראותך!</Typography>
              <Typography sx={subtitleTypoSX}>מלאו את הפרטים שלכם</Typography>
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
                      name="Email"
                      type="text"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disableRipple
                            edge="end"
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fill: customTheme.supplier.colors.primary.dark,
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
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fill: customTheme.supplier.colors.primary.dark,
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  {error && (
                    <Alert severity="error" sx={{ fontSize: 16, mt: 0 }}>
                      {loginResponse[error]}
                    </Alert>
                  )}
                  {firebaseError && (
                    <Alert severity="error" sx={{ fontSize: 16, mt: 0 }}>
                      סיסמא או אימייל אינם נכונים{" "}
                    </Alert>
                  )}
                  <SupplierOutlineBtn
                    type="submit"
                    value="התחברו"
                    width="100%"
                    fontSize={{ xs: 17, sm: 20 }}
                    sx={{
                      py: 0.5,
                    }}
                  />
                </Stack>
              </form>
              <Stack direction="column" spacing={2} pt={2} alignItems="center">
                <Typography sx={subtitleTypoSX} px={4}>
                  עדיין לא הצטרפתם למהפכה של WeddingWise?
                </Typography>
                <SupplierContainBtn
                  value="הרשמו עכשיו!"
                  onClick={() => navigate("/supplier-signup")}
                  fontSize={{ xs: 17, sm: 20 }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}

export default SupplierLogin;

// ============================== styles ==============================

const containerSX = {
  height: "100vh",
  position: "relative",
  "&.MuiContainer-root": {
    padding: 0,
  },
};

const loginStackSX = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  "&.MuiContainer-root": {
    padding: 0,
  },
  background: customTheme.supplier.colorBg.main,
};

const paperSX = {
  width: { xs: "90%" },
  maxWidth: "500px",
  minHeight: "600px",
  pb: 5,
  backgroundColor: "transparent",
  position: "relative",
};

const imageBoxSX = {
  backgroundImage: `url(assets/supplier_LP/login.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "70%",
  height: "100%",
};

const titleTypoSX = {
  color: customTheme.supplier.colors.primary.main,
  typography: { xs: "h4", sm: "h3", lg: "h2" },
  textAlign: "center",
  px: 2,
};

const subtitleTypoSX = {
  typography: { xs: "h6", sm: "h5" },
  position: "relative",
  textAlign: "center",
};
