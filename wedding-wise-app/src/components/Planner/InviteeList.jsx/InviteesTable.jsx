import React, { useState, useContext, useEffect } from 'react';
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
  InputLabel,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppContext } from '../../../store/AppContext';

function InviteesTable() {
  const { invitees, setInvitees } = useContext(AppContext);
  const [newRow, setNewRow] = useState({ name: '', numberOfInvitees: '', rsvp: '', side: '' });
  const [showInputs, setShowInputs] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    // Initialize invitees if needed
    setInvitees([]);
  }, [setInvitees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numberOfInvitees' && !/^\d*$/.test(value)) {
      return; // Only allow digits for the numberOfInvitees field
    }
    setNewRow((prevState) => {
      const updatedRow = { ...prevState, [name]: value };

      // Check if all fields are filled
      if (updatedRow.name && updatedRow.numberOfInvitees && updatedRow.rsvp && updatedRow.side) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }

      return updatedRow;
    });
  };

  const handleAddRow = () => {
    if (newRow.name && newRow.numberOfInvitees && newRow.rsvp && newRow.side) {
      setInvitees((prevRows) => [...prevRows, newRow]);
      setNewRow({ name: '', numberOfInvitees: '', rsvp: '', side: '' });
      setShowInputs(false);
      setIsButtonActive(false);
    }
  };

  const toggleInputs = () => {
    setShowInputs((prevShow) => !prevShow);
  };

  const handleDeleteRow = (index) => {
    setInvitees((prevRows) => prevRows.filter((row, i) => i !== index));
  };

  return (
    <div>
      <TableContainer component="div">
        <Table sx={{ minWidth: 650 }} aria-label="invitees table">
          <TableHead>
            <TableRow>
              <TableCell align="right"><Box width={1 / 3}>שם</Box></TableCell>
              <TableCell align="right"><Box width={1 / 3}>מס מוזמנים</Box></TableCell>
              <TableCell align="right"><Box width={1 / 3}>אישרו הגעה</Box></TableCell>
              <TableCell align="right"><Box width={1 / 3}>צד מזמין</Box></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitees.length > 0 ? (
              invitees.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="right"><Box width={1 / 3}>{row.name}</Box></TableCell>
                  <TableCell align="right"><Box width={1 / 3}>{row.numberOfInvitees}</Box></TableCell>
                  <TableCell align="right"><Box width={1 / 3}>{row.rsvp}</Box></TableCell>
                  <TableCell align="right"><Box width={1 / 3}>{row.side}</Box></TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleDeleteRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">אין מוזמנים כרגע</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" flexDirection="column" alignItems="center">
        <Button variant="contained" onClick={toggleInputs}>
          {showInputs ? "בטל" : "הוסף מוזמן"}
        </Button>
        {showInputs && (
          <Box mt={2} display="flex" justifyContent="center">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="שם"
                name="name"
                value={newRow.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                label="מס מוזמנים"
                name="numberOfInvitees"
                value={newRow.numberOfInvitees}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="rsvp-label">אישרו הגעה</InputLabel>
              <Select
                labelId="rsvp-label"
                name="rsvp"
                value={newRow.rsvp}
                onChange={handleInputChange}
                label="אישרו הגעה"
              >
                <MenuItem value="כן">כן</MenuItem>
                <MenuItem value="לא">לא</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="side-label">צד מזמין</InputLabel>
              <Select
                labelId="side-label"
                name="side"
                value={newRow.side}
                onChange={handleInputChange}
                label="צד מזמין"
              >
                <MenuItem value="חתן">חתן</MenuItem>
                <MenuItem value="כלה">כלה</MenuItem>
              </Select>
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
    </div>
  );
}

export default InviteesTable;
