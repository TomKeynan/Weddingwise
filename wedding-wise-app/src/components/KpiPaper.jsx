import { Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";

function KpiPaper({ kpi }) {
  return (
    <Paper variant="elevation" elevation={10} sx={kpiWrapperSX}>
      <Stack spacing={2}>
        <Typography variant="h5" sx={titleSX}>
          {kpi.title}
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 28 },
              fontFamily: customTheme.font.main,
              mr: 2,
            }}
          >
            {kpi.data}
          </Typography>
          <Box sx={{ color: customTheme.supplier.colors.primary.dark }}>
            {kpi.icon}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default KpiPaper;

const kpiWrapperSX = {
  px: { xs: 3, sm: 4 },
  py: { xs: 1, sm: 2 },
  textAlign: "center",
  minWidth: 180,
  borderRadius: 3,
};

const titleSX = {
  textDecoration: "underline",
  color: customTheme.supplier.colors.primary.main,
};
