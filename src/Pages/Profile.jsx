import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { test } from "../utilities/collections";
import { customTheme } from "../store/Theme";
import AccordionLayout from "../components/AccordionLayout";
import { supplierCard } from "../utilities/collections";
import SupplierCard from "../components/SupplierCard";
import CostsChart from "../components/CostsChart";
const Profile = () => {
  const navigate = useNavigate();

  function routeToQuestions() {
    navigate("/questionnaire");
  }

  return (
    <Stack
      spacing={3}
      alignItems="center"
      sx={loginStackSX}
    >
      <Stack justifyContent="center" sx={bannerSX}>
        <Stack sx={{ textAlign: "center", zIndex: 1 }}>
          <Typography sx={namesSX}>
            {`${test.brideName} & ${test.groomName}`}
          </Typography>
          <Typography sx={weddingDateSX}>{`${test.date}`}</Typography>
        </Stack>
      </Stack>
      <Button variant="outlined" onClick={routeToQuestions} size="large">
        שאלון
      </Button>
      <Box sx={{ width: "90%" }}>
        <AccordionLayout title="חבילת נותני שירות" btnValue="/package">
          <Grid container sx={cardsContainer}>
            {supplierCard.map((supplier, index) => (
              <SupplierCard key={index} props={supplier} />
            ))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout title="מעקב אחר הוצאות" btnValue="/package">
            {/* <CostsChart /> */}
        </AccordionLayout>
        <AccordionLayout title="ניהול מוזמנים" btnValue="/package">

        </AccordionLayout>
        <AccordionLayout title="רשימת מטלות" btnValue="/package">

        </AccordionLayout>
      </Box>
    </Stack>
  );
};

export default Profile;

const loginStackSX = {
  height: "100%",
  width: "100%",
};

const bannerSX = {
  position: "relative",
  minHeight: { xs: 300, sm: 400 },
  top: -90,
  minWidth: "100%",
  backgroundImage: `url(assets/profileBanner.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "left",
  boxShadow: customTheme.shadow.strong,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: { xs: "rgba(0,0,0,0.1)", sm: "rgba(0,0,0,0.4)" },
  },
};

const namesSX = {
  fontSize: { xs: 40, sm: 55, md: 80 },
  fontWeight: "bold",
  color: { sm: "secondary.light" },
};

const weddingDateSX = {
  fontSize: { xs: 35, sm: 45, md: 65 },
  letterSpacing: { xs: 5, sm: 25 },
  fontWeight: "lighter",
  color: { sm: "secondary.light" },
  fontFamily: "system-ui",
};

const cardsContainer = {
  maxWidth: "100%",
  p: 1,
};
