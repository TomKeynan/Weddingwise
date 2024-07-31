import React, { useContext, useState, useEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/he";
import { AppContext } from "../store/AppContext";
import { convertDateToClientFormat, getFullDate } from "../utilities/functions";
import MessageDialog from "./Dialogs/MessageDialog";
import { Alert, Grid, Paper, Stack, Typography } from "@mui/material";
import { customTheme } from "../store/Theme";
import dayjs from "dayjs";
import AvailableDatesTable from "./AvailableDatesTable";
import useFetch from "../utilities/useFetch";
import ConfirmDialog from "./Dialogs/ConfirmDialog";

const fakeDate = [
  "2024-07-28T00:00:00",
  "2024-07-29T00:00:00",
  "2024-07-30T00:00:00",
  "2024-07-31T00:00:00",
];
export default function EditAvailableDates() {
  // setSupplierData get executed only when we get status 204 (success) from the  server
  const { supplierData, setSupplierData } = useContext(AppContext);
  const { sendData, resData, setResData, error, setError } = useFetch();
  const [open, setOpen] = useState(false);
  // currentSupplierData is temporary supplierData - the one to work with in this component
  const [currentSupplierData, setCurrentSupplierData] = useState(supplierData);
  const [currentDate, setCurrentDate] = useState("");
  const [showDateError, setShowDateError] = useState(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);
  const [isDeletingDate, setIsDeletingDate] = useState(false);
  const [deletedDate, setDeletedDate] = useState("");

  useEffect(() => {
    if (resData) {
      setSupplierData(currentSupplierData);
    }
    return () => {
      setResData(undefined);
    };
  }, [resData]);

  function handleChangeAvailableDates(date) {
    // extract string date from the selected date
    const { desiredDate } = getFullDate(date);
    // convert desiredDate to server format
    const newAvailableDate = `${desiredDate}T00:00:00`;
    // checks if the selected date not exists already in supplier's availableDates
    if (currentSupplierData["availableDates"].includes(newAvailableDate)) {
      // if exists, show error message
      setOpen(true);
      setShowDateError(true);
      return;
    } else {
      setCurrentDate(newAvailableDate);
      setOpenUpdateConfirm(true);
      setCurrentSupplierData((prevData) => {
        return {
          ...prevData,
          availableDates: [...prevData.availableDates, newAvailableDate],
        };
      });
    }
  }
  // ================ Confirm update handling ================

  function handleApprovalUpdateConfirm() {
    if (isDeletingDate) {
      const availableDatesCopy = [...supplierData.availableDates];
      const filteredAvailableDates = availableDatesCopy.filter(
        (date) => date !== deletedDate
      );
      const { availableDates, ...rest } = supplierData;
      sendData("/Suppliers/updateSupplier", "PUT", {
        ...rest,
        availableDates: [...filteredAvailableDates],
      });
      setCurrentSupplierData((prevData) => {
        return { ...prevData, availableDates: [...filteredAvailableDates] };
      });
      setOpenUpdateConfirm(false);
      setIsDeletingDate(false);
      setOpen(true);
    } else {
      sendData("/Suppliers/updateSupplier", "PUT", currentSupplierData);
      setOpenUpdateConfirm(false);
      setOpen(true);
    }
  }

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function showUpdateConfirmDialog() {
    let message = "";

    if (isDeletingDate)
      message = `בטוחים שאתם למחוק את התאריך: ${convertDateToClientFormat(
        deletedDate
      )} מרשימת התאריכים הפנויים שלכם?`;
    else
      message = `רוצים להוסיף את התאריך: ${convertDateToClientFormat(
        currentDate
      )} לרשימת התאריכם הפנויים שלכם?`;

    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
        onApproval={handleApprovalUpdateConfirm}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {message}
        </Typography>
      </ConfirmDialog>
    );
  }

  // ================ Delete date handling ================
  function handleDeletingDate(date) {
    setIsDeletingDate(true);
    setDeletedDate(date);
    setOpenUpdateConfirm(true);
  }

  // ================ Error handling ================

  function handleCloseMessage() {
    setOpen(false);
    setError(undefined);
  }

  function showErrorDateMessage() {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={() => {
          handleCloseMessage();
          setShowDateError(false);
        }}
        xBtn={() => {
          handleCloseMessage();
          setShowDateError(false);
        }}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          תאריך זה נבחר כבר כ-"תאריך פנוי".
        </Typography>
      </MessageDialog>
    );
  }

  function showErrorMessage() {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={handleCloseMessage}
        xBtn={handleCloseMessage}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          אופס.. משהו השתבש נסה שנית
        </Typography>
      </MessageDialog>
    );
  }

  return (
    <Stack
      spacing={2}
      textAlign="center"
      justifyContent="flex-start"
      sx={{
        width: "100%",
        margin: "auto",
        minHeight: "inherit",
        pb: 10,
      }}
    >
      {showDateError && showErrorDateMessage()}
      {error && showErrorMessage()}
      {openUpdateConfirm && showUpdateConfirmDialog()}
      <Stack sx={{ px: 2 }}>
        <Typography
          sx={{
            textAlign: "left",
            fontFamily: customTheme.font.main,
            color: customTheme.palette.primary.main,
            fontSize: { xs: 18, sm: 24, md: 30 },
            fontWeight: "bold",
          }}
        >
          הישארו רלוונטים!
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: { xs: 16, sm: 20, md: 24 },
          }}
        >
          עדכנו לעיתים קרובות את התאריכים הפנויים שיש לכם וכך תגדילו את הסיכויים
          שלכם לקחת חלק בחתונות בימים האלה
        </Typography>
      </Stack>
      <Paper variant="elevation" elevation={6} sx={paperSX}>
        <Grid container sx={{ rowGap: 3 }}>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
              <DatePicker
                label="תאריך"
                showDaysOutsideCurrentMonth
                onChange={(newValue) => handleChangeAvailableDates(newValue)}
                required
                disablePast={true}
                slotProps={{
                  textField: {
                    name: "desiredDate",
                    variant: "outlined",
                    sx: textFieldSX,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          {supplierData["availableDates"].length > 0 ? (
            <Grid item xs={12} sm={8}>
              <AvailableDatesTable
                dates={supplierData["availableDates"]}
                onDelete={(date) => handleDeletingDate(date)}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={8} sx={{ py: 1, px: 2, color: "red" }}>
              <Alert severity="warning">לא נבחרו תאריכים פנויים</Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Stack>
  );
}

const paperSX = {
  py: 3,
  px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,0.8)",
  // width: "100%",
  // margin: "0 auto"
};

const textFieldSX = {
  width: "95%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: { xs: 12, sm: 15 },
  },
};
