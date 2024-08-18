import React from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "react-multi-carousel/lib/styles.css";
import { customTheme } from "../../store/Theme";
import { useNavigate } from "react-router-dom";

function Description() {
  const navigate = useNavigate();
  const screenAboveMD = useMediaQuery("(min-width: 1024px)");
  const screenUnderSM = useMediaQuery("(max-width: 600px)");

  if (screenUnderSM) {
    return (
      <Stack
        alignItems="center"
        sx={{
          width: "95%",
          margin: "0 auto",
          px: { xs: 1, sm: 4, md: 5 },
          py: 1,
        }}
        direction="column-reverse"
        columnGap={1}
      >
        {screenAboveMD && (
          <Stack>
            <img
              src="./assets/home_pics/emojis.png"
              alt="emojis"
              className="supplier-card-image"
            />
          </Stack>
        )}
        <Stack rowGap={3} alignItems="center" sx={stackTextWrapper}>
          <Typography sx={titleSX}>מהפכה של שמחה... </Typography>
          <Typography sx={StackTextSX}>
            אתר שעוזר לכם לתכנן את החתונה שלכם זה{" "}
            <Box component="span" sx={titleSX}>
              Wise
            </Box>
          </Typography>
          <Typography sx={StackTextSX}>
            האתר שמתכנן עבורם את החתונה שלכם בלחיצת כפתור זה{" "}
            <Box component="span" sx={titleSX}>
              WeddingWise
            </Box>
          </Typography>
          <Typography sx={StackTextSX}>
            בחירת כל הספקים לפי מה שחשוב לכם. ללא חריגות בתקציב, בזבוז זמן או
            תסכול.
          </Typography>
          <Button
            variant="contained"
            sx={buttonSX}
            onClick={() => {
              navigate("/package");
            }}
          >
            צור חבילה
          </Button>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Paper variant="elevation" elevation={6} sx={paperSX}>
        <Stack
          alignItems="center"
          justifyContent="space-around"
          sx={{ width: "100%", margin: " 0 auto" }}
          direction="row"
          columnGap={3}
        >
          {screenAboveMD && (
            <Stack>
              <img
                src="./assets/home_pics/emojis.png"
                alt="emojis"
                className="emojis"
              />
            </Stack>
          )}
          <Stack rowGap={5} alignItems="center" sx={stackTextWrapper}>
            <Typography sx={titleSX}>מהפכה של שמחה... </Typography>
            <Typography sx={StackTextSX}>
              אתר שעוזר לכם לתכנן את החתונה שלכם זה{" "}
              <Box component="span" sx={titleSX}>
                Wise
              </Box>
            </Typography>
            <Typography sx={StackTextSX}>
              אתר שמתכנן עבורכם את החתונה בלחיצת כפתור זה{" "}
              <Box component="span" sx={titleSX}>
                WeddingWise
              </Box>
            </Typography>
            <Typography sx={StackTextSX}>
              בחירת כל הספקים לפי מה שחשוב לכם. ללא חריגות בתקציב, בזבוז זמן או
              תסכול.
            </Typography>
            <Button
              variant="contained"
              sx={buttonSX}
              onClick={() => {
                navigate("/package");
              }}
            >
              צור חבילה
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }
}

export default Description;

const paperSX = {
  width: "80%",
  px: { xs: 2, sm: 4, md: 5 },
  py: 6,
  backgroundColor: "rgba(255,255,255, 0.6)",
  borderTopLeftRadius: 50,
  borderBottomRightRadius: 50,
  position: "relative",
  textAlign: "center",
  height: "100%",
  margin: "60px auto",
};

const stackTextWrapper = {
  width: { xs: "90%", lg: "50%" },
  px: { xs: 1, sm: 5 },
  textAlign: "center",
};

const titleSX = {
  fontSize: { xs: 22, sm: 28, md: 38 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
  color: customTheme.palette.secondary.dark,
  WebkitTextStrokeWidth: 2,
};

const StackTextSX = {
  fontSize: { xs: 18, sm: 22, md: 26 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
  color: customTheme.palette.black,
};

const buttonSX = {
  fontSize: { xs: 18, sm: 24, md: 26 },
  fontWeight: "bold",
  px: { xs: 2, sm: 6 },
  border: 2,
  bgcolor: customTheme.palette.secondary.dark,
  py: 1,
  ":hover": {
    bgcolor: "white",
    color: customTheme.palette.secondary.dark,
    borderColor: customTheme.palette.primary.dark,
    border: 2,
  },
};
