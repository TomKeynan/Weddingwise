import React, { useContext, useEffect, useState } from "react";
import RandomPackage from "../components/PackagePage/RandomPackage";
import UserWithoutPackage from "../components/PackagePage/UserWithoutPackage";
import UserPackage from "../components/PackagePage/UserPackage";
import { Box } from "@mui/material";
import { AppContext } from "../store/AppContext";

function Package() {
  const { coupleData } = useContext(AppContext);
  return (
    <Box sx={{ minHeight: "inherit" }}>
      {coupleData === null ? (
        <RandomPackage />
      ) : coupleData.package === null ? (
        <UserWithoutPackage />
      ) : (
        <UserPackage />
      )}
    </Box>
  );
}

export default Package;
