import React from "react";
import { Stack, Typography } from "@mui/material";

import RegisterContextProvider from "../store/RegisterContext";
import EditCouple from "../components/EditCouple";
import AppContextProvider from "../store/AppContext";
import QuestionsContextProvider from "../store/QuestionsContext";
import { customTheme } from "../store/Theme";
import EditCoupleForm from "../components/EditCoupleForm";


function EditCoupleDetails() {
  return (
    <RegisterContextProvider>
      <QuestionsContextProvider>
        <Stack
          maxWidth="xl"
          // justifyContent="space-around"
          alignItems="center"
          spacing={3}
          sx={{ margin: "auto 0", minHeight: "100vh" }}
        >
          <Stack
            // spacing={2}
            justifyContent="center"
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h4" sx={titleSX}>
              עריכה ועדכון פרטים
            </Typography>
          </Stack>
          <EditCoupleForm />
        </Stack>
      </QuestionsContextProvider>
    </RegisterContextProvider>
  );
}

export default EditCoupleDetails;

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
  // WebkitTextStrokeColor: "black",
};
