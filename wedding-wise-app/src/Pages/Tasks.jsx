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
import AddIcon from "@mui/icons-material/Add";
import { AppContext } from "../store/AppContext";
import useFetch from "../utilities/useFetch";
import Loading from "../components/Loading";
import MessageDialog from "../components/Dialogs/MessageDialog";
import TaskItem from "../components/TaskItem";
import OutlinedButton from "../components/buttons/OutlinedButton";
import { customTheme } from "../store/Theme";
import ConfirmDialog from "../components/Dialogs/ConfirmDialog";

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
  const [openNewTask, setOpenNewTask] = useState(false);
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
        // disabledBtn={isUpdateDetailsValid}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          בטוחים שאתם רוצים למחוק משימה זו?{" "}
        </Typography>
      </ConfirmDialog>
    );
  }

  return (
    <Stack alignItems="center" sx={loginStackSX}>
      {/* {loading && <Loading />} */}
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
  // textDecoration: "underline",
  // WebkitTextStrokeColor: "black",
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
  // WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
  // WebkitTextStrokeColor: "black",
};

const alertSX = {
  fontSize: 14,
  px: 2,
  justifyContent: "center",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
  textAlign: "center",
  // maxHeight: 80,
};

// import React, { useState, useEffect, useContext } from "react";
// import {
//   Box,
//   Button,
//   Stack,
//   Typography,
//   Checkbox,
//   LinearProgress,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   TextField,
// } from "@mui/material";
// import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
// import AddIcon from "@mui/icons-material/Add";
// import { AppContext } from "../store/AppContext";
// import useFetch from "../utilities/useFetch";
// import Loading from "./Login";
// import MessageDialog from "../components/Dialogs/MessageDialog";

// function Tasks() {
//   const { coupleData } = useContext(AppContext);
//   const { sendData, resData, error, loading } = useFetch();
//   const makeChanges = useFetch();

//   const [newTask, setNewTask] = useState("");
//   const [currentTaskID, setCurrentTaskID] = useState(null);
//   const [newSubTask, setNewSubTask] = useState("");
//   const [open, setOpen] = useState(false);

//   const currentTask = resData?.find((task) => task.taskID === currentTaskID);

//   useEffect(() => {
//     if (coupleData) {
//       fetchTasks();
//     }
//   }, [coupleData]);

//   const fetchTasks = async () => {
//     await sendData(`/Tasks/getTasks?coupleEmail=${coupleData.email}`, "GET");
//   };

//   const handleAddTask = async () => {
//     try {
//       await makeChanges.sendData("/Tasks/addTask", "POST", {
//         email: coupleData.email,
//         taskName: newTask,
//         completed: false,
//       });

//       await fetchTasks();
//       setNewTask("");
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   const handleAddSubTask = async () => {
//     try {
//       await makeChanges.sendData("/Tasks/addSubTask", "POST", {
//         subTaskName: newSubTask,
//         taskId: currentTaskID,
//       });

//       await fetchTasks();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const handleCheck = async (index) => {
//     try {
//       const updatedTask = {
//         ...resData[index],
//         completed: !resData[index].completed,
//       };

//       await makeChanges.sendData("/Tasks/updateTask", "PUT", updatedTask);

//       await fetchTasks();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const checkedTasks = resData
//     ? resData.filter((task) => task.completed)?.length
//     : 0;
//   const progress =
//     resData?.length > 0 ? (checkedTasks / resData?.length) * 100 : 0;

//   return (
//     <Stack
//       justifyContent="space-around"
//       alignItems="center"
//       sx={{ textAlign: "center", pb: 8, width: "95%", margin: "0 auto" }}
//       spacing={5}
//     >
//       {/* {loading && <Loading />} */}
//       {error && (
//         <MessageDialog
//           title="שגיאה!"
//           btnValue="אוקיי!"
//           open={open}
//           onClose={() => setOpen(false)}
//         >
//           <Typography variant="body1" color="grey">
//             {error}
//           </Typography>
//         </MessageDialog>
//       )}
//       <Stack
//         spacing={5}
//         justifyContent="space-around"
//         alignItems="center"
//         sx={{ width: "80%" }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: "bold" }}>
//           המשימות שלכם
//         </Typography>
//         <LinearProgress
//           variant="determinate"
//           value={progress}
//           sx={{ width: "100%" }}
//         />
//         <List sx={{ width: "100%" }}>
//           {resData?.map((task, index) => (
//             <ListItem key={task.taskID}>
//               <Checkbox
//                 checked={task.completed}
//                 onChange={() => handleCheck(index)}
//               />
//               <ListItemText primary={task.taskName} />
//               <ListItemSecondaryAction>
//                 <IconButton
//                   edge="end"
//                   onClick={() => setCurrentTaskID(task.taskID)}
//                 >
//                   <PlaylistAddCheckIcon />
//                 </IconButton>
//               </ListItemSecondaryAction>
//             </ListItem>
//           ))}
//         </List>
//         <Stack direction="row" spacing={2}>
//           <TextField
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             label="משימה חדשה"
//           />
//           <Button
//             onClick={handleAddTask}
//             variant="contained"
//             sx={{ height: "fit-content" }}
//           >
//             <AddIcon />
//             הוסף משימה
//           </Button>
//         </Stack>
//         {currentTask && (
//           <Stack spacing={2} sx={{ width: "100%" }}>
//             <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//               {currentTask.taskName}
//             </Typography>
//             <TextField multiline rows={4} placeholder="הערות" fullWidth />
//             <Typography variant="h5">תתי משימות</Typography>
//             <List>
//               {currentTask.subTasks &&
//                 currentTask.subTasks.map((subtask, idx) => (
//                   <ListItem key={idx}>
//                     <ListItemText primary={subtask.subTaskName} />
//                   </ListItem>
//                 ))}
//             </List>
//             <Stack direction="row" spacing={2}>
//               <TextField
//                 value={newSubTask}
//                 onChange={(e) => setNewSubTask(e.target.value)}
//                 label="תת משימה חדשה"
//               />
//               <Button
//                 onClick={handleAddSubTask}
//                 variant="contained"
//                 sx={{ height: "fit-content" }}
//               >
//                 <AddIcon />
//                 הוסף תת משימה
//               </Button>
//             </Stack>
//           </Stack>
//         )}
//       </Stack>
//     </Stack>
//   );
// }

// export default Tasks;
