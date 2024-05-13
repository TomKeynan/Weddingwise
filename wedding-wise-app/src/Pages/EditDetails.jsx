import React from "react";
import { Stack } from "@mui/material";

import RegisterContextProvider from "../store/RegisterContext";
import EditCouple from "../components/EditCouple";

function EditDetails() {
  return (
    <RegisterContextProvider>
      <Stack
        maxWidth="xxl"
        justifyContent="center"
        sx={{ pb: 8, height: "100%", margin: "auto 0" }}
      >
        <EditCouple />
      </Stack>
    </RegisterContextProvider>
  );
}

export default EditDetails;
