import { Box, Fade, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import SupplierOutlineBtn from "../components/buttons/SupplierOutlineBtn";
import SupplierContainBtn from "../components/buttons/SupplierContainBtn";
import { customTheme } from "../store/Theme";
import FadeIn from "../components/FadeIn";
import { useNavigate } from "react-router-dom";

function SupplierLP() {
  const screenUnderMD = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();
  return (
    <>
      <Box sx={heroWrapperSX}>
        <Stack alignItems="center" sx={heroContentSX} spacing={4}>
          <Typography sx={heroText}>
            הצטרפו לקהילה שלנו והציעו את שירותיכם לזוגות המאורסים של{" "}
            <span style={{ color: "#eb77e2" }}>W</span>edding
            <span style={{ color: "#eb77e2" }}>W</span>ise
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-around"
            sx={heroBtnStackSX}
          >
            <SupplierOutlineBtn
              value="התחברו"
              width="40%"
              fontSize={{ xs: 16, sm: 20 }}
              onClick={() => navigate("/supplier-login")}
            />
            <SupplierContainBtn
              value="להרשמה"
              width="40%"
              fontSize={{ xs: 16, sm: 20 }}
              onClick={() => navigate("/supplier-signup")}
            />
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ bgcolor: "white", width: "100%" }}>
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
                  הצטרפו לפלטפורמה שלנו ותזכו לחשיפה מוגברת בקרב זוגות מאורסים
                  המחפשים את השירותים שלכם.
                </Typography>
                <img
                  src="./assets/supplier_LP/exposure.jpg"
                  alt="חשיפה מוגברת"
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
                  src="./assets/supplier_LP/constrains.jpg"
                  alt="עמידה באילוצים"
                  className="supplierLP-img1"
                />
                <Typography variant="h3" sx={bodyTextSX}>
                  מערכת ההמלצות שלנו תתאים את השירותים שלכם לזוגות הרלוונטיים
                  ביותר, בהתבסס על מיקום, תקציב וכמות אורחים.
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
                  התחברו עם נותני שירות אחרים בתעשייה וצרו קשרים עסקיים חדשים
                  שיובילו לשיתופי פעולה ורווחים נוספים.
                </Typography>
                <img
                  src="./assets/supplier_LP/collab.jpg"
                  alt="שיתופי פעולה"
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
      </Box>
    </>
  );
}

export default SupplierLP;

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
