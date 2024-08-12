import React from "react";
import { stickers } from "../../utilities/collections";
import {  Grid, Paper, Stack, Typography } from "@mui/material";
import { customTheme } from "../../store/Theme";
import { useMediaQuery } from "@mui/material";
import Gmap from "./Gmap";

function MapSection() {
  const screenAboveMD = useMediaQuery("(min-width: 1460px)");
  const screenUnderSM = useMediaQuery("(max-width: 600px)");
  
  if (screenUnderSM) {
    return (
      <Stack
        alignItems="center"
        direction={screenAboveMD ? "row" : "column-reverse"}
        columnGap={5}
      >
        <Paper
          variant="elevation"
          elevation={screenAboveMD ? 4 : 0}
          sx={paperSX}
        >
          <Stack rowGap={4} alignItems="center">
            <Typography sx={StickersTextSX}>
              נרשמים, מספרים לנו מה חשוב לכם והמערכת שלנו תמליץ לכם על חבילה של
              נותני שירות.
            </Typography>
            <Grid container rowGap={3} sx={StickersContainer}>
              {stickers.map((item, index) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  lg={4}
                  sx={stickerGridItemSX}
                >
                  <Typography variant="h6">{item.stickerAlt}</Typography>
                  <img
                    className="type-card-image"
                    src={item.stickerSrc}
                    alt={item.stickerAlt}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
        <Stack
          justifyContent="space-around"
          alignItems="center"
          sx={{ height: "100%", width: "100%", textAlign: "center" }}
        >
          <Typography sx={StickersTextSX}>
            כאן תוכלו לראות היכן נמצאים אולמות האירועים
          </Typography>
          <Gmap />
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Paper variant="elevation" elevation={6} sx={mapPaperSX}>
        <Stack
          alignItems="center"
          direction={screenAboveMD ? "row" : "column-reverse"}
          columnGap={5}
        >
          <Paper
            variant="elevation"
            elevation={screenAboveMD ? 4 : 0}
            sx={paperSX}
          >
            <Stack rowGap={4}>
              <Typography sx={StickersTextSX}>
                נרשמים, מספרים לנו מה חשוב לכם והמערכת שלנו תמליץ לכם על חבילה
                של נותני שירות.
              </Typography>
              <Grid container rowGap={3} sx={StickersContainer}>
                {stickers.map((item, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={stickerGridItemSX}
                  >
                    <Typography variant="h6">{item.stickerAlt}</Typography>
                    <img
                      className="type-card-image"
                      src={item.stickerSrc}
                      alt={item.stickerAlt}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Paper>
          <Stack
            justifyContent="space-around"
            alignItems="center"
            sx={{ height: "100%", width: "100%" }}
          >
            <Typography sx={StickersTextSX}>
              כאן תוכלו לראות היכן נמצאים אולמות האירועים
            </Typography>
            <Gmap />
          </Stack>
        </Stack>
      </Paper>
    );
  }
}

export default MapSection;

const mapPaperSX = {
  width: "80%",
  px: { xs: 2, sm: 4, md: 5 },
  py: 5,
  borderTopLeftRadius: 50,
  borderBottomRightRadius: 50,
  background: customTheme.colorBg.threeColors,
  position: "relative",
  textAlign: "center",
  margin: "0 auto",
};

const paperSX = {
  width: "90%",
  px: { xs: 1, sm: 2 },
  py: 4,
  backgroundColor: { xs: "transparent", md: "rgba(255,255,255, 0.6)" },
  position: "relative",
  textAlign: "center",
  height: "100%",
  margin: "20px auto",
};

const StickersContainer = {
  width: "100%",
  p: 1,
};

const stickerGridItemSX = {
  px: 0.5,
  mb: 2,
};

const StickersTextSX = {
  fontSize: { xs: 18, sm: 22, md: 26 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
  color: customTheme.palette.black,
};
