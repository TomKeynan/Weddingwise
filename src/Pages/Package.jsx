import React, { useState } from "react";
import RandomPackage from "../components/RandomPackage";
import UserWithoutPackage from "../components/UserWithoutPackage";
import UserPackage from "../components/UserPackage";
import { Box } from "@mui/material";
function Package() {
  const [userStatus, setUserStatus] = useState(2);
  return (
    <Box sx={{ display: "block", width: "100%" }}>
      {userStatus === 0 ? (
        <RandomPackage />
      ) : userStatus === 1 ? (
        <UserWithoutPackage />
      ) : (
        <UserPackage />
      )}
    </Box>
  );
}

export default Package;
