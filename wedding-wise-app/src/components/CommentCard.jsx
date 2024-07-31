import { Box, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";

export default function CommentCard() {
  // this comp. should get an array of comment objects.
  // comment object should look like that: {
  //  image: "",
  //  names: "",
  //  date: "",
  //  rating: int,
  //  text: ""
  //}

  return (
    <Stack sx={commentWrapperSX}>
      {/* card-header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ width: "100%", columnGap: 1, py: 2 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "center" }}
          flexWrap="wrap"
          sx={{ columnGap: 1 }}
        >
          <Box
            component="img"
            src="/assets/login.jpg" // comment.image
            sx={{
              width: { xs: 60, sm: 43 },
              aspectRatio: "1/1",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          ></Box>
          {/* card-header-text */}
          <Stack alignItems={{xs: "center", sm: "flex-start"}}>
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18, md: 20 },
                fontFamily: customTheme.font.main,
              }}
              // {comment.names}
            >
              שמות הזוגות
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14 },
                color: "grey",
              }}
              // {comment.date}
            >
              תאריך התגובה
            </Typography>
          </Stack>
        </Stack>
        <Rating
          name="read-only"
          value={3.75} // {comment.rating}
          readOnly
          size="small"
        />{" "}
      </Stack>

      <Typography
        sx={{ fontSize: { xs: 14, sm: 16 }, px: 1 , textAlign:"center"}}
        // {comment.text}
      >
        כאן יבוא תוכן התגובה Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Hic nemo soluta expedita mollitia aperiam et nobis pariatur!
        Voluptas sequi odit, eligendi nostrum sapiente iste nisi.
      </Typography>
    </Stack>
  );
}

const commentWrapperSX = {
  direction: "ltr",
  bgcolor: "white",
  // bgcolor: customTheme.supplier.colors.primary.light,
  p: { xs: 1, sm: 3 },
  // boxShadow: customTheme.shadow.main,
  borderRadius: 3,
};
// import { Box, Stack, Typography } from "@mui/material";
// import React from "react";
// import { customTheme } from "../store/Theme";

// export default function CommentCard() {
//   return (
//     <Stack sx={commentWrapperSX}>
//       {/* card-header */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         alignItems="center"
//         flexWrap="wrap"
//         sx={{ width: "100%", columnGap: 1, py: 2 ,   }}
//       >
//         <Box
//           component="img"
//           src="/assets/login.jpg"
//           sx={{
//             width: { xs: 60, sm: 43 },
//             aspectRatio: "1/1",
//             borderRadius: "50%",
//             objectFit: "cover",
//           }}
//         ></Box>
//         {/* card-header-text */}
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           alignItems={{ xs: "center", sm: "center" }}
//           flexWrap="wrap"
//           sx={{ columnGap: 1 }}
//         >
//           <Typography
//             sx={{
//               fontSize: { xs: 16, sm: 18, md: 20 },
//               fontFamily: customTheme.font.main,
//             }}
//           >
//             שמות הזוגות
//           </Typography>
//           <Typography
//             sx={{
//               fontSize: { xs: 12, sm: 14 },
//               color: "grey",
//             }}
//           >
//             תאריך התגובה
//           </Typography>
//         </Stack>
//       </Stack>

//       <Typography sx={{ fontSize: { xs: 14, sm: 16 }, px: 1 }}>
//         כאן יבוא תוכן התגובה Lorem ipsum dolor sit amet consectetur adipisicing
//         elit. Hic nemo soluta expedita mollitia aperiam et nobis pariatur!
//         Voluptas sequi odit, eligendi nostrum sapiente iste nisi.
//       </Typography>
//     </Stack>
//   );
// }

// const commentWrapperSX = {
//   direction: "ltr",
//   bgcolor: "white",
//   // bgcolor: customTheme.supplier.colors.primary.light,
//   p: { xs: 1, sm: 3 },
//   // boxShadow: customTheme.shadow.main,
//   borderRadius: 3,
// };
