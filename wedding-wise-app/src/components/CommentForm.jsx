import {
  Alert,
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
import MessageDialog from "./Dialogs/MessageDialog";
import { rateSupplierResponse } from "../utilities/collections";
import { useUserStore } from "../fireBase/userStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../fireBase/firebase";
import { useSupplierData } from "../fireBase/supplierData";
import Loading from "./Loading";
import { useGlobalStore } from "../fireBase/globalLoading";

export default function CommentForm({ supplierFirebase }) {
  const { sendData, resData, setResData, loading, error, setError } =
    useFetch();
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const { currentUser } = useUserStore();
  const { relevantSupplier} = useSupplierData();
  const { setGlobalLoading, globalLoading } = useGlobalStore();

  useEffect(() => {
    const updateFirebaseAndSetState = async () => {
      if (resData) {
        try {
          if (comment) {
            await handleSendToFirebase();
          }
          setOpenUpdateSuccess(true);
        }
        catch (err) {
          console.log(err);
          setOpen(true);
        }
        finally {
          setGlobalLoading(false);
        }
      }
    }

    updateFirebaseAndSetState();
  }, [resData]);

  useEffect(() => {
    if (error) {
      setGlobalLoading(false);
      setOpen(true);
    }
  }, [error]);


  const handleSendToFirebase = async () => {

    try {
      await updateDoc(doc(db, "users", supplierFirebase.id), {
        comments: arrayUnion({
          commentTime: new Date(),
          giverAvatar: currentUser.avatar,
          giverName: currentUser.username,
          rating: rate,
          text: comment,
        }),
      });
    } catch (err) {
      console.error(err);
      setGlobalLoading(false);
    }
  };

  function handleChange(e) {
    setComment(e.target.value);
  }

  function handlePublishComment() {
    if (rate === 0) {
      setIsRated(true);
    } else {
      setIsRated(false);
      setGlobalLoading(true);
      sendData("/Suppliers/rateSupplier", "POST", {
        supplierEmail: relevantSupplier.supplierEmail,
        coupleEmail: currentUser.email,
        rating: rate,
      });
    }
  }

  function handleRatingChange(rating) {
    if (rating) {
      setRate(rating);
    } else {
      setRate(0);
    }
  }

  // ================  Updated success handling ================

  function handleCloseSuccessMessage() {
    setOpenUpdateSuccess(false);
    setResData(undefined);
  }

  function showSuccessMessage() {
    return (
      <MessageDialog
        title="תגובתכם פורסמה בהצלחה!"
        text="תודה רבה ששיתפתם!"
        btnValue="אוקיי!"
        open={openUpdateSuccess}
        onClose={handleCloseSuccessMessage}
        xBtn={handleCloseSuccessMessage}
        mode="success"
      ></MessageDialog>
    );
  }

  // ================ error handling ================

  function handleCloseErrorDialog() {
    setOpen(false);
    setError(null);
  }

  function showErrorMessage(status) {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={handleCloseErrorDialog}
        xBtn={handleCloseErrorDialog}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {rateSupplierResponse[status]}
        </Typography>
      </MessageDialog>
    );
  }

  if (globalLoading) {
    return <Loading />;
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
              src={currentUser?.avatar}
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
                {currentUser?.username}
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
              handleRatingChange(newValue);
            }}
          />
          {isRated && (
            <Alert severity="error" sx={errorAlertSX}>
              פרסום התגובה דורש דירוג של לפחות כוכב אחד
            </Alert>
          )}
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
  p: { xs: 3, sm: 5 },
  boxShadow: customTheme.shadow.strong,
  borderRadius: 3,
};

const errorAlertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  width: "90%",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
  textAlign: "center",
};
