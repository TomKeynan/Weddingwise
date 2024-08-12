import React from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { customTheme } from "../store/Theme";
import Hero from "../components/HomePage/Hero";
import SuppliersCarousel from "../components/HomePage/SuppliersCarousel";
import MapSection from "../components/HomePage/MapSection";
import Description from "../components/HomePage/Description";
import Footer from "../components/Footer";
import { ScrollRestoration } from "react-router-dom";
import { useChatStore } from "../fireBase/chatStore";
import Chat from "../components/ChatPage/Chat"

function Home() {
  const { chatStatus } = useChatStore();
  return (
    <>
      {chatStatus && <Chat />} 
      <Stack justifyContent="center" sx={homeContainer}>
        <Hero />
        <Stack sx={homeContentWrapper}>
          <SuppliersCarousel />
          <MapSection />
          <Description />
        </Stack>
      </Stack>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

export default Home;

const homeContainer = {
  display: "block",
  minHeight: "100vh",
  background: customTheme.colorBg.main,
  boxShadow: customTheme.shadow.main,
};

const homeContentWrapper = {
  width: { xs: "90%", sm: "80%" },
  margin: "0 auto",
  pb: 6,
};
