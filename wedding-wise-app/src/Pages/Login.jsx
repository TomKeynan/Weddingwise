import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import useFetch from "../utilities/useFetch";
import { AppContext } from "../store/AppContext";
import { loginResponse } from "../utilities/collections";
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
  FormHelperText,
  Alert,
} from "@mui/material/";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import { auth } from "../fireBase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserStore } from "../fireBase/userStore";
import { useGlobalStore } from "../fireBase/globalLoading";

function Login() {
  const { sendData, resData, error, loading } = useFetch();
  const { updateCoupleData } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setGlobalLoading,globalLoading } = useGlobalStore();
  const { fetchUserInfo } = useUserStore();

  useEffect(() => {
    const loginAndNavigate = async () => {
      if (resData) {
        try {
      
          updateCoupleData(resData);
          await loginFireBase();

          if (auth.currentUser?.uid) {
            await fetchUserInfo(auth.currentUser.uid);
  
            navigate("/profile");
          } else {
            console.error("User is not authenticated.");
          }
        } catch (err) {
          console.error("Login or navigation failed:", err);
        } finally {
          setGlobalLoading(false); 
        }
      }
      else if (error) {
        setGlobalLoading(false);
      }
    };
  
    loginAndNavigate();
  }, [resData, navigate]);
  
  

  // loginFireBase function to log in the user to Firebase
  const loginFireBase = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Firebase login failed:", err);
      setGlobalLoading(false); 
    }
  };

  // useMediaQuery return a boolean that indicates rather the screen size
  // matches the breakpoint/string media query , or not
  const screenAboveSM = useMediaQuery("(min-width: 600px)");

  function routeToHome() {
    navigate("/");
  }

  function routeToSignUp() {
    navigate("/sign-up");
  }

  // handleSubmit function to handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
  
    // Set email and password state from form data
    setEmail(data.Email);
    setPassword(data.Password);
  
    // Start global loading before sending data
    setGlobalLoading(true);
  
    // Send data to the server
    sendData("/Couples/getCouple", "POST", data);
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  return (
    <Container sx={containerSX} maxWidth="xxl">
      {globalLoading && <Loading />}
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
                      name="Email"
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

                  {error && (
                    <Alert severity="error" sx={{ fontSize: 16, mt: 0 }}>
                      {loginResponse[error]}
                    </Alert>
                  )}
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
  position: "relative",
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
  pb: 5,
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
