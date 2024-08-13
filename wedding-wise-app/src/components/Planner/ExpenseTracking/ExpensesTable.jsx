import React, { useState, useContext, useEffect } from "react";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { addCommasToNumber } from "../../../utilities/functions";
import { customTheme } from "../../../store/Theme";
import { expensesValidations } from "../../../utilities/collections";
import useFetch from "../../../utilities/useFetch";
import { AppContext } from "../../../store/AppContext";

export default function ExpensesTable({ expensesList, onExpensesChanged }) {
  const { sendData, getData, resData, setResData, error, setError } =
    useFetch();
  const { coupleData } = useContext(AppContext);
  const [data, setData] = useState(expensesList);
  const [order, setOrder] = useState("ASC");
  const [showInputs, setShowInputs] = useState(false);
  const [errors, setErrors] = useState({});
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [newRow, setNewRow] = useState({
    serviceName: "",
    sponsorName: "",
    totalCost: "",
    downPayment: "",
  });

  useEffect(() => {
    setData(expensesList);
  }, [expensesList]);

  useEffect(() => {
    if (resData) {
      onExpensesChanged();
    }
    return () => {
      setResData(undefined);
    };
  }, [resData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewRow((prevState) => {
      const updatedRow = { ...prevState, [name]: value };
      // Check if all fields are filled
      if (
        updatedRow.serviceName &&
        updatedRow.sponsorName &&
        updatedRow.totalCost &&
        updatedRow.downPayment
      ) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }

      return updatedRow;
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // validation check
    const newErrors = {};
    for (let field in data) {
      if (
        expensesValidations.hasOwnProperty(field) &&
        !expensesValidations[field].regex.test(data[field])
      ) {
        newErrors[field] = expensesValidations[field].error;
      }
    }
    // checks if there were an errors at validation check
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
      handleAddRow();
    }
  }

  function handleAddRow() {
    const { totalCost, downPayment, ...rest } = newRow;
    sendData("/Expenses/addExpense", "POST", {
      ...rest,
      totalCost: Number(totalCost),
      downPayment: Number(downPayment),
      coupleEmail: coupleData.email,
    });
  }

  function handleDeleteRow(expenseID) {
    sendData(`/Expenses/deleteExpense/${expenseID}`, "DELETE", {});
  }

  function sorting(col) {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setData(sorted);
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) => (a[col] < b[col] ? 1 : -1));
      setData(sorted);
      setOrder("ASC");
    }
  }

  function sumTotalCost() {
    const total = data.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.totalCost;
    }, 0);
    return addCommasToNumber(total);
  }

  function sumDownPayment() {
    const total = data.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.downPayment;
    }, 0);
    return addCommasToNumber(total);
  }

  function sumBalance() {
    const total = data.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.totalCost - currentItem.downPayment);
    }, 0);
    return addCommasToNumber(total);
  }

  return (
    <Stack alignItems="center" sx={{ flexGrow: 1, mt: 3 }}>
      <Stack alignItems="center" sx={{ alignSelf: "flex-start" }}>
        <Button
          variant="contained"
          onClick={() => setShowInputs((prevShow) => !prevShow)}
          sx={{
            alignSelf: "flex-start",
            minWidth: { xs: "100%", sm: 200 },
            mb: 3,
          }}
        >
          {showInputs ? "בטל" : "הוסף הוצאה"}
        </Button>
        {showInputs && (
          <Paper
            elevation={6}
            sx={{ mt: 3, p: 2, mb: 5, width: "100%", textAlign: "center" }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container maxWidth="md" spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: { xs: "center", sm: "left" },
                      fontSize: { xs: 15, sm: 20, md: 24 },
                      fontFamily: customTheme.font.main,
                      color: "primary.main",
                    }}
                  >
                    הזינו את פרטי ההוצאה שתרצו להוסיף
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="שם השירות"
                      name="serviceName"
                      value={newRow.serviceName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.serviceName && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.serviceName}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="עלות"
                      name="totalCost"
                      value={newRow.totalCost}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.totalCost && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.totalCost}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="מקדמה"
                      name="downPayment"
                      value={newRow.downPayment}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.downPayment && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.downPayment}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="משלם המקדמה"
                      name="sponsorName"
                      value={newRow.sponsorName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.sponsorName && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.sponsorName}
                    </Alert>
                  )}
                </Grid>
              </Grid>
              <Stack justifyContent="center" direction="row">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isButtonActive}
                  sx={{ minWidth: 200, mt: 2, mb: 2 }}
                >
                  הוסף
                </Button>
              </Stack>
            </form>
          </Paper>
        )}
      </Stack>
      <Paper
        elevation={6}
        sx={{
          mt: 3,
          p: 2,
          width: "100%",
          maxHeight: 400,
          textAlign: "center",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main", // Thumb color
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "primary.dark", // Thumb hover color
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Track color
          },
        }}
      >
        <TableContainer
          component="div"
          sx={{
            overflowX: "scroll",
            "&::-webkit-scrollbar": {
              width: 1,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.main", // Thumb color
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.dark", // Thumb hover color
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1", // Track color
            },
          }}
        >
          <Table sx={{}}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  onClick={() => sorting("serviceName")}
                >
                  <IconButton sx={tableHeadersSX} disableRipple>
                    שם השירות
                    <SwapVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center" onClick={() => sorting("totalCost")}>
                  <IconButton sx={tableHeadersSX} disableRipple>
                    עלות
                    <SwapVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => sorting("downPayment")}
                >
                  <IconButton sx={tableHeadersSX} disableRipple>
                    מקדמה
                    <SwapVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => sorting("sponsorName")}
                >
                  <IconButton sx={tableHeadersSX} disableRipple>
                    משלם המקדמה
                    <SwapVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={tableHeadersSX}>
                  יתרה
                </TableCell>
                <TableCell align="center" sx={tableHeadersSX}>
                  מחיקה
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow
                    key={item.expenseID}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center"> {item.serviceName}</TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.totalCost)}
                    </TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.downPayment)}
                    </TableCell>
                    <TableCell align="center">{item.sponsorName}</TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.totalCost - item.downPayment)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDeleteRow(item.expenseID)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{}}>
                    <Alert severity="warning" sx={errorAlertSX}>
                      לא נרשמו הוצאות לחתונה עד כה
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell align="center" sx={sumRowSX}>
                  סיכום
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  {" "}
                  {sumTotalCost()} ₪
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  {" "}
                  {sumDownPayment()} ₪
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  -
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  {" "}
                  {sumBalance()} ₪
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  {" "}
                  -{" "}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

const tableHeadersSX = { fontSize: 16, color: "primary.main" };

const sumRowSX = { py: 3, fontSize: 16, fontWeight: "bold", px: 0 };

const textFieldSX = {
  width: "100%",
};

const errorAlertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  width: "90%",
  m: "12px auto 0",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
};
