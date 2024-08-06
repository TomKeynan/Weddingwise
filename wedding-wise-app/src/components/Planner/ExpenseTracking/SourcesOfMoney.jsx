import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Button,
  TextField,
  FormControl,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function SourcesOfMoney() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ name: "", amount: "", loan: "", notes: "" });
  const [showInputs, setShowInputs] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && !/^\d*$/.test(value)) {
      return; // Only allow digits for the amount field
    }
    setNewRow(prevState => {
      const updatedRow = { ...prevState, [name]: value };

      // Check if 'name', 'amount', and 'loan' fields are filled
      if (updatedRow.name && updatedRow.amount && updatedRow.loan) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }

      return updatedRow;
    });
  };

  const handleAddRow = () => {
    if (newRow.name && newRow.amount && newRow.loan) {
      setRows(prevRows => [...prevRows, newRow]);
      setNewRow({ name: "", amount: "", loan: "", notes: "" });
      setShowInputs(false);
      setIsButtonActive(false);
    }
  };

  const toggleInputs = () => {
    setShowInputs(prevShow => !prevShow);
  };

  const handleDeleteRow = (index) => {
    setRows(prevRows => prevRows.filter((row, i) => i !== index));
  };

  return (
    <div>
      <section>
        <TableContainer component="div">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box width={1 / 3}>סכום</Box>
                </TableCell>
                <TableCell align="right">
                  <Box width={1 / 3}>שם הוצאה</Box>
                </TableCell>
                <TableCell align="right">
                  <Box width={1 / 6}>הלוואה?</Box>
                </TableCell>
                <TableCell align="right">
                  <Box width={1 / 3}>הערות</Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box width={1 / 3}>{row.amount}</Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box width={1 / 3}>{row.name}</Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box width={1 / 6}>{row.loan}</Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box width={1 / 3} display="flex" alignItems="center" justifyContent="space-between">
                        {row.notes}
                        <IconButton onClick={() => handleDeleteRow(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    אין מקורות מימון כרגע
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Button variant="contained" onClick={toggleInputs}>
            {showInputs ? "בטל" : "הוסף מימון להוצאה"}
          </Button>
          {showInputs && (
            <Box mt={2} display="flex" justifyContent="center">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <TextField
                  label="שם הוצאה"
                  name="name"
                  value={newRow.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <TextField
                  label="סכום"
                  name="amount"
                  value={newRow.amount}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  label="הלוואה?"
                  name="loan"
                  value={newRow.loan}
                  onChange={handleInputChange}
                >
                  <MenuItem value="כן">כן</MenuItem>
                  <MenuItem value="לא">לא</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <TextField
                  label="הערות"
                  name="notes"
                  value={newRow.notes}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={handleAddRow}
                disabled={!isButtonActive}
                sx={{ height: 'fit-content', alignSelf: 'center' }}
              >
                הוסף
              </Button>
            </Box>
          )}
        </Box>
      </section>
    </div>
  );
}

export default SourcesOfMoney;
