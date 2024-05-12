import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import Registration from "../components/Registration";
import RegisterContextProvider from "../store/RegisterContext";
import { customTheme } from "../store/Theme";

const Signup = () => {
  return (
    <RegisterContextProvider>
      <Stack
        spacing={3}
        textAlign="center"
        justifyContent="center"
        // px={{ xs: 2, sm: 10, md: 20 }}
        sx={{
          width: { xs: "90%", sm: "70%", lg: "50%" },
          margin: "auto",
          height: "100vh",
        }}
      >
        <Typography sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }}>
          שמחים שבחרתם להצטרף למהפכת החיפוש שלנו!
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: 20, sm: 25, md: 30 } }}
        >
          ההרשמה תאפשר לכם למלא שאלון קצר, לפיו WeddingWise תמליץ לכם על נותני
          השירות הכי מתאימים להעדפות האישיות שלכם.{" "}
        </Typography>
        <Registration />
      </Stack>
    </RegisterContextProvider>
  );
};

export default Signup;

// const containerSX = {
//   display: "block",
//   width: "100%",
//   // minHeight: "100vh",
//   pb:10,
//   position: "relative",
//   "&.MuiContainer-root": {
//     padding: 0,
//   },
//   background: customTheme.colorBg.main,
// };
