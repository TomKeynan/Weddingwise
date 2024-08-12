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
  Paper,
  Stack,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppContext } from "../../../store/AppContext";
import useFetch from "../../../utilities/useFetch";
import { customTheme } from "../../../store/Theme";
import { inviteesValidations } from "../../../utilities/collections";

function InviteesTable() {
  const { invitees, setInvitees, coupleData } = useContext(AppContext);
  const [newRow, setNewRow] = useState({
    name: "",
    email: "",
    numberOfInvitees: "",
    rsvp: null,
    side: "",
  });
  const [showInputs, setShowInputs] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [errors, setErrors] = useState({});
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

    setNewRow((prevState) => {
      const updatedRow = { ...prevState, [name]: value };

      // Check if all fields are filled
      if (
        updatedRow.name &&
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

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // validation check
    const newErrors = {};
    for (let field in data) {
      if (
        inviteesValidations.hasOwnProperty(field) &&
        !inviteesValidations[field].regex.test(data[field])
      ) {
        newErrors[field] = inviteesValidations[field].error;
      } else {
        if (data[field] === "") newErrors[field] = "שדה זה נדרש להיות מלא";
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
    await deleteData(
      `/invitees/deleteInvitee/${inviteeToDelete.inviteeID}`,
      "DELETE"
    );

    if (!deleteError) {
      setInvitees((prevRows) => prevRows.filter((row, i) => i !== index));
    } else {
      console.error("Failed to delete invitee:", deleteError);
    }
  };

  return (
    <Stack alignItems="center" spacing={2} sx={{ mt: 3 }}>
      {postError && <div>Error: {postError}</div>}
      {deleteError && <div>Error: {deleteError}</div>}
      {fetchError && <div>Error: {fetchError}</div>}
      <Stack
        alignItems="center"
        sx={{ width: "100%", alignSelf: "flex-start" }}
      >
        <Button
          variant="contained"
          onClick={toggleInputs}
          sx={{
            alignSelf: "flex-start",
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          {showInputs ? "בטל" : "הוסף מוזמן"}
        </Button>
        {showInputs && (
          <Paper
            elevation={6}
            sx={{ mt: 3, p: 2, width: "100%", textAlign: "center" }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container maxWidth="xxl" spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: { xs: "center", sm: "left" },
                      fontSize: { xs: 15, sm: 20, md: 24 },
                      fontFamily: customTheme.font.main,
                      color: "primary.main",
                    }}
                  >
                    הזינו את פרטי המוזמן שתרצו להוסיף
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="שם"
                      name="name"
                      value={newRow.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.name && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.name}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="טלפון"
                      name="email"
                      value={newRow.email}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.email && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.email}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <FormControl sx={textFieldSX}>
                    <TextField
                      label="מס מוזמנים"
                      name="numberOfInvitees"
                      value={newRow.numberOfInvitees}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  {errors.numberOfInvitees && (
                    <Alert severity="error" sx={errorAlertSX}>
                      {errors.numberOfInvitees}
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} sm={6} lg={1.5}>
                  <FormControl sx={selectSX}>
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
                </Grid>
                <Grid item xs={12} sm={6} lg={1.5}>
                  <FormControl sx={selectSX}>
                    <InputLabel id="rsvp-label">אישורו הגעה?</InputLabel>
                    <Select
                      labelId="rsvp"
                      id="rsvp-label"
                      name="rsvp"
                      value={newRow.rsvp === null ? "" : newRow.rsvp}
                      label="אישרו העגה?"
                      onChange={handleInputChange}
                    >
                      <MenuItem value={true}>כן</MenuItem>
                      <MenuItem value={false}>לא</MenuItem>
                    </Select>
                  </FormControl>
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
      <Typography
        sx={{
          fontSize: { xs: 24, sm: 30, md: 40 },
          fontFamily: customTheme.font.main,
          color: "primary.main",
          pb: 2,
          pt: 3,
          alignSelf: "flex-start",
          textDecoration: "underline",
        }}
      >
        טבלת מוזמנים :
      </Typography>
      <Paper
        elevation={6}
        sx={{
          p: 2,
          width: "100%",
          textAlign: "center",
        }}
      >
        <TableContainer component="div">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">שם</TableCell>
                <TableCell align="center">טלפון</TableCell>
                <TableCell align="center">מס מוזמנים</TableCell>
                <TableCell align="center">אישרו הגעה</TableCell>
                <TableCell align="center">צד מזמין</TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>
                  מחיקה
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitees.length > 0 ? (
                invitees.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.numberOfInvitees}</TableCell>
                    <TableCell align="center">
                      {row.rsvp ? "כן" : "לא"}
                    </TableCell>
                    <TableCell align="center">{row.side}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleDeleteRow(index)}>
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
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

export default InviteesTable;

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
