import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container } from "@mui/material";
import { customTheme } from "../store/Theme";

const RootLayout = () => {
  return (
    <Container sx={containerSX} maxWidth="xxl">
      <Navbar />
      <Outlet />
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
    pb: 10,
  },
  background: customTheme.colorBg.main,
};
