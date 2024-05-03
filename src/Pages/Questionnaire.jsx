import React from "react";
import Questions from "../components/Questions";
import { Box, Stack, Typography } from "@mui/material";
import QuestionsContextProvider from "../store/QuestionsContext";

const Questionnaire = () => {
  return (
    <QuestionsContextProvider>
      <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
        <Typography sx={{ fontSize: { xs: 30, sm: 36, md: 40 } }}>
          שאלון העדפות
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", fontSize: { xs: 20, sm: 25, md: 30 } }}
        >
          יש לענות על כל השאלות
        </Typography>
        <Questions />
      </Stack>
    </QuestionsContextProvider>
  );
};

export default Questionnaire;
