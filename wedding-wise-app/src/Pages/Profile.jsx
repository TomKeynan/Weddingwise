import { Box, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import AccordionLayout from "../components/AccordionLayout";
import SupplierCard from "../components/SupplierCard";
import ProfileBanner from "../components/ProfilePage/ProfileBanner";
import { AppContext } from "../store/AppContext";
import InviteesKpis from "../components/Planner/InviteeList/InviteesKpis";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";

import ProfileKpis from "../components/ProfilePage/ProfileKpis";

function Profile() {

  const { coupleData } = useContext(AppContext);
  

  
  if ( !coupleData ) {
    return <Navigate to="/" />;
  }


  
  return (
    <Stack alignItems="center" sx={loginStackSX}>
      <ProfileBanner props={coupleData} />
      <ProfileKpis />
      <Box sx={{ width: { xs: "80%", sm: "70%" }, marginTop: 10 }}>
        <AccordionLayout title="חבילת נותני שירות" btnValue="/package">
          {coupleData !== null && coupleData.package !== null ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-around"
              flexWrap="wrap"
              rowGap={3}
              columnGap={2}
              sx={{ width: "90%", margin: "0 auto" }}
            >
              {coupleData.package["selectedSuppliers"]?.map(
                (supplier, index) => (
                  <SupplierCard
                    key={index}
                    props={supplier}
                    cardBg={customTheme.palette.secondary.light}
                  />
                )
              )}
            </Stack>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Box>
                עדיין לא המלצנו לכם על חבילה??{" "}
                <Link to="/package" style={{ color: "#FF9500" }}>
                  לחצו כאן
                </Link>{" "}
                למעבר לשאלון
              </Box>
            </Box>
          )}
        </AccordionLayout>
        <AccordionLayout title="מעקב אחר הוצאות" btnValue="/package">
          {/* <CostsChart /> */}
        </AccordionLayout>
        <AccordionLayout title="ניהול מוזמנים" btnValue="/invitees">
          <InviteesKpis />
        </AccordionLayout>
        <AccordionLayout
          title="רשימת מטלות"
          btnValue="/package"
        ></AccordionLayout>
      </Box>
    </Stack>
  );
}

export default Profile;

const loginStackSX = {
  minHeight: "inherit",
};

const cardsContainer = {
  maxWidth: "100%",
  p: 1,
};
