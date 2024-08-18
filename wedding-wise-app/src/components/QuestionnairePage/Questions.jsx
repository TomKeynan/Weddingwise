import React, { useState, useContext, useEffect } from "react";
import { QuestionsContext } from "../../store/QuestionsContext";
import {
  Button,
  Typography,
  Pagination,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Question from "./Question";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../Loading";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/AppContext";

export default function Questions() {
  const navigate = useNavigate();
  const screenAboveSM = useMediaQuery("(min-width: 500px)");

  const { isLoading, handleCreateNewPackage, error, setError } =
    useContext(QuestionsContext);
  const { coupleAnswers, setCoupleAnswers } = useContext(AppContext);

  useEffect(() => {
    setCoupleAnswers(Array.from({ length: 15 }, () => 0));
  }, []);

  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (!open) {
      setError(undefined);
    }
  }, [open]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  function handleNext() {
    setPage((prev) => prev + 1);
  }

  function handleBack() {
    setPage((prev) => prev - 1);
  }

  function handleApprovalUpdateDetails() {
    setOpen(false);
    navigate("/edit-replace");
  }

  return (
    <Stack
      spacing={4}
      justifyContent="center"
      alignItems="center"
      sx={{ width: "95%" }}
    >
      {isLoading && <Loading />}
      {error && (
        <ConfirmDialog
          title="אופס..."
          open={open}
          approvalBtn="עדכון פרטים"
          onCancel={() => setOpen(false)}
          onApproval={handleApprovalUpdateDetails}
        >
          <Typography
            sx={{ textAlign: "center", fontSize: { xs: 18, sm: 20 } }}
          >
            נראה שהפרטים שמסרתם לא הניבו חבילת נותני שירות מתאימה.{" "}
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontSize: { xs: 18, sm: 20 } }}
          >
            כדי שנוכל לסייע לכם בצורה הטובה ביותר, יש לנסות לעדכן את הפרטים שלכם
          </Typography>
        </ConfirmDialog>
      )}
      {screenAboveSM && (
        <Pagination
          shape="rounded"
          variant="outlined"
          size="large"
          color="primary"
          count={15}
          page={page}
          onChange={handleChange}
          sx={{
            "& .MuiPagination-ul ": {
              minWidth: { xs: 200, sm: 600, md: 700 },
              justifyContent: "space-around",
            },
          }}
        />
      )}
      {!screenAboveSM && (
        <Stack
          direction="row"
          alignContent="center"
          justifyContent="space-between"
          sx={{ width: "90%" }}
        >
          <Button variant="text" onClick={handleBack} disabled={page === 1}>
            <ArrowForwardIcon sx={{ mr: 1 }} />
            הקודם
          </Button>
          <Typography variant="body1">
            <span style={{ fontSize: "22px" }}>{page}</span> מתוך 15
          </Typography>
          <Button variant="text" onClick={handleNext} disabled={page === 15}>
            הבא
            <ArrowBackIcon sx={{ ml: 1 }} />
          </Button>
        </Stack>
      )}
      {!coupleAnswers.includes(0) && (
        <Button
          variant="contained"
          onClick={handleCreateNewPackage}
          sx={{
            width: "100%",
            maxWidth: "800px",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          צור חבילה
        </Button>
      )}
      <Question key={page} activePage={page - 1} />
    </Stack>
  );
}
