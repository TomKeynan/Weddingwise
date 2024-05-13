import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { Box, Button, Stack, useMediaQuery } from "@mui/material/";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { customTheme } from "../store/Theme";
import { AppContext } from "../store/AppContext";

function Navbar() {
  const screenAboveMD = useMediaQuery("(min-width: 900px)");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { coupleData, setCoupleData } = useContext(AppContext);

  const pages = [
    { route: "/", text: "דף הבית" },
    { route: "/profile", text: "פרופיל" },
    { route: "/package", text: "חבילה" },
    { route: "/noPathYet", text: "Planner" },
  ];
  const settings = [
    { route: "/login", text: "התחבר" },
    { route: "/sign-up", text: "צור חשבון" },
  ];
  const userSettings = [
    { route: "/edit", text: "עדכן פרטים" },
    { route: "/", text: "התנתק" },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleClick(linkText) {
    if (linkText === "התנתק") {
      sessionStorage.clear();
      setCoupleData(null);
    }
  }
  // isActive = boolean property which destructured form the NavLink component.
  function navLinkStyles({ isActive }) {
    return {
      fontWeight: isActive ? "bold" : "500",
      fontSize: isActive ? 24 : 22,
      color: isActive ? "purple" : customTheme.palette.secondary.dark,
      textDecoration: isActive ? "underline" : "none",
      display: "block",
      transform: isActive ? "translateY(-5px)" : "translateY(0px)",
    };
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "white",
        color: "secondary.dark",
        mb: 7,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Toolbar disableGutters>
          {/*  layout for screen devices above 900px(md) */}
          {screenAboveMD && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{
                width: "100%",
                height: 80,
              }}
            >
              {/* Settings Menu */}
              <Box sx={{ flexGrow: 1 }}>
                <Tooltip title="התחברות / הרשמה">
                  <IconButton onClick={handleOpenUserMenu} disableRipple>
                    {/* Icon */}
                    <AccountCircleIcon
                      fontSize="large"
                      sx={{
                        mt: 0.5,
                        color: "secondary.dark",
                        "&.MuiSvgIcon-root": { transform: "scale(1.3)" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                {/* Setting Menu- Popup */}
                <Menu
                  sx={{
                    mt: "45px",
                    textAlign: "right",
                    "& .MuiBackdrop-root": {
                      background: "rgba(0, 0, 0, 0.4)",
                      height: "100%",
                    },
                    "& .MuiMenu-paper": {
                      py: 3,
                      px: 5,
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.text}
                      onClick={handleCloseUserMenu}
                      sx={{
                        ":hover": {
                          bgcolor: customTheme.palette.primary.light,
                        },
                      }}
                    >
                      <Link
                        to={setting.route}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          textAlign="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: "#000",
                          }}
                        >
                          {setting.text}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                  {coupleData &&
                    userSettings.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={handleCloseUserMenu}
                        sx={{
                          ":hover": {
                            bgcolor: customTheme.palette.primary.light,
                          },
                        }}
                      >
                        <Link
                          to={item.route}
                          onClick={() => handleClick(item.text)}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))}
                </Menu>
              </Box>

              {/* Pages */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                sx={{ gap: 4 }}
                flexGrow={1}
              >
                {pages.map((page) => (
                  <NavLink
                    key={page.text}
                    to={page.route}
                    style={navLinkStyles}
                    onClick={handleCloseNavMenu}
                  >
                    {page.text}
                  </NavLink>
                ))}
              </Stack>

              {/* Logo  + Icon */}
              <Stack direction="row-reverse" alignItems="center" flexGrow={1}>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: customTheme.font.main,
                    fontWeight: "bold",
                    fontSize: 28,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                    ml: 1,
                  }}
                >
                  WeddingWise
                </Typography>
                <CardGiftcardIcon
                  sx={{ display: { xs: "none", md: "flex" } }}
                />
              </Stack>
            </Stack>
          )}

          {/*  layout for screen devices under 900px(md) */}
          {!screenAboveMD && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{
                width: "100%",
                height: 80,
              }}
            >
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiBackdrop-root": {
                      background: "rgba(0, 0, 0, 0.4)",
                      height: "100%",
                    },
                    "& .MuiMenu-paper": {
                      py: 3,
                      px: 5,
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page.text}
                      onClick={handleCloseNavMenu}
                      sx={{
                        ":hover": {
                          bgcolor: customTheme.palette.primary.light,
                        },
                      }}
                    >
                      <Link to={page.route} style={{ textDecoration: "none" }}>
                        <Typography
                          textAlign="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: "#000",
                          }}
                        >
                          {page.text}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <CardGiftcardIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#"
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontSize: { xs: 24, sm: 28 },
                  fontFamily: customTheme.font.main,
                  fontWeight: 700,
                  letterSpacing: { xs: 0, sm: 5 },
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                WeddingWise
              </Typography>
              <Box >
                <Tooltip title="התחברות / הרשמה">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, ml: 2 }}
                    disableRipple
                  >
                    {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                    <AccountCircleIcon
                      fontSize="large"
                      sx={{
                        color: "secondary.dark",
                        "&.MuiSvgIcon-root": { transform: "scale(1.3)" },
                      }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Setting Menu- Popup */}
                <Menu
                  sx={{
                    mt: "45px",
                    "& .MuiBackdrop-root": {
                      background: "rgba(0, 0, 0, 0.4)",
                      height: "100%",
                    },
                    "& .MuiMenu-paper": {
                      py: 3,
                      px: 5,
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.text}
                      onClick={handleCloseUserMenu}
                      sx={{
                        ":hover": {
                          bgcolor: customTheme.palette.primary.light,
                        },
                      }}
                    >
                      <Link
                        to={setting.route}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          textAlign="center"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: "#000",
                          }}
                        >
                          {setting.text}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                  {coupleData &&
                    userSettings.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={handleCloseUserMenu}
                        sx={{
                          ":hover": {
                            bgcolor: customTheme.palette.primary.light,
                          },
                        }}
                      >
                        <Link
                          to={item.route}
                          onClick={() => handleClick(item.text)}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))}
                </Menu>
              </Box>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
