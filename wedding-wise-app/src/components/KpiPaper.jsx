import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";

function KpiPaper({ title, data, icon, extraSX }) {
  return (
    <Paper variant="elevation" elevation={10} sx={kpiWrapperSX}>
      <Stack spacing={2}>
        <Typography sx={titleSX}>{title}</Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: "center",...extraSX, }}
        >
          <Typography
            sx={{
              fontSize: { xs: 18, md: 28 },
              fontFamily: customTheme.font.main,
              mr: 2,
              
            }}
          >
            {data}
          </Typography>
          <Box
            sx={{
              color: customTheme.supplier.colors.primary.dark,
              fontSize: { xs: 20, md: 22 },
            }}
          >
            {icon}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default KpiPaper;

const kpiWrapperSX = {
  p: { xs: 1, sm: 1.5 },
  textAlign: "center",
  borderRadius: 3,
};

const titleSX = {
  fontSize: { xs: 18, md: 28 },
  textDecoration: "underline",
  color: customTheme.supplier.colors.primary.main,
};
