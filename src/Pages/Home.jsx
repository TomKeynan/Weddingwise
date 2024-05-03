import React from "react";
import Navbar from "../components/Navbar";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const Home = () => {
  const navigate = useNavigate();

  function routToProfile() {
    navigate("/profile");
  }

  function routeToSignUp() {
    navigate("/sign-up");
  }

  function routeToLogin() {
    navigate("/login");
  }

  return (
    <Stack>
      <Stack sx={heroWrapperSX}>
        <Box sx={heroBgSX}></Box>
        <Navbar style={"home"} />
        <Stack direction="row" sx={{ width: "85%", margin: "0 auto" }}>
          <Stack
            spacing={4}
            justifyContent="space-around"
            alignItems="start"
            sx={{ width: "50%", pl: 8, pt: 6, fontFamily: "Varela-Round" }}
          >
            <Typography
              variant="h3"
              color={customTheme.palette.primary.light}
              sx={{
                fontWeight: "bold",
                letterSpacing: 5,
                fontFamily: "Varela Round",
              }}
            >
              בואו איתנו לתכנן את החתונה המושלמת עבורכם
            </Typography>
            <Typography
              variant="h4"
              color="white"
              sx={{ fontWeight: "bold", letterSpacing: 5 }}
            >
              כאן תוכלו למצוא בקליק את כל נותני השירות שייקחו חלק באירוע שלכם.
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-around"
              sx={{ width: "100%" }}
            >
              <Button
                variant="contained"
                sx={{
                  borderColor: customTheme.palette.primary.main,
                  border: 2,
                  py: 1,
                  px: 3,
                  fontSize: 18,
                  ":hover": {
                    bgcolor: "white",
                    color: customTheme.palette.primary.main,
                    borderColor: customTheme.palette.primary.main,
                    border: 2,
                  },
                }}
              >
                מידע נוסף
                <ArrowForwardIosIcon />
              </Button>
              <Button variant="contained">
                הרשמה
                <ArrowOutwardIcon />
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "50%", columnGap: 10 }}
          >
            <img
              src="./assets/bride.png"
              alt="bride"
              className="hero-graphics"
            />
            <img
              src="./assets/groom.png"
              alt="groom"
              className="hero-graphics"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack>sdfdsf</Stack>
    </Stack>
  );
};

export default Home;

const heroWrapperSX = {
  position: "relative",
  height: "100%",
  minHeight: { xs: 300, sm: 600 },
};

const heroBgSX = {
  position: "absolute",
  zIndex: "-1",
  minWidth: "100%",
  minHeight: { xs: 300, sm: "100%" },
  backgroundImage: `url(assets/hero22.jpg)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(2px) contrast(110%) ",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: { xs: "rgba(0,0,0,0.1)", sm: "rgba(0,0,0,0.5)" },
  },
};
