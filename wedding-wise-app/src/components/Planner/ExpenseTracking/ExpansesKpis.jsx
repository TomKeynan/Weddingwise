import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../store/AppContext";
import { Grid, Stack, Paper, Typography, Tooltip } from "@mui/material";
import useFetch from "../../../utilities/useFetch";
import { addCommasToNumber } from "../../../utilities/functions";

function ExpansesKpis() {
  const { getData, resData, setResData, error, setError, loading } = useFetch();
  const { coupleData } = useContext(AppContext);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    getData(`/Expenses/getExpenses?coupleEmail=${coupleData?.email}`);
  }, []);

  useEffect(() => {
    if (resData) {
      setExpensesList(resData);
    }
    return () => {
      setResData(undefined);
    };
  }, [resData]);

  function sumTotalCost() {
    const total = expensesList.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.totalCost;
    }, 0);
    return total;
  }

  function sumDownPayment() {
    const total = expensesList.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.downPayment;
    }, 0);
    return addCommasToNumber(total);
  }

  function sumBalance() {
    const total = expensesList.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.totalCost - currentItem.downPayment);
    }, 0);
    return addCommasToNumber(total);
  }

  return (
    <Stack justifyContent="center" sx={kpiContainer}>
      <Grid container maxWidth="xxl" spacing={2} sx={{ placeItems: "center" }}>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>
              סה"כ עלויות: {addCommasToNumber(sumTotalCost())} ₪
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>
              סה"כ מקדמות: {sumDownPayment()} ₪
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>
              סה"כ יתרה לתשלום: {sumBalance()} ₪
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Tooltip title="סך כל המוזמנים לחלק בסך כל העלויות">
            <Paper elevation={4} sx={kpiPaperSX}>
              <Typography sx={kpiText}>
                עלות פר אורח:{" "}
                {addCommasToNumber(
                  sumTotalCost() / Number(coupleData.numberOfInvitees)
                )}{" "}
                ₪
              </Typography>
            </Paper>
          </Tooltip>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default ExpansesKpis;

const kpiContainer = { px: 1, width: "95%", margin: "auto" };
const kpiWrapper = {};

const kpiPaperSX = {
  py: 2,
  px: 3,
  borderRadius: 3,
  bgcolor: "secondary.light",
  minHeight: { lg: 50 },
};

const kpiText = { textAlign: "center" };
