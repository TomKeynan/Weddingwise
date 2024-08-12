import React from "react";
import Navbar from "../Navbar";
import { Box, Button, Stack, Typography } from "@mui/material";
import { customTheme } from "../../store/Theme";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  return (
    <Stack sx={heroWrapperSX}>
      <Box sx={heroBgSX}></Box>
      <Navbar isLayout={false} />
      <Stack alignItems="center" justifyContent="space-around" sx={heroContent}>
        <Stack sx={heroRightSide}>
          <Typography
            color={customTheme.palette.primary.light}
            sx={heroRightSideTextTop}
          >
            בואו איתנו לתכנן את החתונה המושלמת עבורכם
          </Typography>
          <Typography sx={heroRightSideTextBottom}>
            כאן תוכלו למצוא בקליק את כל נותני השירות שייקחו חלק באירוע שלכם.
          </Typography>
          {screenAboveSM && (
            <Stack
              direction="row"
              sx={{
                width: "100%",
                justifyContent: { xs: "space-around", md: "center" },
                columnGap: { xs: 0, md: 5 },
                mb: 5,
              }}
            >
              <Button variant="contained" sx={heroActionBtn} onClick={() => navigate("/package")}>
                מידע נוסף
                <ArrowForwardIosIcon />
              </Button>
              <Button
                variant="contained"
                sx={heroActionBtn}
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                הרשמה
                <ArrowOutwardIcon />
              </Button>
            </Stack>
          )}
        </Stack>

        <Stack justifyContent="center" alignItems="center" sx={heroLeftSide}>
          {!screenAboveSM && (
            <Stack
              direction="row"
              sx={{
                width: "90%",
                justifyContent: { xs: "center", md: "start" },
                columnGap: { xs: 5, sm: 15, md: 10 },
              }}
            >
              <Button variant="contained" sx={heroActionBtn}>
                מידע נוסף
                <ArrowForwardIosIcon />
              </Button>
              <Button
                variant="contained"
                sx={heroActionBtn}
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                הרשמה
                <ArrowOutwardIcon />
              </Button>
            </Stack>
          )}
          <Stack
            direction="row"
            sx={{ columnGap: { xs: 5, sm: 10, md: 8, lg: 12 } }}
          >
            <img
              src="./assets/home_pics/bride.png"
              alt="bride"
              className="hero-graphics"
            />
            <img
              src="./assets/home_pics/groom.png"
              alt="groom"
              className="hero-graphics"
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Hero;

const heroWrapperSX = {
  minHeight: "100vh",
};

const heroBgSX = {
  position: "absolute",
  minWidth: "100%",
  minHeight: "100vh",
  backgroundImage: `url(assets/home_pics/hero1.jpg)`,
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
};

const heroContent = {
  flexDirection: { xs: "column", md: "row" },
  width: "85%",
  zIndex: 1,
  margin: "auto",
};

const heroRightSide = {
  width: { xs: "100%", md: "40%" },
  py: { xs: 1, md: 3, lg: 6 },
  pr: { xs: 1, md: 10 },
  fontFamily: "Varela-Round",
  flexGrow: 1,
  textAlign: { xs: "center", md: "left" },
  rowGap: 5,
  textAlign: "center",
};

const heroRightSideTextTop = {
  fontSize: { xs: 26, sm: 33, md: 48 },
  letterSpacing: { xs: 3, sm: 5 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
  WebkitTextStrokeWidth: 2,
  WebkitTextStrokeColor: customTheme.palette.primary.light,
  textShadow: " 0px 5px 5px #282828",
};

const heroRightSideTextBottom = {
  fontSize: { xs: 24, sm: 26, md: 38 },
  color: "white",
  fontWeight: "bold",
  letterSpacing: { xs: 3, sm: 4 },
  WebkitTextStrokeColor: customTheme.palette.primary.light,
  textShadow: " 0px 5px 5px #282828",
};

const heroLeftSide = {
  width: { xs: "100%", sm: "30%" },
  rowGap: 5,
};

const heroActionBtn = {
  border: 2,
  py: 1,
  px: { xs: 1, sm: 3 },
  fontSize: { xs: 15, sm: 20 },
  ":hover": {
    bgcolor: "white",
    color: customTheme.palette.primary.main,
    borderColor: customTheme.palette.primary.main,
    border: 2,
  },
};
