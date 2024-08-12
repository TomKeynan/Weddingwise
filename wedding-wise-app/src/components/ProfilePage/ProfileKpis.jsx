import React, { useContext } from "react";
import { AppContext } from "../../store/AppContext";
import { Grid, Stack, Paper, Typography } from "@mui/material";
import { addCommasToNumber } from "../../utilities/functions";

function ProfileKpis() {
  const { coupleData } = useContext(AppContext);

  return (
    <Stack justifyContent="center" sx={kpiContainer}>
      <Grid
        container
        sx={{ margin: "0 auto", width: { xs: "80%", sm: "70%" } }}
      >
        <Grid item xs={12} sm={6} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>
              מספר המוזמנים: {coupleData.numberOfInvitees}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>
              תקציב: {addCommasToNumber(coupleData.budget)} ₪
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default ProfileKpis;

const kpiContainer = { px: 1, width: "95%", mt: 7 };
const kpiWrapper = { margin: "auto" };

const kpiPaperSX = {
  py: 2,
  m: 1,
  px: { xs: 0, sm: 3 },
  borderRadius: 3,
};

const kpiText = { textAlign: "center", fontSize: { xs: 18, sm: 20 } };
