import React from "react";
import { Stack, Typography } from "@mui/material";
import { customTheme } from "../store/Theme";
import ExpensesTable from "../components/Planner/ExpenseTracking/ExpensesTable";
import ExpensesPeiChart from "../components/ExpensesPeiChart";

export const budgetData = [
  {
    id: 0,
    serviceName: "אלון צילום",
    sponsorName: "עומרי",
    totalCost: 13500,
    downPayment: 500,
  },
  {
    id: 1,
    serviceName: "דור תקליטן",
    sponsorName: "עומרי",
    totalCost: 10500,
    downPayment: 1500,
  },
  {
    id: 2,
    serviceName: "לורנס אולם",
    sponsorName: "שרון",
    totalCost: 140000,
    downPayment: 40000,
  },
  {
    id: 3,
    serviceName: "יסמין עיצוב",
    sponsorName: "רוני",
    totalCost: 9500,
    downPayment: 1000,
  },
];

const tempArr = budgetData.map((item, index) => {
  return { id: index, value: item.totalCost, label: item.serviceName };
});

function ExpenseTracking() {
  return (
    <Stack sx={loginStackSX}>
      <Typography sx={titleSX}>מעקב אחר הוצאות</Typography>
      <Typography
        sx={{
          fontSize: { xs: 18, sm: 22, md: 28 },
          textAlign: "center",
          p: { xs: 1, sm: 3 },
          margin: "0 auto 5px ",
          width: { xs: "80%", sm: "70%", md: "60%" },
        }}
      >
        כאן תוכלו לעקוב ולשלוט בקלות אחר כל ההוצאות של החתונה, לנהל את התקציב
        בצורה יעילה ולהבטיח שהכל מתנהל בהתאם לתכנון הכספי שלכם.
      </Typography>

      <Stack>
        <ExpensesTable />
      </Stack>
      <Stack>
        <ExpensesPeiChart data={tempArr} />
      </Stack>
    </Stack>
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
