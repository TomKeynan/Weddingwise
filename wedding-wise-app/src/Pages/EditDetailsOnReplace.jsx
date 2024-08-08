import React from "react";
import { Stack, Typography } from "@mui/material";
import RegisterContextProvider from "../store/RegisterContext";
import EditCouple from "../components/EditCouple";
import QuestionsContextProvider from "../store/QuestionsContext";
import { customTheme } from "../store/Theme";

function EditDetailsOnReplace() {
  return (
    <RegisterContextProvider>
      <QuestionsContextProvider>

        <Stack
          alignItems="center"
          spacing={3}
          sx={{ width: "90%", margin: "0 auto", minHeight: "100vh" }}
        >
          <Stack alignItems="center" sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={titleSX}>
              עריכה ועדכון פרטים
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 22, md: 28 },
                textAlign: "center",
                p: { xs: 1, sm: 3 },
                width: { xs: "80%", sm: "70%" },
                margin: "0 auto",
              }}
            >
              על מנת להחליף חבילה עליכם לשנות לפחות אחד מפרטי החתונה שהזנתם.
              בנוסף תוכלו למלא את השאלון מחדש לאחר מכן. יש לוודא שבחירת הפרטים
              החדשים הגיונית
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            sx={{ width: { xs: "90%", sm: "80%", lg: "60%" } }}
          >
            <EditCouple />
          </Stack>
        </Stack>
      </QuestionsContextProvider>
    </RegisterContextProvider>
  );
}

export default EditDetailsOnReplace;

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
};
