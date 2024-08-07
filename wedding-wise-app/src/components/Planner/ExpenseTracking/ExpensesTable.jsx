import React, { useState, useMemo } from "react";
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

// const headers = [
//   { id: "serviceName", title: "שם השירות" },
//   { id: "sponsorName", title: "שם המשלם" },
//   { id: "totalCost", title: "עלות" },
//   { id: "downPayment", title: "מקדמה" },
//   { id: "balance", title: "יתרה" },
//   { id: "delete", title: "מחיקה" },
// ];

const budgetData = [
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

export default function ExpensesTable() {
  const [data, setData] = useState(budgetData);
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
      // handleAddRow();
    }
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
    <Stack alignItems="center" spacing={2} sx={{ mt: 3 }}>
      <Stack
        alignItems="center"
        sx={{ width: "100%", alignSelf: "flex-start" }}
      >
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
                      label="שם המשלם"
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
          textAlign: "center",
        }}
      >
        <TableContainer component="div">
          <Table>
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
                <TableCell
                  align="center"
                  onClick={() => sorting("sponsorName")}
                >
                  <IconButton sx={tableHeadersSX} disableRipple>
                    שם המשלם
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
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center"> {item.serviceName}</TableCell>
                    <TableCell align="center">{item.sponsorName}</TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.totalCost)}
                    </TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.downPayment)}
                    </TableCell>
                    <TableCell align="center">
                      {addCommasToNumber(item.totalCost - item.downPayment)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    אין מוזמנים כרגע
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell align="center" sx={sumRowSX}>
                  סיכום
                </TableCell>
                <TableCell align="center" sx={sumRowSX}>
                  {" "}
                  -{" "}
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

const sumRowSX = { py: 3, fontSize: 20, fontWeight: "bold" };

const textFieldSX = {
  width: "100%",
};

const selectSX = {
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

// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// export default function ExpensesTable() {
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>שם השירות</TableCell>
//             <TableCell align="center">שם המשלם</TableCell>
//             <TableCell align="center">עלות</TableCell>
//             <TableCell align="center">מקדמה</TableCell>
//             <TableCell align="center">יתרה</TableCell>
//             <TableCell align="center">מחק</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <TableRow
//               key={row.name}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <TableCell component="th" scope="row">
//                 {row.name}
//               </TableCell>
//               <TableCell align="center">{row.calories}</TableCell>
//               <TableCell align="center">{row.fat}</TableCell>
//               <TableCell align="center">{row.carbs}</TableCell>
//               <TableCell align="center">{row.protein}</TableCell>
//               <TableCell align="center">{row.protein}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
