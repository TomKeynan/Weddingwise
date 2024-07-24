import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { customTheme } from "../../../store/Theme";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../OutlinedButton";
import { AppContext } from "../../../store/AppContext";

function TaskListNoUser() {
  const navigate = useNavigate();

  const { coupleData } = useContext(AppContext);
  function handleClick() {
    navigate("/login");
  }
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        textAlign: "center",
        flexDirection: "column",
        rowGap: 7,
        mt: 6,
        pb: 8,
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ px: 5 }}>
        <Typography variant="h3">תכנון חתונה זה לא קל.</Typography>
        <Typography variant="h5">לא יודעים מאיפה להתחיל?</Typography>
        <Typography variant="h5">
          הכנו לכם דף לניהול משימות, עם כל המשימות שכדאי שתעשו.
        </Typography>
      </Stack>
      <Stack
        alignItems="center"
        justifyContent="space-around"
        sx={{
          gap: 5,
          width: { xs: "95%", md: "80%" },
          mx: "auto",
          mt: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Paper elevation={3} sx={paper1_SX}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={paperContentSX}
          >
            <Stack justifyContent="center" sx={squareSX}>
              1
            </Stack>
            <Typography textAlign="center" sx={typography1_SX}>
              הוספה והסרה של משימות.
            </Typography>
          </Stack>
        </Paper>
        <Paper elevation={3} sx={paper1_SX}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={paperContentSX}
          >
            <Stack justifyContent="center" sx={squareSX}>
              2
            </Stack>
            <Typography textAlign="center" sx={typography1_SX}>
              תתי משימות המשוכיים לכל משימה.
            </Typography>
          </Stack>
        </Paper>
        <Paper elevation={3} sx={paper1_SX}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={paperContentSX}
          >
            <Stack justifyContent="center" sx={squareSX}>
              3
            </Stack>
            <Typography textAlign="center" sx={typography1_SX}>
              אזור להערות אישיות.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
      <OutlinedButton btnValue="התחברו" handleClick={handleClick} />
    </Box>
  );
}

export default TaskListNoUser;

const paper1_SX = {
  width: { xs: 180, sm: 200, md: 250 },
  height: { xs: 180, sm: 200, md: 250 },
};

const paper2_SX = {
  width: { xs: 250, sm: 350, md: 450 },
  height: { xs: 250, sm: 270, md: 300 },
  px: 2,
};

const paperContentSX = { minHeight: "100%", px: 2, position: "relative" };

const squareSX = {
  width: 50,
  height: 50,
  border: 1,
  bgcolor: customTheme.palette.primary.light,
  position: "absolute",
  top: -25,
  textAlign: "center",
  fontSize: { xs: 22, sm: 26, md: 28 },
  fontWeight: "bold",
};

const typography1_SX = {
  fontSize: { xs: 16, sm: 18, md: 24 },
  fontWeight: "bold",
};

const submitBtnSX = {
  bgcolor: "white",
  borderRadius: 10,
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 1, sm: 3 },
  py: 0,
  fontSize: { xs: 18, sm: 25 },
  borderWidth: 3,
  position: "relative",
  left: { xs: 5, sm: 15 },
  "&.MuiButtonBase-root:hover": {
    bgcolor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};
