import React, { useContext } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../store/AppContext";
import TaskListNoUser from "../components/Planner/TasksPage/TaskListNoUser";
import TasksListComp from "../components/Planner/TasksPage/TaskListComp";

function Tasks() {
  const { coupleData } = useContext(AppContext);

  return (
    <Box sx={{ minHeight: "inherit" }}>
      {coupleData === null ? (
        <TaskListNoUser />
      ) : (
        <TasksListComp />
      )}
    </Box>
  );
}

export default Tasks;
