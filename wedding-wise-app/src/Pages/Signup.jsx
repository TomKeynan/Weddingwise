import React from "react";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Registration from "../components/SignupPage/Registration";
import RegisterContextProvider from "../store/RegisterContext";
import { customTheme } from "../store/Theme";

const Signup = () => {
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  return (
    <RegisterContextProvider>
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: { xs: "90%", sm: "70%" },
          margin: "auto",
          minHeight: "inherit",
        }}
      >
        <Typography sx={titleSX}>
          שמחים שבחרתם להצטרף למהפכת החיפוש שלנו!
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: 20, sm: 24, md: 26 } }}
        >
          ההרשמה תאפשר לכם למלא שאלון קצר, לפיו{" "}
          <Box
            component="strong"
            color="primary.main"
            sx={{ fontWeight: "bold", fontSize: { xs: 28, sm: 36 } }}
          >
            W
          </Box>
          edding
          <Box
            component="strong"
            color="primary.main"
            sx={{ fontWeight: "bold", fontSize: { xs: 28, sm: 36 } }}
          >
            W
          </Box>
          ise תמליץ לכם על נותני השירות הכי מתאימים להעדפות האישיות שלכם.{" "}
        </Typography>
        <Registration />
      </Stack>
    </RegisterContextProvider>
  );
};

export default Signup;

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 1 },
  textShadow: { xs: "none", sm: "1px 2px 3px #282828" },
};
