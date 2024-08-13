import React, { useState } from "react";
import "../App.css";
import { Box, Button, Paper, Stack } from "@mui/material";
import { customTheme } from "../store/Theme";
import { NavLink } from "react-router-dom";

function DropDownNavItem({ isLayout }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const plannerPages = [
    { id: 1, route: "tasks", text: "רשימת מטלות" },
    { id: 2, route: "invitees", text: "ניהול מוזמנים" },
    { id: 3, route: "/expense-tracking", text: "מעקב הוצאות" },
  ];

  return (
    <Box
      sx={
        !isLayout
          ? {
              color: "white",
              position: "relative",
              cursor: "pointer",
              px: 1,
              fontWeight: "500",
              fontSize: 22,
              color: "white",
            }
          : {
              fontWeight: "500",
              fontSize: 22,
              color: customTheme.palette.secondary.dark,
              textDecoration: "none",
              display: "block",
              transform: "translateY(0px)",
              p: 1.25,
              cursor: "default",
            }
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Planner
      {isDropdownOpen && (
        <Paper elevation={8} sx={{}}>
          <Stack
            justifyContent="space-around"
            sx={{
              display: "flex",
              position: "absolute",
              top: "100%",
              right: 0,
              zIndex: 1,
              py: 3,
              bgcolor: "white",
              borderRadius: 1,
              minHeight: 120,
            }}
          >
            {plannerPages.map((page) => (
              <NavLink
                key={page.id}
                to={page.route}
                style={{ textDecoration: "none" }}
              >
                <Box sx={menuItemSX}>{page.text}</Box>
              </NavLink>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

export default DropDownNavItem;

const menuItemSX = {
  width: 130,
  px: 3,
  py: 1,
  ":hover": {
    bgcolor: customTheme.palette.primary.light,
  },
  fontWeight: "bold",
  lineHeight: 2,
  fontSize: 16,
  color: "#000",
  textAlign: "center",
};
