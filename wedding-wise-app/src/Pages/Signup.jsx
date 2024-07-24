import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import Registration from "../components/SignupPage/Registration";
import RegisterContextProvider from "../store/RegisterContext";

const Signup = () => {
  return (
    <RegisterContextProvider>
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: { xs: "90%", sm: "70%", md: "60%"},
          margin: "auto",
          minHeight: "inherit",
        }}
      >
        <Typography sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }}>
          שמחים שבחרתם להצטרף למהפכת החיפוש שלנו!
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: 20, sm: 24, md: 26 } }}
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
