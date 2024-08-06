import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useFetch from "../utilities/useFetch";
import AddIcon from "@mui/icons-material/Add";
import SettingsMenu from "./SettingsMenu";
import CloseIcon from "@mui/icons-material/Close";
import MessageDialog from "./Dialogs/MessageDialog";

function TaskItem({ data, onCheck, onAddComment, onDeleteTask }) {
  //   const screenUnderSM = useMediaQuery("(max-width: 600px)");
  const { sendData, resData, setResData, error, setError, loading } =
    useFetch();
  const [openComment, setOpenComment] = useState(false);
  const [task, setTask] = useState(data);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);

  useEffect(() => {
    if (data) {
      setTask(data);
    }
  }, [data]);

  useEffect(() => {
    if (resData) {
      const resDataLength = Object.keys(resData).length;
      if (resDataLength === 5) {
        onCheck();
        setTask(resData);
      } else if (resDataLength === 3) {
        onAddComment();
        setComment("");
      } else {
        removeDeletedComment();
        setResData(undefined);
      }
    } else if (error) {
      setOpenErrorMessage(true);
    }
    return () => {
      setError(undefined);
      setResData(undefined);
    };
  }, [resData, error]);

  function handleChecked() {
    sendData("/Tasks/updateTask", "PUT", {
      ...task,
      completed: !task.completed,
    });
  }

  function openComments() {
    setOpenComment((prev) => !prev);
  }

  function handleAddComment() {
    sendData("/Tasks/addSubTask", "POST", {
      taskId: task.taskID,
      subTaskName: comment,
    });
  }

  function handleClose() {
    setOpenComment((prev) => !prev);
  }

  function handleDeleteComment(commentId) {
    setCommentId(commentId);
    sendData(`/Tasks/deleteSubTask/${commentId}`, "DELETE");
  }

  function removeDeletedComment() {
    const subTasksCopy = [...task.subTasks];
    const filteredSubTasksList = subTasksCopy.filter(
      (comment) => comment.subTaskId !== commentId
    );
    setTask((prevData) => {
      return {
        ...prevData,
        subTasks: filteredSubTasksList,
      };
    });
  }

  function handleShowComments(comments) {
    if (comments.length > 0) {
      return (
        <Box>
          <Typography
            sx={{
              textAlign: "left",
              textDecoration: "underline",
              color: "primary.main",
            }}
          >
            הערות :
          </Typography>
          <Box component="ol" sx={{ textAlign: "left" }}>
            {comments.map((item) => (
              <Box component="li" key={item.subTaskId} sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography sx={{ ml: 2, maxWidth: "60%" }}>
                    {item.subTaskName}
                  </Typography>
                  <Button onClick={() => handleDeleteComment(item.subTaskId)}>
                    מחק הערה
                  </Button>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      );
    } else {
      return (
        <Alert severity="warning" sx={alertSX}>
          לא קיימות הערות למשימה זו!
        </Alert>
      );
    }
  }
  return (
    <Paper variant="elevation" elevation={3} sx={paperSX}>
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
      <Stack>
        <ListItem>
          <Checkbox checked={task.completed} onChange={handleChecked} />
          <ListItemText
            primary={task.taskName}
            sx={{
              "& .MuiTypography-root": {
                fontSize: { xs: 14, sm: 16 },
              },
            }}
          />
          <ListItemSecondaryAction>
            {!openComment ? (
              <SettingsMenu
                onAddComment={openComments}
                onDeleteTask={() => onDeleteTask(task.taskID)}
              />
            ) : (
              <Tooltip title="סגור">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListItemSecondaryAction>
        </ListItem>
        {openComment && (
          <Stack sx={{ borderTop: "2px solid grey", width: "100%" }}>
            <Stack sx={{ py: 2 }}>{handleShowComments(task.subTasks)}</Stack>
            <Stack sx={{ borderTop: "2px solid grey" }}>
              <Typography
                sx={{
                  textAlign: "left",
                  pt: 2,
                  textDecoration: "underline",
                  color: "primary.main",
                }}
              >
                הוסיפו הערה :
              </Typography>
              <TextField
                variant="outlined"
                placeholder="כתבו הערה..."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                sx={{ my: 1 }}
              />
              <Button variant="contained" onClick={handleAddComment}>
                הוסף הערה
                <AddIcon />
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default TaskItem;

const paperSX = {
  width: { xs: "85%", sm: "80%" },
  margin: "16px auto 0",
  p: { xs: 1, sm: 2 },
  backgroundColor: "rgba(255,255,255,0.8)",
};

const alertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
  textAlign: "center",
};
