import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { customTheme } from "../../store/Theme";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../buttons/OutlinedButton";
import { AppContext } from "../../store/AppContext";
import { Update } from "@mui/icons-material";
function UserWithoutPackage() {
  const navigate = useNavigate();

  const { coupleData, setEditCoupleComeFrom } = useContext(AppContext);
  function handleClick() {
    navigate("/questionnaire");
  }

  function handleUpdateDetails() {
    setEditCoupleComeFrom('questionnaire')
    navigate("/edit-couple-details")
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
        <Typography variant="h3">
          שלום {coupleData.partner1Name} ו{coupleData.partner2Name}, כאן מתחיל
          החלק המעניין!
        </Typography>
        <Typography variant="h5">
          לפני שעוברים להשיב על השאלון, מומלץ לקרוא את ההוראות
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
              בכל שאלה יוצגו בפניכם שני סוגים שונים של נותני שירות.
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
              עליכם לבחור מי מבין השניים חשוב לכם יותר ובאיזה מידה.
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
              בכל שלב בשאלון ניתן לחזור אחורה ולשנות את הבחירה שלכם.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
      <Stack alignItems="center" justifyContent="center">
        <Paper elevation={3} sx={paper2_SX}>
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={paperContentSX}
          >
            <Stack justifyContent="center" sx={squareSX}>
              4
            </Stack>
            <Typography textAlign="center" sx={typography1_SX}>
              שימו לב! הפרטים הבאים הינם בעלי חשיבות בתהליך ההמלצה עבורכם:
              תאריך, תקציב, מיקום וכמות מוזמנים. במידת הצורך מומלץ לעדכנם לפני
              המענה על השאלון.
            </Typography>
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              onClick={handleUpdateDetails}
            >
              עדכן פרטים
            </Button>
          </Stack>
        </Paper>
      </Stack>
      <OutlinedButton btnValue="התחל שאלון" handleClick={handleClick} />
    </Box>
  );
}

export default UserWithoutPackage;

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
