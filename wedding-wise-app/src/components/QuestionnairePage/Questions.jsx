import React, { useState, useContext, useEffect } from "react";
import { QuestionsContext } from "../../store/QuestionsContext";
import { AppContext } from "../../store/AppContext";
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
import useFetch from "../../utilities/useFetch";
import Loading from "../Loading";

export default function Questions() {
  const { isLoading, coupleAnswers, handleCreateNewPackage } =
    useContext(QuestionsContext);

  // useEffect(() => {
  //   sessionStorage.setItem("offeredCouple", JSON.stringify(data));
  // }, [data]);

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

  // const c = {
  //   Email: "1",
  //   Password: "zdfvxdcv",
  //   Partner1Name: "Adamdzxcsad",
  //   Partner2Name: "Beyonczxczce",
  //   PhoneNumber: "000001",
  //   DesiredDate: "2024-07-29",
  //   DesiredRegion: "רמת הגולן",
  //   Budget: Number("10000000"),
  //   NumberOfInvitees: Number("350"),
  // };

  // const p = {
  //   couple: c,
  //   questionnaireAnswers: [1, 5, 2, 3, 2, 5, 2, 3, 5, 3, 2, 5, 2, 4, 4],
  // };

  return (
    <Stack spacing={4} justifyContent="center" alignItems="center" px={4}>
      {isLoading && <Loading />}
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
      {!coupleAnswers.includes(0) && (
        <Button
          variant="contained"
          onClick={handleCreateNewPackage}
          sx={{ width: "90%", fontSize: 24, fontWeight: "bold" }}
        >
          צור חבילה
        </Button>
      )}
      {/* {!userAnswers.includes(0) && (
        <Button
          variant="contained"
          onClick={handleCreatePackage}
          sx={{ width: "90%", fontSize: 24, fontWeight: "bold" }}
        >
          צור חבילה
        </Button>
      )} */}

      <Question key={page} activePage={page - 1} />
    </Stack>
  );
}
