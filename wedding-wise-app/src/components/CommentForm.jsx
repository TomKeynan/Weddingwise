import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { customTheme } from "../store/Theme";
import { getTodayDate } from "../utilities/functions";
import SupplierContainBtn from "./buttons/SupplierContainBtn";
import useFetch from "../utilities/useFetch";
import { AppContext } from "../store/AppContext";
import MessageDialog from "./Dialogs/MessageDialog";
import { rateSupplierResponse } from "../utilities/collections";

const testObject = {
  supplierEmail: "test14@gmail.com",
  coupleEmail: "tom1@gmail.com",
  rating: 3,
};
export default function CommentForm() {
  const { sendData, resData, loading, error, setError } = useFetch();
  const { coupleData, supplierData } = useContext(AppContext);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (resData) {
      setOpenUpdateSuccess(true);
    }
    if (error) {
      setOpen(true);
    }
  }, [resData, error]);

  function handleChange(e) {
    setComment(e.target.value);
  }

  function handlePublishComment() {
    sendData("/Suppliers/rateSupplier", "POST", {
      supplierEmail: supplierData.supplierEmail,
      coupleEmail: "test4@gmail.com",
      rating: rate,
    });
  }

  // ================  Updated success handling ================

  function showSuccessMessage() {
    return (
      <MessageDialog
        title="תגובתכם פורסמה בהצלחה!"
        text="תודה רבה ששיתפתם!"
        btnValue="אוקיי!"
        open={openUpdateSuccess}
        onClose={() => setOpenUpdateSuccess(false)}
        xBtn={() => setOpenUpdateSuccess(false)}
        mode="success"
      ></MessageDialog>
    );
  }

  // ================ error handling ================
  
  function handleCloseErrorDialog() {
    setOpen(false)
    setError(null)
  }
  
  function showErrorMessage(status) {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={handleCloseErrorDialog}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {rateSupplierResponse[status]}
        </Typography>
      </MessageDialog>
    );
  }


  return (
    <>
      {error && showErrorMessage(error)}
      {openUpdateSuccess && showSuccessMessage()}
      <Stack sx={commentWrapperSX}>
        {/* card-header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          // justifyContent={"space-between"}
          spacing={{ xs: 1, sm: 3 }}
          flexWrap="wrap"
          sx={{ width: "100%", pb: 3 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "center" }}
            flexWrap="wrap"
            spacing={{ xs: 0, sm: 2 }}
            sx={{}}
          >
            <Box
              component="img"
              src="/assets/login.jpg" // comment.image
              sx={{
                width: { xs: 60, sm: 43 },
                aspectRatio: "1/1",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            ></Box>
            {/* card-header-text */}
            <Stack alignItems={{ xs: "center", sm: "flex-start" }}>
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                  fontFamily: customTheme.font.main,
                }}
                // {comment.names}
              >
                שמות הזוגות
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, sm: 14 },
                  color: "grey",
                }}
              >
                {getTodayDate()}
              </Typography>
            </Stack>
          </Stack>
          <Rating
            name="simple-controlled"
            onChange={(event, newValue) => {
              setRate(newValue);
            }}
          />
        </Stack>
        <Stack>
          <TextField
            label="תגובה"
            placeholder="שתפו את דעתכם..."
            multiline
            onChange={handleChange}
          />
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", m: "20px auto 0" }}
        >
          <SupplierContainBtn
            value="פרסם תגובה"
            width="100%"
            onClick={handlePublishComment}
          />
        </Stack>
      </Stack>
    </>
  );
}

const commentWrapperSX = {
  direction: "ltr",
  bgcolor: "white",
  // bgcolor: customTheme.supplier.colors.primary.light,
  p: { xs: 3, sm: 5 },
  boxShadow: customTheme.shadow.strong,
  borderRadius: 3,
};
