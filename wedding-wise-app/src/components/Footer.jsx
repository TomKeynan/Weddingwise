import React, { useContext } from "react";
import { customTheme } from "../store/Theme";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../store/AppContext";

function Footer() {
  const { coupleData } = useContext(AppContext);

  const screenAboveSM = useMediaQuery("(min-width: 600px)");

  const navigate = useNavigate();

  return (
    <Stack sx={footerWrapperSX}>
      <Stack
        direction={screenAboveSM ? "row" : "column-reverse"}
        sx={footerTopSectionSX}
      >
        <Stack alignItems="center" sx={footerNavSX}>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              rowGap: 6,
            }}
          >
            <Link to="/">דף הבית</Link>
            {coupleData && <Link to="/profile">פרופיל</Link>}
            <Link to="/package">חבילה</Link>
            {coupleData && <Link to="/tasks">רשימת משימות</Link>}
            {coupleData && <Link to="/invitees">טבלת מוזמנים</Link>}
            {coupleData && <Link to="/expense-tracking">מעקב הוצאות</Link>}
            {!coupleData && <Link to="/planner">תכנון חתונה</Link>}
          </ul>
        </Stack>
        <Stack alignItems="center" sx={leftSideSX}>
          <Typography sx={{ fontSize: { xs: 24, sm: 30, md: 40 } }}>
            בעלי עסקים הצטרפו היום למערכת החיפוש המתקדמת שלנו
          </Typography>
          <Button
            variant="contained"
            sx={signupBtn}
            onClick={() => navigate("/supplier-signup")}
          >
            אני רוצה להצטרף!
          </Button>
        </Stack>
      </Stack>
      <Stack justifyContent="center" alignItems="center">
        <Typography sx={copyRightsSX}>
          This Website Is Powered By TAO Group
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Footer;

const footerWrapperSX = {
  justifyContent: "space-around",
  alignItems: "center",
  rowGap: 5,
  width: "100%",
  py: 5,
  height: 700,
  background: customTheme.colorBg.footer,
  boxShadow: customTheme.shadow.footer,
};

const footerTopSectionSX = {
  justifyContent: "space-between",
  alignItems: "center",
  width: { xs: "90%", md: "60%" },
  px: { xs: 1, sm: 3, md: 5 },
};

const leftSideSX = {
  rowGap: { xs: 3, sm: 5 },
  width: { xs: "80%", sm: "50%", md: "60%" },
  textAlign: "center",
};

const footerNavSX = { fontSize: 26, py: 3 };

const copyRightsSX = {
  fontSize: { xs: 18, sm: 22, md: 26 },
  textAlign: "center",
  px: 2,
  fontFamily: "Varela Round",
  fontWeight: "bold",
  color: customTheme.palette.black,
};

const signupBtn = {
  border: 2,
  py: 1,
  px: { xs: 1, sm: 3 },
  fontSize: { xs: 15, sm: 20 },
  ":hover": {
    bgcolor: "white",
    color: customTheme.palette.primary.main,
    borderColor: customTheme.palette.primary.main,
    border: 2,
  },
};
