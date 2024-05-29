import React from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import Hero from "../components/HomePage/Hero";
import SuppliersCarousel from "../components/HomePage/SuppliersCarousel";
import MapSection from "../components/HomePage/MapSection";
import Description from "../components/HomePage/Description";
import Footer from "../components/Footer";
// import Gmap from "../components/HomePage/Gmap";
function Home() {
  const navigate = useNavigate();

  // function routToProfile() {
  //   navigate("/profile");
  // }

  // function routeToSignUp() {
  //   navigate("/sign-up");
  // }

  // function routeToLogin() {
  //   navigate("/login");
  // }

  return (
    <>
      <Stack justifyContent="center" sx={homeContainer}>
        <Hero />
        <Stack sx={homeContentWrapper}>
          <SuppliersCarousel />
          <MapSection />
          <Description />
        </Stack>
      </Stack>
      <Footer />
    </>
  );
}

export default Home;

const homeContainer = {
  display: "block",
  // height: "100vh",
  background: customTheme.colorBg.main,
  boxShadow: customTheme.shadow.main,
};

const homeContentWrapper = {
  width: { xs: "90%", sm: "80%" },
  margin: "0 auto",
  pb: 6,
};
