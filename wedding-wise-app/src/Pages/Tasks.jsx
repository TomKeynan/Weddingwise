import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Button,
  Stack,
  Typography,
  LinearProgress,
  List,
  TextField,
  Paper,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { AppContext } from "../store/AppContext";
import MessageDialog from "../components/Dialogs/MessageDialog";
import OutlinedButton from "../components/buttons/OutlinedButton";
import { customTheme } from "../store/Theme";
import ConfirmDialog from "../components/Dialogs/ConfirmDialog";
import TaskItem from "../components/Planner/TasksPage/TaskItem";
import useFetch from "../utilities/useFetch";

function Tasks() {
  const screenUnderSM = useMediaQuery("(max-width: 600px)");

  const { coupleData } = useContext(AppContext);
  const { sendData, resData, setResData, error, setError, loading } =
    useFetch();
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [taskId, setTaskId] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [openNewTask, setOpenNewTask] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [getTasksList, setGetTasksList] = useState(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

  useEffect(() => {
    sendData(`/Tasks/getTasks?coupleEmail=${coupleData.email}`, "GET");
  }, [isChecked, isCommentAdded, getTasksList]);

  useEffect(() => {
    if (resData) {
      if (Array.isArray(resData)) setTasksList(resData);
      else {
        setGetTasksList((prev) => !prev);
        setNewTaskTitle("");
        setOpenNewTask(false);
      }
    } else if (error) {
      setOpenErrorMessage(true);
    }
    return () => {
      setError(undefined);
      setResData(undefined);
    };
  }, [resData, error]);

  //compute linear progressbar's value
  const progress = useMemo(() => {
    const checkedTasks = tasksList
      ? tasksList.filter((task) => task.completed)?.length
      : 0;
    return tasksList?.length > 0 ? (checkedTasks / tasksList?.length) * 100 : 0;
  }, [tasksList]);

  function handleTaskChecked() {
    setIsChecked((prev) => !prev);
  }

  // =============== ADD COMMENT =====================

  function handleAddComment() {
    setIsCommentAdded((prev) => !prev);
  }

  // =============== ADD TASK =====================

  function handleAddNewTask(taskTitle) {
    sendData("/Tasks/addTask", "POST", {
      email: coupleData.email,
      taskName: taskTitle,
      completed: false,
    });
  }

  // =============== DELETE TASK =====================

  function handleDeleteTask(taskId) {
    setTaskId(taskId);
    setOpenUpdateConfirm(true);
  }

  function handleApprovalDeleteTask() {
    sendData(`/Tasks/deleteTask/${taskId}`, "DELETE");
    setOpenUpdateConfirm(false);
  }

  // =============== CONFIRM UPDATE =====================

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function showUpdateConfirmDialog() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
        onApproval={handleApprovalDeleteTask}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          בטוחים שאתם רוצים למחוק משימה זו?{" "}
        </Typography>
      </ConfirmDialog>
    );
  }

  return (
    <Stack alignItems="center" sx={loginStackSX}>
      {openUpdateConfirm && showUpdateConfirmDialog()}
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
      <Typography sx={titleSX}>רשימת מטלות</Typography>

      <Typography
        sx={{
          fontSize: { xs: 18, sm: 22, md: 28 },
          textAlign: "center",
          p: { xs: 1, sm: 3 },
          width: { xs: "80%", sm: "70%" },
        }}
      >
        רשימת המטלות תאפשר לכם לנהל את כל המשימות לחתונה בצורה מסודרת ויעילה, עם
        אפשרות להוסיף מטלות חדשות והערות, כך ששום פרט לא יישכח.
      </Typography>
      <Stack
        direction={screenUnderSM ? "column-reverse" : "row"}
        justifyContent="space-around"
        spacing={2}
        sx={stackMainContentSX}
      >
        {tasksList.length > 0 ? (
          <Stack
            justifyContent="space-around"
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <Typography variant="body1" sx={{ pb: 2 }}>
              השלמתם {parseInt(progress)}% מהמשימות
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ width: "90%" }}
            />
            <List sx={{ width: "100%" }}>
              {tasksList?.map((task) => (
                <TaskItem
                  key={task.taskID}
                  data={task}
                  onCheck={handleTaskChecked}
                  onAddComment={handleAddComment}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </List>
          </Stack>
        ) : (
          <Stack>
            <Alert severity="warning" sx={alertSX}>
              הוסיפו משימות חדשות שיעזרו לכם לתכנן את החתונה שלכם בצורה מאורגנת
              יותר
            </Alert>
          </Stack>
        )}
        <Stack sx={{ width: { xs: "100%", sm: "35%", md: "40%" } }}>
          <OutlinedButton
            btnValue=" משימה חדשה + "
            handleClick={() => setOpenNewTask((prev) => !prev)}
          />
          {openNewTask && (
            <Paper variant="elevation" elevation={3} sx={paperSX}>
              <Stack
                justifyContent="space-around"
                sx={{ minHeight: 200, margin: "auto" }}
                spacing={1}
              >
                <Typography sx={newTaskTitleSX}>הוספת משימה חדשה :</Typography>

                <TextField
                  variant="outlined"
                  placeholder="כתבו משימה שברצונכם להוסיף..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Stack justifyContent="flex-start"></Stack>
                <Button
                  variant="contained"
                  onClick={() => handleAddNewTask(newTaskTitle)}
                >
                  הוסף משימה
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Tasks;

const loginStackSX = {
  minHeight: "inherit",
};

const paperSX = {
  width: { xs: "90%", sm: "80%" },
  margin: "20px auto 0",
  p: 2,
  backgroundColor: "rgba(255,255,255,0.8)",
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 30, sm: 45, md: 65 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
};

const stackMainContentSX = {
  textAlign: "center",
  pb: 10,
  pt: 3,
  width: "95%",
  margin: "15px auto",
  px: 1,
};

const newTaskTitleSX = {
  textAlign: "center",
  fontSize: { xs: 16, sm: 18, md: 20 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.dark,
  textDecoration: "underline",
};

const alertSX = {
  fontSize: 14,
  px: 2,
  justifyContent: "center",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
  textAlign: "center",
};
