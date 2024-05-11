// import React, { useState } from "react";
// import {
//   Checkbox,
//   Button,
//   LinearProgress,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   TextField
// } from "@mui/material";
// import { taskListDefault } from "../../utilities/collections";
// import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
// import AddIcon from "@mui/icons-material/Add";

// function TasksListComp() {
//   const [tasks, setTasks] = useState(taskListDefault);
//   const [newTask, setNewTask] = useState("");
//   const [currentSubTask, setCurrentSubTask] = useState("");
//   const [newSubTask, setNewSubTask] = useState("");

//   const handleAddTask = () => {
//     setTasks([...tasks, { title: newTask, completed: false }]);
//     setNewTask("");
//   };
//   const handleAddSubTask = (index) => {
//     const tempTasks = [...tasks];
//     tempTasks[index].subtasks.push({ title: newSubTask });
//     setTasks(tempTasks);
//     setNewSubTask("");
//   };

//   const handleCheck = (index) => {
//     const newTasks = [...tasks];
//     newTasks[index].completed = !newTasks[index].completed;
//     setTasks(newTasks);
//   };

//   const checkedTasks = tasks.filter((task) => task.completed).length;
//   const progress = tasks.length > 0 ? (checkedTasks / tasks.length) * 100 : 0;

//   return (
//     <div style={{ display: "flex", gap: "50px" }}>
//       <div>
//         <LinearProgress variant="determinate" value={progress} />

//         <List>
//           {tasks.map((task, index) => (
//             <ListItem key={index}>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <Checkbox
//                   checked={task.checked}
//                   onChange={() => handleCheck(index)}
//                 />
//                 <ListItemText primary={task.title} />
//               </div>
//               <ListItemSecondaryAction>
//                 <IconButton edge="end" onClick={() => setCurrentSubTask(task)}>
//                   <PlaylistAddCheckIcon />
//                 </IconButton>
//               </ListItemSecondaryAction>
//             </ListItem>
//           ))}
//         </List>

//         <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
//         <Button
//           onClick={handleAddTask}
//           style={{
//             color: "#FFFFFF",
//             borderRadius: "20px",
//             backgroundColor: "#bcb8fe",
//             border: "3px solid #FFFFFF",
//           }}
//         >
//           <AddIcon />
//           הוסף מטלה חדשה
//         </Button>
//       </div>

//       {currentSubTask && (
//         <div>
//           <h3 style={{ textDecoration: "underline" }}>
//             {currentSubTask.title}:
//           </h3>
//           <h3>הערות</h3>
//           <TextField multiline rows={4} placeholder="הערות"/>

//           <h3>תתי משימות</h3>

//           {currentSubTask.subtasks.map((task, index) => (
//             <ListItem key={index}>
//                 <ListItemText primary={task.title} />
//             </ListItem>
//           ))}
//           <input
//             value={newTask}
//             onChange={(e) => setNewSubTask(e.target.value)}
//           />
//           <Button
//             onClick={handleAddSubTask}
//             style={{
//               color: "#FFFFFF",
//               borderRadius: "20px",
//               backgroundColor: "#bcb8fe",
//               border: "3px solid #FFFFFF",
//             }}
//           >
//             <AddIcon />
//             הוסף מטלה חדשה
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TasksListComp;
