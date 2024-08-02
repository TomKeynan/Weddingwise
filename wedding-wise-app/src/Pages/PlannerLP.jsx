import {
  Box,
  Container,
  Fade,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";
import SupplierContainBtn from "../components/buttons/SupplierContainBtn";
import { customTheme } from "../store/Theme";
import FadeIn from "../components/FadeIn";
import { useNavigate } from "react-router-dom";

function PlannerLP() {
  const screenUnderMD = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();
  return (
    <Container maxWidth="xxl" sx={{ pb: 8, minHeight: "100vh" }}>
      <Stack>
        <Typography sx={heroText}>
          תכננו את החתונה המושלמת שלכם בקלות וביעילות!
        </Typography>
        <Typography sx={{ ...heroText, fontSize: 16 }}>
          כל הכלים שאתם צריכים במקום אחד לניהול חתונה בלתי נשכחת.{" "}
        </Typography>
      </Stack>
      <Box sx={{ width: { xs: "100%", sm: "80%" }, margin: "0 auto" }}>
        <Typography
          sx={{
            textAlign: "center",
            px: { xs: 2, sm: 6, md: 8 },
            pb: 10,
            fontSize: { xs: 18, sm: 24, md: 30 },
            fontWeight: "bold",
            color: customTheme.supplier.colors.primary.dark,
          }}
        >
          הפכו להיות חלק ממערכת ההמלצות המובילה, שתעזור לכם להגיע ללקוחות
          פוטנציאליים בצורה פשוטה ואפקטיבית.
        </Typography>
        <Stack
          alignItems="center"
          spacing={1}
          sx={{ width: "80%", margin: "0 auto" }}
        >
          <FadeIn>
            <Stack
              direction={screenUnderMD ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              sx={bodyStackSX}
            >
              <Typography variant="h3" sx={bodyTextSX}>
                תכננו בקלות עם רשימה מובנית. קבלו רשימה מקיפה של מטלות, הוסיפו
                מטלות חדשות ותת-מטלות לכל מטלה קיימת.
              </Typography>
              <img
                src="./assets/taskList.jpg"
                alt="רשימת מטלות"
                className="supplierLP-img1"
              />
            </Stack>
          </FadeIn>
          <FadeIn>
            <Stack
              direction={screenUnderMD ? "column-reverse" : "row"}
              justifyContent="space-between"
              alignItems="center"
              sx={bodyStackSX}
            >
              <img
                src="./assets/guests.jpg"
                alt="ניהול מוזמנים"
                className="supplierLP-img1"
              />
              <Typography variant="h3" sx={bodyTextSX}>
                נהלו את כל המוזמנים שלכם במקום אחד. הוסיפו, עדכנו ומחקו מוזמנים
                בטבלה אינטואיטיבית, וקבלו תמונה ברורה של כמות המוזמנים בכל רגע.
              </Typography>
            </Stack>
          </FadeIn>
          <FadeIn>
            <Stack
              direction={screenUnderMD ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              sx={bodyStackSX}
            >
              <Typography variant="h3" sx={bodyTextSX}>
                עקבו אחר התקציב שלכם בקלות. נהלו את כל ההוצאות שלכם בממשק פשוט
                ונוח, וצפו בסטטוס התקציב בזמן אמת.
              </Typography>
              <img
                src="./assets/budget.jpg"
                alt="מעקב תקציב"
                className="supplierLP-img1"
              />
            </Stack>
          </FadeIn>
          <Box sx={{ width: "100%", textAlign: "center", pb: 10 }}>
            <SupplierContainBtn
              value="הצטרפו אלינו עכשיו!"
              width="100%"
              fontSize={{ xs: 16, sm: 20 }}
              onClick={() => navigate("/supplier-signup")}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default PlannerLP;

const heroWrapperSX = {
  minHeight: { xs: "50vh", sm: "55vh", md: "70vh" },
  backgroundImage: "url(assets/supplier_LP/LP-hero-supplier.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center bottom",
  position: "relative",
  textAlign: "center",
};

const heroContentSX = {
  p: { xs: 2, sm: 4 },
  width: { xs: "90%", sm: "70%", md: "60%" },
  margin: "auto",
};

const heroText = {
  fontSize: { xs: 24, sm: 32, md: 40 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
};

const heroBtnStackSX = {
  minWidth: "60%",
};

const bodyStackSX = {
  width: "100%",
  pb: { xs: 5, sm: 10, md: 15 },
  gap: { xs: 2, sm: 5, md: 5 },
};

const bodyTextSX = {
  flexGrow: 1,
  p: 2,
  letterSpacing: 2,
  fontSize: { xs: 16, sm: 20, md: 28 },
  width: "100%",
  textAlign: "center",
  fontFamily: customTheme.font.main,
  fontWeight: { xs: "bold", sm: "400" },
};
