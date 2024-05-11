import React, { useContext, useEffect, useState } from "react";
import RandomPackage from "../components/RandomPackage";
import UserWithoutPackage from "../components/UserWithoutPackage";
import UserPackage from "../components/UserPackage";
import { Box } from "@mui/material";
import { AppContext } from "../store/AppContext";
function Package() {
  const [userStatus, setUserStatus] = useState(null);
  // console.log(JSON.parse(sessionStorage.getItem("currentUser")).package)
  const { userData } = useContext(AppContext)
  // useEffect(() => {
  //   if (userData === null) {
  //     setUserStatus(null);
  //     return;
  //   }
  //   if (status.package === null) setUserStatus(1);
  //   else setUserStatus(2);
  //   // console.log(userStatus);
  // }, []);
  // useEffect(() => {
  //   const status = JSON.parse(sessionStorage.getItem("currentUser"));
  //   if (status === null) {
  //     setUserStatus(null);
  //     return;
  //   }
  //   if (status.package === null) setUserStatus(1);
  //   else setUserStatus(2);
  //   // console.log(userStatus);
  // }, []);

  return (
    <Box sx={{ display: "block", width: "100%" }}>
      {userData === null ? (
        <RandomPackage />
      ) : userData.package === null ? (
        <UserWithoutPackage />
      ) : (
        <UserPackage />
      )}
    </Box>
  );
}

export default Package;
