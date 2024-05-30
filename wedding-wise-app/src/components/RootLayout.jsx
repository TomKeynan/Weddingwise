import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container } from "@mui/material";
import { customTheme } from "../store/Theme";
import Footer from "./Footer";
import { ScrollRestoration } from "react-router-dom";

const RootLayout = () => {
  return (
    <Container sx={containerSX} maxWidth="xxl">
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollRestoration />
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
