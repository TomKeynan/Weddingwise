import React, { useState, useContext } from "react";
import { QuestionsContext } from "../store/QuestionsContext";
import { AppContext } from "../store/AppContext";
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
// import useFetch from "../utilities/useFetch";

export default function Questions() {
  const { userAnswers } = useContext(QuestionsContext);
  const { updateUserData } = useContext(AppContext);
  // const { data, loading, error, sendData } = useFetch();

  const screenAboveSM = useMediaQuery("(min-width: 500px)");
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  function handleNext() {
    setPage((prev) => prev + 1);
  }

  function handleBack() {
    setPage((prev) => prev - 1);
  }

  function handleCreatePackage() {
    updateUserData({ answers: userAnswers });
  }


  return (
    <Stack spacing={2} justifyContent="center" alignItems="center" px={2}>
      {/* <Typography>Page: {page}</Typography> */}
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
            {/* <Typography variant="h6">5</Typography> */}
          </Typography>
          <Button variant="text" onClick={handleNext} disabled={page === 15}>
            הבא
            <ArrowBackIcon sx={{ ml: 1 }} />
          </Button>
        </Stack>
      )}
      {!userAnswers.includes(0) && (
        <Button
          variant="contained"
          onClick={handleCreatePackage}
          sx={{ width: "90%", fontSize: 24, fontWeight: "bold" }}
        >
          צור חבילה
        </Button>
      )}

      <Question key={page} activePage={page - 1} />
    </Stack>
  );
}
