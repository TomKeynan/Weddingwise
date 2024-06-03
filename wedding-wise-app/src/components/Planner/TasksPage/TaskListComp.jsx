import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Checkbox,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddIcon from "@mui/icons-material/Add";
import { AppContext } from "../../../store/AppContext";
import useFetch from "../../../utilities/useFetch";
import Loading from "../../Loading";
import DialogMessage from "../../DialogMessage";

function TasksListComp() {
  const { coupleData } = useContext(AppContext);
  const { sendData, resData, error, loading } = useFetch();
  const makeChanges = useFetch();

  const [newTask, setNewTask] = useState("");
  const [currentTaskID, setCurrentTaskID] = useState(null);
  const [newSubTask, setNewSubTask] = useState("");
  const [open, setOpen] = useState(false);

  const currentTask = resData?.find((task) => task.taskID === currentTaskID);

  useEffect(() => {
    if (coupleData) {
      fetchTasks();
    }
  }, [coupleData]);

  const fetchTasks = async () => {
    await sendData(`/Tasks/getTasks?coupleEmail=${coupleData.email}`, "GET");
  };

  const handleAddTask = async () => {
    try {
      await makeChanges.sendData("/Tasks/addTask", "POST", {
        email: coupleData.email,
        taskName: newTask,
        completed: false,
      });

      await fetchTasks();
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddSubTask = async () => {
    try {
      await makeChanges.sendData("/Tasks/addSubTask", "POST", {
        subTaskName: newSubTask,
        taskId: currentTaskID,
      });

      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCheck = async (index) => {
    try {
      const updatedTask = {
        ...resData[index],
        completed: !resData[index].completed,
      };

      await makeChanges.sendData("/Tasks/updateTask", "PUT", updatedTask);

      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const checkedTasks = resData
    ? resData.filter((task) => task.completed)?.length
    : 0;
  const progress =
    resData?.length > 0 ? (checkedTasks / resData?.length) * 100 : 0;

  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      sx={{ textAlign: "center", pb: 8, width: "95%", margin: "0 auto" }}
      spacing={5}
    >
      {loading && <Loading />}
      {error && (
        <DialogMessage
          title="שגיאה!"
          btnValue="אוקיי!"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Typography variant="body1" color="grey">
            {error}
          </Typography>
        </DialogMessage>
      )}
      <Stack
        spacing={5}
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "80%" }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          המשימות שלכם
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ width: "100%" }}
        />
        <List sx={{ width: "100%" }}>
          {resData?.map((task, index) => (
            <ListItem key={task.taskID}>
              <Checkbox
                checked={task.completed}
                onChange={() => handleCheck(index)}
              />
              <ListItemText primary={task.taskName} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => setCurrentTaskID(task.taskID)}
                >
                  <PlaylistAddCheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Stack direction="row" spacing={2}>
          <TextField
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            label="משימה חדשה"
          />
          <Button
            onClick={handleAddTask}
            variant="contained"
            sx={{ height: "fit-content" }}
          >
            <AddIcon />
            הוסף משימה
          </Button>
        </Stack>
        {currentTask && (
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {currentTask.taskName}
            </Typography>
            <TextField multiline rows={4} placeholder="הערות" fullWidth />
            <Typography variant="h5">תתי משימות</Typography>
            <List>
              {currentTask.subTasks &&
                currentTask.subTasks.map((subtask, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={subtask.subTaskName} />
                  </ListItem>
                ))}
            </List>
            <Stack direction="row" spacing={2}>
              <TextField
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                label="תת משימה חדשה"
              />
              <Button
                onClick={handleAddSubTask}
                variant="contained"
                sx={{ height: "fit-content" }}
              >
                <AddIcon />
                הוסף תת משימה
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default TasksListComp;
