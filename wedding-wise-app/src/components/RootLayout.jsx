import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container } from "@mui/material";
import { customTheme } from "../store/Theme";
import Footer from "./Footer";

const RootLayout = () => {
  return (
    <Container sx={containerSX} maxWidth="xxl">
      <Navbar />
      <Outlet />
      <Footer />
    </Container>
  );
};

export default RootLayout;

const containerSX = {
  display: "block",
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  "&.MuiContainer-root": {
    padding: 0,
  },
  background: customTheme.colorBg.main,
};
