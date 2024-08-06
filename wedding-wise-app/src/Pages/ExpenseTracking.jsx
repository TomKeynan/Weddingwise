import React from "react";
import Expances from "../components/Planner/ExpenseTracking/Expances";
import SourcesOfMoney from "../components/Planner/ExpenseTracking/SourcesOfMoney";
import { Stack, Typography } from "@mui/material";
import { customTheme } from "../store/Theme";
//import SourcesOFMoney from '../components/Planner/FinanceTracking/SourcesOFMoney'

function ExpenseTracking() {
  return (
    <Stack alignItems="center" sx={loginStackSX}>
      <Typography sx={titleSX}>מעקב אחר הוצאות</Typography>
      <Typography
        sx={{
          fontSize: { xs: 18, sm: 22, md: 28 },
          textAlign: "center",
          p: { xs: 1, sm: 3 },
          mb: { xs: 5, sm: 8 },
          width: { xs: "80%", sm: "70%", md: "60%" },
        }}
      >
        כאן תוכלו לעקוב ולשלוט בקלות אחר כל ההוצאות של החתונה,
        לנהל את התקציב בצורה יעילה ולהבטיח שהכל מתנהל בהתאם לתכנון הכספי שלכם.
      </Typography>
    </Stack>
    // <>
    // <Expances />
    // <br />
    // <SourcesOfMoney />
    // </>
  );
}

export default ExpenseTracking;

const loginStackSX = {
  // minHeight: "inherit",
  pb: 10,
  width: { xs: "95%", sm: "85%" },
  margin: "0 auto",
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 30, sm: 45, md: 65 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },

  // textDecoration: "underline",
  // WebkitTextStrokeColor: "black",
};
