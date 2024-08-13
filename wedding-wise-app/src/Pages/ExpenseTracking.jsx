import React, { useEffect, useState, useContext, useMemo } from "react";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { customTheme } from "../store/Theme";
import ExpensesTable from "../components/Planner/ExpenseTracking/ExpensesTable";
import ExpensesPeiChart from "../components/Planner/ExpenseTracking/ExpensesPeiChart";
import useFetch from "../utilities/useFetch";
import { AppContext } from "../store/AppContext";
import Loading from "../components/Loading";

function ExpenseTracking() {
  const screenUnderMD = useMediaQuery("(max-width: 900px)");
  const { getData, resData, setResData, error, setError, loading } = useFetch();
  const { coupleData } = useContext(AppContext);
  const [expensesList, setExpensesList] = useState([]);
  const [isExpensesChanged, setIsExpensesChanged] = useState(false);

  useEffect(() => {
    getData(`/Expenses/getExpenses?coupleEmail=${coupleData?.email}`);
  }, [isExpensesChanged]);

  useEffect(() => {
    if (resData) {
      setExpensesList(resData);
    }
    return () => {
      setResData(undefined);
    };
  }, [resData]);

  const peiChartData = useMemo(() => {
    const tempArr = expensesList.map((item, index) => {
      return { id: index, value: item.totalCost, label: item.serviceName };
    });
    return tempArr;
  }, [expensesList]);

  function handleAddExpense() {
    setIsExpensesChanged((prev) => !prev);
  }

  return (
    <>
      {loading && <Loading />}
      <Stack justifyContent="center" sx={loginStackSX}>
        <Typography sx={titleSX}>מעקב אחר הוצאות</Typography>
        <Typography
          sx={{
            fontSize: { xs: 18, sm: 22, md: 28 },
            textAlign: "center",
            px: { xs: 1, sm: 3 },
            margin: "0 auto 5px ",
            width: { xs: "80%" },
          }}
        >
          כאן תוכלו לעקוב בקלות אחר כל ההוצאות של החתונה ולהבטיח שהכל מתנהל
          בהתאם לתכנון הכספי שלכם.
        </Typography>

        <Stack
          direction={screenUnderMD ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          sx={{}}
        >
          <Stack
            sx={{ width: { xs: "90%", md: "55%", lg: "100%" }, pb: 5, mx: 4 }}
          >
            <ExpensesTable
              expensesList={expensesList}
              onExpensesChanged={handleAddExpense}
            />
          </Stack>
          {expensesList.length > 0 && (
            <Stack
              justifyContent="center"
              sx={{
                ml: { xs: 0, md: 10 },
                width: { xs: "80%", md: "30%" },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 20, sm: 20 },
                  fontFamily: customTheme.font.main,
                  textDecoration: "underline",
                  pb: 3,
                }}
              >
                חלוקת סה"כ העלות
              </Typography>
              <ExpensesPeiChart data={peiChartData} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default ExpenseTracking;

const loginStackSX = {
  pb: 10,
  width: { xs: "95%", sm: "80%" },
  margin: "0 auto",
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 30, sm: 40, md: 55 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
};
