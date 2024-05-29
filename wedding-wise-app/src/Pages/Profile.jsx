import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { test } from "../utilities/collections";
import { customTheme } from "../store/Theme";
import AccordionLayout from "../components/AccordionLayout";
import { supplierCards } from "../utilities/collections";
import SupplierCard from "../components/SupplierCard";
import CostsChart from "../components/CostsChart";
import ProfileBanner from "../components/ProfilePage/ProfileBanner";

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);

  const currentCouple = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
  }, []);

  return (
    <Stack spacing={3} alignItems="center" sx={loginStackSX}>
      {currentUser && <ProfileBanner props={currentUser} />}

      <Box sx={{ width: "90%" }}>
        <AccordionLayout title="חבילת נותני שירות" btnValue="/package">
          {currentCouple !== null && currentCouple.package !== null ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-around"
              flexWrap="wrap"
              rowGap={3}
              columnGap={2}
            >
              {currentCouple.package["selectedSuppliers"].map(
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
        <AccordionLayout
          title="ניהול מוזמנים"
          btnValue="/package"
        ></AccordionLayout>
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
  height: "100%",
  width: "100%",
};

const cardsContainer = {
  maxWidth: "100%",
  p: 1,
};
