import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { Container } from "@mui/material";
import { customTheme } from "../../store/Theme";
import Footer from "../Footer";
import { ScrollRestoration } from "react-router-dom";
import Chat from "../ChatPage/Chat"
import { useChatStore } from "../../fireBase/chatStore";
import { AppContext } from "../../store/AppContext";

const SupplierLayout = () => {
  const { coupleData } = useContext(AppContext)
  const { chatStatus } = useChatStore();


  return (
    <Container sx={containerSX} maxWidth="xxl">
      <Navbar isSupplier={coupleData === null ? true : false} />
      <Outlet />
      {chatStatus && <Chat />}
      <Footer />
      <ScrollRestoration />
    </Container>
  );
};

export default SupplierLayout;

const containerSX = {
  display: "block",
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  "&.MuiContainer-root": {
    padding: 0,
  },
  background: customTheme.supplier.colorBg.main ,
};
