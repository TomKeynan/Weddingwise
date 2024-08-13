import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { customTheme } from "../store/Theme";
import { ButtonBase } from "@mui/material";
import { convertDateToClientFormat, getDayWeek } from "../utilities/functions";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
];

export default function AvailableDatesTable({ dates, onDelete }) {
  function sortDates(dateArray) {
    return dateArray.sort((a, b) => new Date(a) - new Date(b));
  }

  const sortedDates = sortDates(dates);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 270, maxWidth: "100%" }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: customTheme.palette.primary.light }}>
            <TableCell align="center">תאריך פנוי</TableCell>
            <TableCell align="center">יום בשבוע</TableCell>
            <TableCell align="center">מחיקה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDates.map((date) => (
            <TableRow
              key={date}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {convertDateToClientFormat(date)}
              </TableCell>
              <TableCell align="center">{getDayWeek(date)}</TableCell>
              <TableCell align="center">
                <ButtonBase onClick={() => onDelete(date)}>
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: customTheme.palette.error.main }}
                  />
                </ButtonBase>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
