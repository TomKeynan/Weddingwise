import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { test } from "../utilities/collections";
import { customTheme } from "../store/Theme";
import AccordionLayout from "../components/AccordionLayout";
import { supplierCards } from "../utilities/collections";
import SupplierCard from "../components/SupplierCard";
import CostsChart from "../components/CostsChart";
import ProfileBanner from "../components/ProfilePage/ProfileBanner";

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
  }, []);

  const navigate = useNavigate();

  function routeToQuestions() {
    navigate("/questionnaire");
  }

  return (
    <Stack spacing={3} alignItems="center" sx={loginStackSX}>
      {currentUser && <ProfileBanner props={currentUser} />}
      <Button variant="outlined" onClick={routeToQuestions} size="large">
        שאלון
      </Button>
      <Box sx={{ width: "90%" }}>
        <AccordionLayout title="חבילת נותני שירות" btnValue="/package">
          <Grid container sx={cardsContainer}>
            {supplierCards.map((supplier, index) => (
              <SupplierCard key={index} props={supplier} />
            ))}
          </Grid>
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
