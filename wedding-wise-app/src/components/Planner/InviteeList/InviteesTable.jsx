import React, { useState, useContext, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppContext } from "../../../store/AppContext";
import useFetch from "../../../utilities/useFetch";

function InviteesTable() {
  const { invitees, setInvitees, coupleData } = useContext(AppContext);
  const [newRow, setNewRow] = useState({
    name: "",
    email: "",
    numberOfInvitees: "",
    rsvp: false,
    side: "",
  });
  const [showInputs, setShowInputs] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const {
    getData: fetchInvitees,
    resData: inviteesData,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch();
  
  const {
    sendData,
    resData: postData,
    loading: postLoading,
    error: postError,
  } = useFetch();
  
  const {
    sendData: deleteData,
    resData: deleteRes,
    loading: deleteLoading,
    error: deleteError,
  } = useFetch();

  // Fetch invitees on component mount and when a new invitee is added
  useEffect(() => {
    if (coupleData) {
      fetchInvitees(`/invitees/getInvitees?coupleEmail=${coupleData.email}`);
    }
  }, [coupleData, postData]);

  useEffect(() => {
    if (inviteesData) {
      setInvitees(inviteesData);
    }
  }, [inviteesData, setInvitees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "numberOfInvitees" && !/^\d*$/.test(value)) {
      return; // Only allow digits for the numberOfInvitees field
    }
    setNewRow((prevState) => {
      const updatedRow = { ...prevState, [name]: value };

      // Check if all fields are filled
      if (
        updatedRow.name &&
        updatedRow.email &&
        updatedRow.numberOfInvitees &&
        updatedRow.rsvp !== null &&
        updatedRow.side
      ) {
        setIsButtonActive(true);
      } else {
        setIsButtonActive(false);
      }

      return updatedRow;
    });
  };

  const handleAddRow = async () => {
    if (
      newRow.name &&
      newRow.email &&
      newRow.numberOfInvitees &&
      newRow.rsvp !== null &&
      newRow.side
    ) {
      await sendData("/invitees/addInvitee", "POST", {
        ...newRow,
        coupleEmail: coupleData.email,
      });
    }
  };

  const toggleInputs = () => {
    setShowInputs((prevShow) => !prevShow);
  };

  const handleDeleteRow = async (index) => {
    const inviteeToDelete = invitees[index];
    await deleteData(`/invitees/deleteInvitee/${inviteeToDelete.inviteeID}`, "DELETE");

    if (!deleteError) {
      setInvitees((prevRows) => prevRows.filter((row, i) => i !== index));
    } else {
      console.error('Failed to delete invitee:', deleteError);
    }
  };

  return (
    <div>
      {(postLoading || deleteLoading || fetchLoading) ? (
        <div>Loading...</div>
      ) : (
        <>
          {postError && <div>Error: {postError}</div>}
          {deleteError && <div>Error: {deleteError}</div>}
          {fetchError && <div>Error: {fetchError}</div>}
          <TableContainer component="div">
            <Table sx={{ minWidth: 650 }} aria-label="invitees table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">
                    <Box width={1 / 3}>שם</Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box width={1 / 3}>אימייל</Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box width={1 / 3}>מס מוזמנים</Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box width={1 / 3}>אישרו הגעה</Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box width={1 / 3}>צד מזמין</Box>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitees.length > 0 ? (
                  invitees.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="right">
                        <Box width={1 / 3}>{row.name}</Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box width={1 / 3}>{row.email}</Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box width={1 / 3}>{row.numberOfInvitees}</Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box width={1 / 3}>{row.rsvp ? "כן" : "לא"}</Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box width={1 / 3}>{row.side}</Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDeleteRow(index)}>
                          <DeleteIcon />
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
                    label="אימייל"
                    name="email"
                    value={newRow.email}
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
                    <MenuItem value={true}>כן</MenuItem>
                    <MenuItem value={false}>לא</MenuItem>
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
                  sx={{ height: "fit-content", alignSelf: "center" }}
                >
                  הוסף
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </div>
  );
}

export default InviteesTable;
