import React from "react";
import { Stack, Typography } from "@mui/material";

import RegisterContextProvider from "../store/RegisterContext";
import EditCouple from "../components/EditCouple";

function EditDetails() {
  return (
    <RegisterContextProvider>
      <Stack
        maxWidth="xxl"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
        sx={{ margin: "auto 0", minHeight: "100vh" }}
      >
        <Typography variant="h3">עריכה ועדכון פרטים</Typography>
        <Typography variant="h5">אנא מלאו את הפרטים בקפידה.</Typography>
        <EditCouple />
      </Stack>
    </RegisterContextProvider>
  );
}

export default EditDetails;
