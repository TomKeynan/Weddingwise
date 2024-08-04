import React from "react";
import { Stack, Typography } from "@mui/material";

import RegisterContextProvider from "../store/RegisterContext";
import EditCouple from "../components/EditCouple";
import AppContextProvider from "../store/AppContext";
import QuestionsContextProvider from "../store/QuestionsContext";
import { customTheme } from "../store/Theme";

function EditDetails() {
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
            spacing={2}
            justifyContent="center"
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h4" sx={titleSX}>
              עריכה ועדכון פרטים
            </Typography>
            <Typography variant="h5">
              אנא שנו אחד או יותר מהפרטים הקיימים.
            </Typography>
            <Typography variant="h5">
              יש לוודא שבחירת הפרטים החדשים הגיונית
            </Typography>
          </Stack>
          <EditCouple />
        </Stack>
      </QuestionsContextProvider>
    </RegisterContextProvider>
  );
}

export default EditDetails;

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
  // WebkitTextStrokeColor: "black",
};
