import React, { useContext } from "react";
import { RegisterContext } from "../../store/RegisterContext";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { regions } from "../../utilities/collections";
import { customTheme } from "../../store/Theme";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";
import "./steps.css";
import TextInput from "../TextInput";
import { getFullDate } from "../../utilities/functions";

const StepTwo = () => {
  const { userDetails, date, updateUserDetails, saveDateValue } =
    useContext(RegisterContext);

  function handleWeddingDateChange(dateInput) {
    const weddingDateObject = getFullDate(dateInput);
    updateUserDetails(weddingDateObject);
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
      {/* Number of invitees */}
      <Grid item xs={12} md={6}>
        <TextInput
          variant="standard"
          type="text"
          value={userDetails.numberOfInvitees}
          name="numberOfInvitees"
          label="כמות מוזמנים"
          textFieldSX={textFieldSX}
        />
      </Grid>
      {/* Budget */}
      <Grid item xs={12} md={6}>
        <TextInput
          variant="standard"
          type="text"
          value={userDetails.budget}
          name="budget"
          label="תקציב"
          textFieldSX={textFieldSX}
        />
      </Grid>
      {/* Region */}
      <Grid item xs={12} md={6}>
        <Autocomplete
          options={regions}
          freeSolo={false}
          value={userDetails.desiredRegion}
          onChange={(event, newValue) => {
            updateUserDetails({ desiredRegion: newValue });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="איזור"
              sx={textFieldSX}
              helperText="בחרו את האיזור בו תערך החתונה"
              // required
            />
          )}
        />
      </Grid>
      {/* Desire Date   */}
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
                variant: "standard",
                helperText: "בחרו את התאריך בו תתקיים החתונה",
                sx: textFieldSX,
              },
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default StepTwo;

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
