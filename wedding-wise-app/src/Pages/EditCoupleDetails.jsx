import React from "react";
import { Stack, Typography } from "@mui/material";
import RegisterContextProvider from "../store/RegisterContext";
import QuestionsContextProvider from "../store/QuestionsContext";
import { customTheme } from "../store/Theme";
import EditCoupleForm from "../components/EditUser/EditCoupleForm";

function EditCoupleDetails() {
  return (
    <RegisterContextProvider>
      <QuestionsContextProvider>
        <Stack
          maxWidth="xl"
          alignItems="center"
          spacing={3}
          sx={{ margin: "auto 0", minHeight: "100vh" }}
        >
          <Stack
            justifyContent="center"
            sx={{ textAlign: "center", width: "90%" }}
          >
            <Typography variant="h4" sx={titleSX}>
              עריכה ועדכון פרטים
            </Typography>
          </Stack>
          <Stack sx={{ width: "inherent" }}>
            <EditCoupleForm />
          </Stack>
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
