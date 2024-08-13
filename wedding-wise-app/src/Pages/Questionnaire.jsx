import React from "react";
import Questions from "../components/QuestionnairePage/Questions";
import { Stack, Typography } from "@mui/material";
import QuestionsContextProvider from "../store/QuestionsContext";
import { customTheme } from "../store/Theme";

const Questionnaire = () => {
  return (
    <QuestionsContextProvider>
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ width: "95%", margin: "0 auto", pb: 10 }}
      >
        <Typography sx={titleSX}>שאלון העדפות</Typography>
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 18, md: 24 },
            textAlign: "center",
            px: { xs: 1, sm: 3 },
            pb: 1,
          }}
        >
          בכל שאלה בשאלון שלפניכם תדרשו לבחור מתוך שני סוגי נותני שירות את
          המועדף עליכם ובאיזה מידה.
        </Typography>
        <Questions />
      </Stack>
    </QuestionsContextProvider>
  );
};

export default Questionnaire;

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 34, md: 52 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 1 },
  textShadow: { xs: "none", sm: "1px 2px 3px #282828" },
};
