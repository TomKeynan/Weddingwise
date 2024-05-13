import React, { useContext } from "react";
import { RegisterContext } from "../store/RegisterContext";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import TextInput from "./TextInput";
import { customTheme } from "../store/Theme";
import { regions } from "../utilities/collections";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getFullDate } from "../utilities/functions";

function EditCouple() {
  const {
    editValue,
    updateEditValue,
    date,
    saveDateValue,
    isFormCompleted,
    isFormValid,
  } = useContext(RegisterContext);

  function handleWeddingDateChange(dateInput) {
    const weddingDateObject = getFullDate(dateInput);
    updateEditValue(weddingDateObject);
    saveDateValue(dateInput);
  }

  return (
    <Grid
      container
      columnSpacing={3}
      rowGap={2}
      pt={0}
      sx={{ width: { xs: 250, md: 600 }, margin: "0 auto" }}
    >
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="email"
          label="אימייל"
          name="email"
          value={editValue.email}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={editValue.relationship === "male" ? "שם החתן" : "שם הכלה"}
          name="partner1Name"
          value={editValue.partner1Name}
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          variant="outlined"
          type="text"
          label={editValue.relationship === "female" ? "שם הכלה" : "שם החתן"}
          name="partner2Name"
          value={editValue.partner2Name}
          textFieldSX={textFieldSX}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextInput
          editMode={true}
          variant="outlined"
          name="numberOfInvitees"
          value={editValue.numberOfInvitees}
          type="text"
          label="כמות מוזמנים"
          textFieldSX={textFieldSX}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          editMode={true}
          variant="outlined"
          name="budget"
          label="תקציב"
          value={editValue.budget}
          type="text"
          textFieldSX={textFieldSX}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          options={regions}
          freeSolo={false}
          value={editValue.desiredRegion}
          onChange={(event, newValue) => {
            updateEditValue({ desiredRegion: newValue });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              name="desiredRegion"
              label="איזור"
              sx={textFieldSX}
              helperText="בחרו את האיזור בו תערך החתונה"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            label="תאריך"
            showDaysOutsideCurrentMonth
            value={dayjs(date)}
            onChange={(newValue) => handleWeddingDateChange(newValue)}
            disablePast={true}
            slotProps={{
              textField: {
                name: "desiredDate",
                variant: "standard",
                helperText: "בחרו את התאריך בו תתקיים החתונה",
                sx: textFieldSX,
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      {isFormCompleted(editValue) && isFormValid(editValue) && (
        <Button
          variant="outlined"
          onClick={() => {
            // handleClickOpen();
            // handleSubmit();
          }}
          sx={submitBtnSX}
        >
          עדכן פרטים
        </Button>
      )}
    </Grid>
  );
}

export default EditCouple;

// ============================== styles ==============================

const textFieldSX = {
  p: 0,
  width: "100%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 18, sm: 20 },
    color: customTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root": {
    fontSize: 15,
  },
};

const submitBtnSX = {
  bgcolor: "white",
  borderRadius: 10,
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 1, sm: 3 },
  py: 0,
  fontSize: { xs: 18, sm: 25 },
  borderWidth: 3,
  position: "relative",
  left: { xs: 5, sm: 15 },
  "&.MuiButtonBase-root:hover": {
    bgcolor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};
