import React, { useState } from "react";
import {
  Checkbox,
  Button,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import { taskListDefault } from "../../../utilities/collections";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddIcon from "@mui/icons-material/Add";

function TasksListComp() {
  const [tasks, setTasks] = useState(taskListDefault);
  const [newTask, setNewTask] = useState("");
  const [currentSubTask, setCurrentSubTask] = useState(null); // null at first
  const [newSubTask, setNewSubTask] = useState("");

  const handleAddTask = () => {
    setTasks([...tasks, { title: newTask, completed: false, subtasks: [] }]);
    setNewTask("");
  };

  const handleAddSubTask = () => {
    if (currentSubTask != null) {
      // is a currentSubTask selected
      const index = tasks.findIndex(
        (task) => task.title === currentSubTask.title
      );
      if (index !== -1) {
        const tempTasks = [...tasks];
        //  array exists or created empty
        if (!tempTasks[index].subtasks) {
          tempTasks[index].subtasks = [];
        }
        tempTasks[index].subtasks.push({ title: newSubTask, completed: false });
        setTasks(tempTasks);
        setNewSubTask("");
      }
    }
  };

  const handleCheck = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const checkedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length > 0 ? (checkedTasks / tasks.length) * 100 : 0;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "50px" }}>
          <div>
            <LinearProgress variant="determinate" value={progress} />

            <List>
              {tasks.map((task, index) => (
                <ListItem key={index}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCheck(index)}
                  />
                  <ListItemText primary={task.title} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => setCurrentSubTask(task)}>
                      <PlaylistAddCheckIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            <Button onClick={handleAddTask} variant="contained" style={{ margin: "10px", height: "23px" }}>
              <AddIcon />
              הוסף משימה חדשה
            </Button>
          </div>

          {currentSubTask && (
            <div>
              <h3 style={{ textDecoration: "underline" }}>
                {currentSubTask.title}:
              </h3>
              <h3>הערות</h3>
              <TextField multiline rows={4} placeholder="הערות" />

              <h3>תתי משימות</h3>
              {currentSubTask.subtasks &&
                currentSubTask.subtasks.map((subtask, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={subtask.title} />
                  </ListItem>
                ))}
              <input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
              />
              <Button onClick={handleAddSubTask} variant="contained" style={{ margin: "10px", height: "23px" }}>
                <AddIcon />
                הוסף תת משימה חדשה
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TasksListComp;
