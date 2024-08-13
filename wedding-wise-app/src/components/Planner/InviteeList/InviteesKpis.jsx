import React, { useContext } from "react";
import { AppContext } from "../../../store/AppContext";
import { Grid, Stack, Paper, Typography } from "@mui/material";

function InviteesKpis({ bgColor }) {
  const { invitees } = useContext(AppContext);

  const totalInvitees = invitees
    ? invitees.reduce(
        (acc, invitee) => acc + parseInt(invitee.numberOfInvitees || 0, 10),
        0
      )
    : 0;
  const rsvpYes = invitees
    ? invitees
        .filter((invitee) => invitee.rsvp)
        .reduce(
          (acc, invitee) => acc + parseInt(invitee.numberOfInvitees || 0, 10),
          0
        )
    : 0;
  const brideSide = invitees
    ? invitees
        .filter((invitee) => invitee.side === "כלה")
        .reduce(
          (acc, invitee) => acc + parseInt(invitee.numberOfInvitees || 0, 10),
          0
        )
    : 0;
  const groomSide = invitees
    ? invitees
        .filter((invitee) => invitee.side === "חתן")
        .reduce(
          (acc, invitee) => acc + parseInt(invitee.numberOfInvitees || 0, 10),
          0
        )
    : 0;

  const kpiPaperSX = {
    py: 2,
    px: 3,
    borderRadius: 3,
    bgcolor: bgColor,
  };

  return (
    <Stack justifyContent="center" sx={kpiContainer}>
      <Grid container maxWidth="xxl" spacing={2} sx={{ placeItems: "center" }}>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>מספר המוזמנים: {totalInvitees}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>אישרו הגעה: {rsvpYes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>צד כלה: {brideSide}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} sx={kpiWrapper}>
          <Paper elevation={4} sx={kpiPaperSX}>
            <Typography sx={kpiText}>צד חתן: {groomSide}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default InviteesKpis;

const kpiContainer = { px: 1, width: "95%", margin: "auto" };
const kpiWrapper = {};

const kpiText = { textAlign: "center" };
