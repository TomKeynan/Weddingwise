import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import OutlinedButton from "../../buttons/OutlinedButton";

function InviteesNoUser() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/login");
  }

  return (
    <div>
      <h2>התחבר למערכת בכדי לנהל את רשימת המוזמנים</h2>
      <p></p>
      <OutlinedButton btnValue="התחברו" handleClick={handleClick} />
    </div>
  );
}

export default InviteesNoUser;
