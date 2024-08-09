import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { customTheme } from "../../store/Theme";
import { convertDateToClientFormat } from "../../utilities/functions";
import Loading from "../Loading";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../fireBase/userStore";

function ProfileBanner({ props }) {
  const screenAboveSM = useMediaQuery("(min-width: 900px)");
  // const auth = getAuth();
  // const [user, loading] = useAuthState(auth);
  const { currentUser } = useUserStore();


  const { partner1Name, partner2Name, desiredDate } = props;

  return (
    <Stack
      direction={screenAboveSM ? "row" : "column"}
      justifyContent="space-around"
      sx={bannerSX}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", zIndex: 1 }}
      >
        <Typography sx={namesSX}>
          {`${partner1Name} & ${partner2Name}`}
        </Typography>
        <Typography sx={weddingDateSX}>
          {convertDateToClientFormat(desiredDate)}
        </Typography>
      </Stack>
      <Stack justifyContent="center" alignItems="center" sx={{ zIndex: 1 }}>
        <Box
          sx={{
            border: "1px solid black",
            width: { xs: 250, sm: 300, lg: 400 },
            height: { xs: 250, sm: 300, lg: 400 },
            // aspectRatio: "1/1",
            borderRadius: "20%",
            position: { xs: "absolute", md: "relative" },
            bottom: { xs: "-40%", sm: "-30%", md: "0%" },
            // mt: 10
          }}
        >
          <Box
            component="img"
            src={currentUser?.avatar}
            sx={{
              width: { xs: 250, sm: 300, lg: 400 },
              // height: { xs: 250, sm: 400 , md: 350, lg: 400},
              aspectRatio: "1/1",
              borderRadius: "20%",
              objectFit: "cover",
            }}
          ></Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ProfileBanner;

const bannerSX = {
  position: "relative",
  minHeight: { xs: 320, sm: 400, md: 500, lg: 700 },
  top: -90,
  minWidth: "100%",
  backgroundImage: `url(assets/profileBanner.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "left",
  boxShadow: customTheme.shadow.strong,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: { xs: "rgba(0,0,0,0.1)", sm: "rgba(0,0,0,0.4)" },
  },
};

const namesSX = {
  fontFamily: customTheme.font.main,
  fontSize: { xs: 40, sm: 55, md: 70, lg: 80 },
  WebkitTextStrokeWidth: { xs: 2, sm: 5 },
  color: { sm: "secondary.main" },
  WebkitTextStrokeWidth: { xs: 2, sm: 0.7 },
  // WebkitTextStrokeColor: "black",
  fontWeight: "bold",
};

const weddingDateSX = {
  fontSize: { xs: 35, sm: 45, md: 55, lg: 70 },
  letterSpacing: { xs: 5, sm: 10, md: 15 },
  fontWeight: "lighter",
  color: { sm: "secondary.main" },
  fontFamily: customTheme.font.main,
  WebkitTextStrokeWidth: { xs: 2, sm: 0.5 },
  // WebkitTextStrokeColor: "black",
  fontWeight: "bold",
  // fontFamily: "system-ui",
};
