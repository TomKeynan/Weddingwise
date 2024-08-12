import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../store/AppContext";
import { Grid, Stack, Paper, Typography } from "@mui/material";
import useFetch from "../../../utilities/useFetch";
import MessageDialog from "../../Dialogs/MessageDialog";

function TasksKpis() {
  const { sendData, resData, setResData, error, setError } = useFetch();
  const { coupleData } = useContext(AppContext);
  const [tasksList, setTasksList] = useState([]);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);

  useEffect(() => {
    sendData(`/Tasks/getTasks?coupleEmail=${coupleData.email}`, "GET");
  }, []);

  useEffect(() => {
    if (resData) {
      setTasksList(resData);
    } else if (error) {
      setOpenErrorMessage(true);
    }
    return () => {
      setError(undefined);
      setResData(undefined);
    };
  }, [resData, error]);

  function sumIncompleteTasks() {
    const total = tasksList.reduce((accumulator, currentItem) => {
      if (!currentItem.completed) return accumulator + 1;
      else return accumulator;
    }, 0);
    return total;
  }

  function sumCompleteTasks() {
    const total = tasksList.reduce((accumulator, currentItem) => {
      if (currentItem.completed) return accumulator + 1;
      else return accumulator;
    }, 0);
    return total;
  }

  function sumTotalComments() {
    const total = tasksList.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subTasks.length;
    }, 0);
    return total;
  }

  function calcProgress() {
    return (
      (sumCompleteTasks() / (sumIncompleteTasks() + sumCompleteTasks())) * 100
    );
  }

  return (
    <>
      {openErrorMessage && (
        <MessageDialog
          title="שגיאה!"
          btnValue="אוקיי!"
          open={openErrorMessage}
          onClose={() => setOpenErrorMessage(false)}
          mode="error"
        >
          <Typography variant="body1" color="grey">
            אופס! משהו השתבש, נסה שנית.{" "}
          </Typography>
        </MessageDialog>
      )}
      <Stack justifyContent="center" sx={kpiContainer}>
        <Grid
          container
          maxWidth="xxl"
          spacing={2}
          sx={{ placeItems: "center" }}
        >
          <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
            <Paper elevation={4} sx={kpiPaperSX}>
              <Typography sx={kpiText}>
                לא הושלמו: {sumIncompleteTasks()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
            <Paper elevation={4} sx={kpiPaperSX}>
              <Typography sx={kpiText}>הושלמו: {sumCompleteTasks()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
            <Paper elevation={4} sx={kpiPaperSX}>
              <Typography sx={kpiText}>
                הושלמו עד כה: {calcProgress().toFixed(0)} %
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
            <Paper elevation={4} sx={kpiPaperSX}>
              <Typography sx={kpiText}>
                סה"כ הערות: {sumTotalComments()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default TasksKpis;

const kpiContainer = { px: 1, width: "95%", margin: "auto" };
const kpiWrapper = {};

const kpiPaperSX = {
  py: 2,
  px: 3,
  bgcolor: "secondary.light",
  borderRadius: 3,
};

const kpiText = { textAlign: "center" };
