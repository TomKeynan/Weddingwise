import { Box, Rating, Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";

export default function CommentCard({
  giverAvatar,
  giverName,
  text,
  commentDate,
  rating,
}) {


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
        {/* card-header-text */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "center" }}
          flexWrap="wrap"
          sx={{ columnGap: 1 }}
        >
          <Box
            component="img"
            src={giverAvatar}
            sx={{
              width: { xs: 60, sm: 43 },
              aspectRatio: "1/1",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          ></Box>
          {/* card-header-text */}
          <Stack alignItems={{ xs: "center", sm: "flex-start" }}>
            <Typography
              sx={{
                fontFamily: customTheme.font.main,
                fontSize: { xs: 16, sm: 18, md: 20 },
              }}
            >
              {giverName}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 14 },
                color: "grey",
              }}
            >
              {commentDate}
            </Typography>
          </Stack>
        </Stack>
        <Rating
          name="read-only"
          value={rating} // {comment.rating}
          readOnly
          size="small"
        />{" "}
      </Stack>

      <Typography
        sx={{
          textAlign: { xs: "center", sm: "left" },
          fontSize: { xs: 14, sm: 16 },
          px: 1,
          py:2,
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

const commentWrapperSX = {
  direction: "ltr",
  bgcolor: "white",
  // bgcolor: customTheme.supplier.colors.primary.light,
  p: { xs: 1, sm: 3 },
  boxShadow: customTheme.shadow.main,
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
