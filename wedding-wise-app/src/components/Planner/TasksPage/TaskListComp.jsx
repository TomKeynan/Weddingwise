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

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [currentSubTask, setCurrentSubTask] = useState(null);
  const [newSubTask, setNewSubTask] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (coupleData) {
      fetchTasks();
    }
  }, [coupleData]);

  const fetchTasks = async () => {
    try {
      const data = await sendData(
        `https://localhost:44359/api/Tasks/getTasks?coupleEmail=${coupleData.email}`,
        "GET"
      );
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const data = await sendData(
        "https://localhost:44359/api/Tasks/addTask",
        "POST",
        {
          taskID: 0,
          taskName: newTask,
          email: coupleData.email,
          completed: false,
          subTasks: [],
        }
      );
      if (data) {
        setTasks([...tasks, { ...data, subTasks: [] }]);
        setNewTask("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddSubTask = async () => {
    if (currentSubTask != null) {
      const index = tasks.findIndex(
        (task) => task.taskID === currentSubTask.taskID
      );
      if (index !== -1) {
        try {
          const data = await sendData(
            "https://localhost:44359/api/SubTasks/addSubTask",
            "POST",
            {
              taskId: currentSubTask.taskID,
              subTaskName: newSubTask,
            }
          );
          if (data) {
            const tempTasks = [...tasks];
            tempTasks[index].subTasks.push(data);
            setTasks(tempTasks);
            setNewSubTask("");
          }
        } catch (error) {
          console.error("Error adding subtask:", error);
        }
      }
    }
  };

  const handleCheck = async (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    try {
      const data = await sendData(
        "https://localhost:44359/api/Tasks/updateTask",
        "PUT",
        updatedTask
      );
      if (data) {
        const newTasks = tasks.map((task, idx) =>
          idx === index ? updatedTask : task
        );
        setTasks(newTasks);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const checkedTasks = tasks
    ? tasks.filter((task) => task.completed).length
    : 0;
  const progress = tasks.length > 0 ? (checkedTasks / tasks.length) * 100 : 0;

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
          {tasks.map((task, index) => (
            <ListItem key={task.taskID}>
              <Checkbox
                checked={task.completed}
                onChange={() => handleCheck(index)}
              />
              <ListItemText primary={task.taskName} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => setCurrentSubTask(task)}>
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
        {currentSubTask && (
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {currentSubTask.taskName}
            </Typography>
            <TextField multiline rows={4} placeholder="הערות" fullWidth />
            <Typography variant="h5">תתי משימות</Typography>
            <List>
              {currentSubTask.subTasks &&
                currentSubTask.subTasks.map((subtask, idx) => (
                  <ListItem
                    key={`${currentSubTask.taskID}-${subtask.subTaskId}`}
                  >
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
