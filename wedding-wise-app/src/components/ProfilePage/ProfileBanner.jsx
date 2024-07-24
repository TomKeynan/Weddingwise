import { Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../../store/Theme";
import { convertDateToClientFormat } from "../../utilities/functions";

function ProfileBanner({ props }) {
  const { partner1Name, partner2Name, desiredDate } = props;

  return (
    <Stack justifyContent="center" sx={bannerSX}>
      <Stack sx={{ textAlign: "center", zIndex: 1 }}>
        <Typography sx={namesSX}>
          {`${partner1Name} & ${partner2Name}`}
        </Typography>
        <Typography sx={weddingDateSX}>{convertDateToClientFormat(desiredDate)}</Typography>
      </Stack>
    </Stack>
  );
}

export default ProfileBanner;

const bannerSX = {
  position: "relative",
  minHeight: { xs: 300, sm: 400 },
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
  fontSize: { xs: 40, sm: 55, md: 80 },
  WebkitTextStrokeWidth: {xs: 2 , sm: 5},
  color: { sm: "secondary.light" },
};

const weddingDateSX = {
  fontSize: { xs: 35, sm: 45, md: 65 },
  letterSpacing: { xs: 5, sm: 25 },
  fontWeight: "lighter",
  color: { sm: "secondary.light" },
  fontFamily: "system-ui",
};
