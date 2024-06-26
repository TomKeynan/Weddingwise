import React from "react";
import Questions from "../components/QuestionnairePage/Questions";
import { Box, Stack, Typography } from "@mui/material";
import QuestionsContextProvider from "../store/QuestionsContext";

const Questionnaire = () => {
  return (
    <QuestionsContextProvider>
      <Stack
        spacing={4}
        alignItems="center"
        sx={{ width: "95%", margin: "0 auto", pb: 8 }}
      >

        <Typography sx={{ fontSize: { xs: 30, sm: 36, md: 60 } }}>
          שאלון העדפות
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: 20, sm: 25, md: 50 } }}
        >
          יש לענות על כל השאלות
        </Typography>
        <Questions />
      </Stack>
    </QuestionsContextProvider>
  );
};

export default Questionnaire;
