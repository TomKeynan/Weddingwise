import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { customTheme } from "../../store/Theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import FadeIn from "../FadeIn";

function RandomPackage() {
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  const navigate = useNavigate();

  function handleClick() {
    navigate("/sign-up");
  }

  return (
    <Container maxWidth="xxl" sx={{ pb: 8, minHeight: "100vh" }}>
      <Box mt={3} pb={3}>
        <Typography
          variant="h2"
          sx={{
            px: { xs: 4, sm: 10 },
            textAlign: "center",
            fontSize: { xs: 24, sm: 34 },
            lineHeight: 1.5,
            fontWeight: 700,
            fontFamily: customTheme.font.main,
          }}
        >
          תפסיקו להיות לחוצים ותתנו ל-
          <Box
            component="strong"
            color="primary.main"
            sx={{ fontWeight: "bold", fontSize: { xs: 28, sm: 36 } }}
          >
            W
          </Box>
          edding
          <Box
            component="strong"
            color="primary.main"
            sx={{ fontWeight: "bold", fontSize: { xs: 28, sm: 36 } }}
          >
            W
          </Box>
          ise לטפל בהכנות לחתונה המדהימה שלכם
        </Typography>
      </Box>
      {/* ============== tablet/desktop screen ============== */}
      {screenAboveSM && (
        <Stack spacing={10} alignItems="center">
          <FadeIn>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  ניהול רשימות המוזמנים באופן הכי פשוט שיש
                </Typography>
              </Stack>
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  המלצה על נבחרת נותני השירות המתאימים ביותר{" "}
                  <Box
                    component="strong"
                    sx={{ fontSize: 22, color: "primary.main" }}
                  >
                    עבורכם!
                  </Box>
                </Typography>
              </Stack>
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  חלוקה מיטבית של תקציב החתונה ללא חריגות
                </Typography>
              </Stack>
            </Stack>
          </FadeIn>
          <Box>
            <Button variant="outlined" onClick={handleClick} sx={registerBtnSx}>
              הרשמו עכשיו!
            </Button>
          </Box>
          <FadeIn>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  מעקב אחר כל השלבים בתכנון החתונה שלכם.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  מאגר נותני השירות המקצועים והטובים ביותר בתחום.
                </Typography>
              </Stack>
              <Stack spacing={2} sx={descriptionStackSx}>
                <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
                <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                  ממשק קליל ונוח לניהול ושליטה על כלל ההוצאות.
                </Typography>
              </Stack>
            </Stack>
          </FadeIn>
        </Stack>
      )}
      {/* ============== mobile screen ============== */}
      {!screenAboveSM && (
        <Stack
          spacing={4}
          justifyContent="space-around"
          alignItems="center"
          sx={{ pb: 3 }}
        >
          <FadeIn>
            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                ניהול רשימות המוזמנים באופן הכי פשוט שיש
              </Typography>
            </Stack>
            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                המלצה על נבחרת נותני השירות המתאימים ביותר{" "}
                <Box
                  component="strong"
                  sx={{ fontSize: 22, color: "primary.main" }}
                >
                  עבורכם!
                </Box>
              </Typography>
            </Stack>
            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                חלוקה מיטבית של תקציב החתונה ללא חריגות
              </Typography>
            </Stack>

            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                מעקב אחר כל השלבים בתכנון החתונה שלכם.
              </Typography>
            </Stack>
            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                מאגר נותני השירות המקצועים והטובים ביותר בתחום.
              </Typography>
            </Stack>
            <Stack spacing={2} sx={descriptionStackSx}>
              <img src="assets/w-icon.png" alt="w-icon" className="w-icon" />
              <Typography variant="h6" textAlign="center" sx={innerTypoSX}>
                ממשק קליל ונוח לניהול ושליטה על כלל ההוצאות.
              </Typography>
            </Stack>
          </FadeIn>
          <Box>
            <Button variant="outlined" onClick={handleClick} sx={registerBtnSx}>
              הרשמו עכשיו!
            </Button>
          </Box>
        </Stack>
      )}
    </Container>
  );
}

export default RandomPackage;

// ====================== Styles ======================

const descriptionStackSx = {
  alignItems: "center",
  px: 4,
};

const innerTypoSX = {
  maxWidth: 300,
  fontWeight: "bold",
  fontFamily: customTheme.font.main,
};

const registerBtnSx = {
  bgcolor: "white",
  borderRadius: 10,
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 2, sm: 3 },
  py: 0,
  fontSize: { xs: 20, sm: 30 },
  borderWidth: 3,
  "&.MuiButtonBase-root:hover": {
    bgcolor: customTheme.palette.primary.dark,
    borderColor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};
