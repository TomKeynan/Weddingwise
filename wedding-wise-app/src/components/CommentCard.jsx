import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";

export default function CommentCard() {
  return (
    <Stack sx={commentWrapperSX}>
      {/* card-header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        flexWrap="wrap"
        sx={{ width: "100%", columnGap: 1, py: 2 }}
      >
        <Box
          component="img"
          src="/assets/login.jpg"
          sx={{
            width: { xs: 60, sm: 43 },
            aspectRatio: "1/1",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        ></Box>
        {/* card-header-text */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "center" }}
          flexWrap="wrap"
          sx={{ columnGap: 1 }}
        >
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20, md: 24 },
              fontFamily: customTheme.font.main,
            }}
          >
            שמות הזוגות
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 16, md: 16 },
              color: "grey",
            }}
          >
            תאריך התגובה
          </Typography>
        </Stack>
      </Stack>

      <Typography sx={{ fontSize: { xs: 16, sm: 20, md: 24 }, px: 1 }}>
        כאן יבוא תוכן התגובה Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Hic nemo soluta expedita mollitia aperiam et nobis pariatur!
        Voluptas sequi odit, eligendi nostrum sapiente iste nisi.
      </Typography>
    </Stack>
  );
}

const commentWrapperSX = {
  bgcolor: "white",
  // bgcolor: customTheme.supplier.colors.primary.light,
  p: { xs: 1, sm: 3 },
  boxShadow: customTheme.shadow.main,
  borderRadius: 3,
};
