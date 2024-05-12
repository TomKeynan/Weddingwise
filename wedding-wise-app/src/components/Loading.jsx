import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
// import React from "react";
// import { Container, Stack, Typography } from "@mui/material";
// import { customTheme } from "../store/Theme";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import { transform } from "cssjanus";

// function Loading() {
//   return (
//     <Stack justifyContent="center" alignItems="center" sx={containerSX}>
//       <CircularProgress />
//     </Stack>

//     // <Container maxWidth="xxl" sx={containerSX}>
//     //   <Typography variant="h1">Loading...</Typography>
//     // </Container>
//   );
// }

// export default Loading;

// const containerSX = {
//   width: "100%",
//   minHeight: "100vh",
//   // top: "50%",
//   // left: "50%",
//   // transform: 'translate(-50%, -50%)',
//   position: "absolute",
//   zIndex: 3,
//   "&.MuiContainer-root": {
//     padding: 0,
//   },
//   background: customTheme.colorBg.main,
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     zIndex: 0,
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },

// };
