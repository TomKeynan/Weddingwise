import React, { useContext, useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useChatStore } from "../fireBase/chatStore";
import { useUserStore } from "../fireBase/userStore";
import DropDownNavItem from "./DropDownNavItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../fireBase/firebase";
import { useSupplierData } from "../fireBase/supplierData";

function Navbar({ isLayout = true, isSupplier = false }) {
  const navigate = useNavigate();
  // isLayout detect rather navbar's style should be for home page or all other pages
  const screenAboveMD = useMediaQuery("(min-width: 900px)");

  const { changeChatStatus, isSeen, changeIsSeenStatus, chatStatus } = useChatStore();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const { currentUser, isLoading, logout } = useUserStore();
  const { clearRelevantSupplier, setRelevantSupplier } = useSupplierData();


  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const {
    coupleData,
    setCoupleData,
    supplierData,
    setSupplierData,
    setOfferedPackage,
    setEditCoupleComeFrom,
  } = useContext(AppContext);

  const connectedCouplePages = [
    { route: "/", text: "דף הבית" },
    { route: "/profile", text: "פרופיל" },
    { route: "/package", text: "חבילה" },
    { route: "/", text: 0 },
  ];

  const connectedCouplePagesSmall = [
    { route: "/", text: "דף הבית" },
    { route: "/profile", text: "פרופיל" },
    { route: "/package", text: "חבילה" },
    { route: "/tasks", text: "רשימת מטלות" },
    { route: "/invitees", text: "ניהול מוזמנים" },
    { route: "/expense-tracking", text: "מעקב הוצאות" },
  ];

  const couplePages = [
    { route: "/", text: "דף הבית" },
    { route: "/package", text: "חבילה" },
    { route: "/planner", text: "Planner" },
  ];

  const connectedSupplierPages = [
    { route: "/suppliers", text: "דף הבית" },
    { route: "/supplier-private-Profile", text: "עדכונים" },
    { route: "/supplier-public-Profile", text: "הפרופיל שלי" },
  ];

  const supplierPages = [
    { route: "/", text: "דף הבית" },
    { route: "/package", text: "חבילה" },
    { route: "/planner", text: "Planner" },
  ];

  const coupleSettings = [
    { route: "/login", text: "התחבר" },
    { route: "/sign-up", text: "צור חשבון" },
    { route: "/suppliers", text: "נותן שירות?" },
  ];

  const supplierSettings = [
    { route: "/supplier-login", text: "התחבר" },
    { route: "/supplier-signup", text: "צור חשבון" },
    { route: "/suppliers", text: "דף הבית-ספקים" },
  ];

  const connectedSupplierSettings = [
    { route: "/suppliers", text: "דף הבית-ספקים" },
    { route: "/suppliers", text: "התנתק" },
  ];

  const connectedCoupleSettings = [
    { route: "/edit-couple-details", text: "עדכן פרטים" },
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
    setEditCoupleComeFrom("navbar");
  };

  function handleCoupleLogout(linkText) {
    if (linkText === "התנתק") {
      sessionStorage.setItem("currentCouple", JSON.stringify(null));
      setCoupleData(null);
      sessionStorage.setItem("offeredPackage", JSON.stringify(null));
      setOfferedPackage(null);
      setSupplierData(null);
      handleLogout();
    }
  }

  function handleSupplierLogout(linkText) {
    if (linkText === "התנתק") {
      setSupplierData(null);
      handleLogout();
    }
  }

  // Adam's
  async function handleLogout() {
    try {
      clearRelevantSupplier();
      const auth = getAuth();
      await signOut(auth);
      logout();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Adam's
  const handleChat = () => {
    changeChatStatus();
    handleCloseUserMenu();
  };


  const handleSupplierNavigate = () => {
    handleCloseNavMenu();
    setRelevantSupplier(supplierData);
  }



  useEffect(() => {
    let unSubChat = null;

    // Set up the listener for changes to the current chat
    if (currentUser?.id) {
      unSubChat = onSnapshot(doc(db, "userChats", currentUser.id), (res) => {
        const chatsData = res.data();
        if (chatsData && Array.isArray(chatsData.chats)) {
          const hasUnseenChat = chatsData.chats.some(
            (chat) => chat.isSeen === false
          );
          changeIsSeenStatus(!hasUnseenChat);
        }
      });
    }

    // Cleanup function to unsubscribe from the chat listener
    return () => {
      if (unSubChat) {
        unSubChat();
      }
    };
  }, [currentUser?.id, changeIsSeenStatus]);

  // isActive = boolean property which destructured form the NavLink component.
  function navLinkLayoutStyles({ isActive }) {
    return {
      fontWeight: isActive ? "bold" : "500",
      fontSize: isActive ? 24 : 22,
      color: isActive ? "purple" : customTheme.palette.secondary.dark,
      textDecoration: isActive ? "underline" : "none",
      display: "block",
      transform: isActive ? "translateY(-5px)" : "translateY(0px)",
      paddingRight: "10px",
      paddingLeft: "10px",
    };
  }

  function navLinkHomeStyles({ isActive }) {
    return {
      fontWeight: isActive ? "bold" : "500",
      fontSize: isActive ? 24 : 22,
      color: isActive ? customTheme.palette.primary.light : "white",
      textDecoration: isActive ? "underline" : "none",
      display: "block",
      transform: isActive ? "translateY(-5px)" : "translateY(0px)",
      paddingRight: "8px",
      paddingLeft: "8px",
    };
  }

  function renderMenuPages(page) {
    if (page.text) {
      return (
        <NavLink
          key={page.text}
          to={page.route}
          style={isLayout ? navLinkLayoutStyles : navLinkHomeStyles}
          onClick={handleCloseNavMenu}
        >
          {page.text}
        </NavLink>
      );
    } else {
      return (
        <Box key={page.route}>
          <DropDownNavItem isLayout={isLayout} />
        </Box>
      );
    }
  }

  return (
    <AppBar sx={isLayout ? appBarForLayoutSX : appBarForHomeSX}>
      <Container maxWidth="xxl" sx={{ p: 0 }}>
        <Toolbar disableGutters>
          {/*  layout for screen devices above 900px(md) */}
          {screenAboveMD && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{
                width: "100vw",
                height: 80,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                flexGrow={1}
              >
                {/* Settings Menu - couple*/}
                <Box>
                  <Tooltip title="התחברות / הרשמה">
                    <IconButton onClick={handleOpenUserMenu} disableRipple>
                      {/* Icon */}
                      {/* {Adam's} */}
                      {!isSeen && user && !isLoading && (supplierData || coupleData) ? (
                        <img
                          style={{
                            height: "35px",
                            position: "absolute",
                            right: "-14.5px",
                            bottom: "58%",
                            zIndex: "1000",
                          }}
                          src="assets/chat_pics/inbox.png"
                          alt=""
                        />
                      ) : null}
                      <AccountCircleIcon
                        sx={isLayout ? accountIconLayoutSX : accountIconHomeSX}
                      />
                    </IconButton>
                  </Tooltip>
                  {/* Setting Menu- Popup */}
                  <Menu
                    sx={settingMenuSX}
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
                    {/* Settings Menu */}
                    <Box sx={{ width: "25%" }}>
                      <Tooltip title="התחברות / הרשמה">
                        <IconButton onClick={handleOpenUserMenu} disableRipple>
                          {/* Icon */}
                          <AccountCircleIcon
                            sx={
                              isLayout ? accountIconLayoutSX : accountIconHomeSX
                            }
                          />
                        </IconButton>
                      </Tooltip>
                      {/* Setting Menu- Popup */}
                      <Menu
                        sx={settingMenuSX}
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
                        {
                          // when current user is a supplier but he hasn't logged in yet show this menu
                          isSupplier &&
                          !supplierData &&
                          supplierSettings.map((setting) => (
                            <MenuItem
                              key={setting.text}
                              onClick={handleCloseUserMenu}
                              sx={menuItemSX}
                            >
                              <Link to={setting.route} style={menuLinkStyle}>
                                <Typography sx={typographyLinkSX}>
                                  {setting.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))
                        }
                        {
                          // when current user is a supplier and he has logged in show this menu
                          isSupplier &&
                          supplierData &&
                          connectedSupplierSettings.map((setting) => (
                            <MenuItem
                              key={setting.text}
                              onClick={handleCloseUserMenu}
                              sx={menuItemSX}
                            >
                              <Link
                                to={setting.route}
                                style={menuLinkStyle}
                                onClick={() =>
                                  handleSupplierLogout(setting.text)
                                }
                              >
                                <Typography sx={typographyLinkSX}>
                                  {setting.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))
                        }
                        {
                          // when current user is a couple but he isn't logged in yet show this menu
                          !isSupplier &&
                          !coupleData &&
                          coupleSettings.map((setting) => (
                            <MenuItem
                              key={setting.text}
                              onClick={handleCloseUserMenu}
                              sx={menuItemSX}
                            >
                              <Link to={setting.route} style={menuLinkStyle}>
                                <Typography sx={typographyLinkSX}>
                                  {setting.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))
                        }
                        {
                          // when current user is a couple and he has logged in show this menu
                          !isSupplier &&
                          coupleData &&
                          connectedCoupleSettings.map((setting) => (
                            <MenuItem
                              key={setting.text}
                              onClick={handleCloseUserMenu}
                              sx={menuItemSX}
                            >
                              <Link
                                to={setting.route}
                                style={menuLinkStyle}
                                onClick={() =>
                                  handleCoupleLogout(setting.text)
                                }
                              >
                                <Typography sx={typographyLinkSX}>
                                  {setting.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))
                        }

                        {/* {Adam's}  */}
                        {!isLoading && currentUser &&  (supplierData || coupleData) && (
                          <MenuItem onClick={handleChat} sx={menuItemSX}>
                            <Link
                              onClick={(e) => e.preventDefault()}
                              style={menuLinkStyle}
                            >
                              {isSeen ? (
                                <Typography sx={typographyLinkSX}>
                                  צ'אט
                                </Typography>
                              ) : (
                                <Typography sx={typographyLinkSX}>
                                  צ'אט <span style={{ color: "red" }}>*</span>
                                </Typography>
                              )}
                            </Link>
                          </MenuItem>
                        )}
                      </Menu>
                    </Box>
                  </Menu>
                </Box>
              </Stack>

              {/* Pages */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                sx={{}}
              >
                {
                  // when current user is a supplier but he hasn't logged in yet show this menu
                  isSupplier &&
                  !supplierData &&
                  supplierPages.map((page) => (
                    <NavLink
                      key={page.text}
                      to={page.route}
                      style={
                        isLayout ? navLinkLayoutStyles : navLinkHomeStyles
                      }
                      onClick={handleCloseNavMenu}
                    >
                      {page.text}
                    </NavLink>
                  ))
                }
                {
                  // when current user is a supplier and he has logged in show this menu
                  isSupplier &&
                  supplierData &&
                  connectedSupplierPages.map((page) => (
                    <NavLink
                      key={page.text}
                      to={page.route}
                      style={
                        isLayout ? navLinkLayoutStyles : navLinkHomeStyles
                      }
                      onClick={handleSupplierNavigate}
                    >
                      {page.text}
                    </NavLink>
                  ))
                }
                {
                  // when current user is a couple but he hasn't logged in yet show this menu
                  !isSupplier &&
                  !coupleData &&
                  couplePages.map((page) => (
                    <NavLink
                      key={page.text}
                      to={page.route}
                      style={
                        isLayout ? navLinkLayoutStyles : navLinkHomeStyles
                      }
                      onClick={handleCloseNavMenu}
                    >
                      {page.text}
                    </NavLink>
                  ))
                }
                {
                  // when current user is a couple and he is logged in show this menu
                  !isSupplier &&
                  coupleData &&
                  connectedCouplePages.map((page) => renderMenuPages(page))
                }
              </Stack>

              {/* Logo  + Icon */}
              <Stack
                direction="row-reverse"
                alignItems="center"
                sx={{ width: "30%" }}
              >
                <Typography
                  noWrap
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: customTheme.font.main,
                    fontWeight: "bold",
                    fontSize: 24,
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

          {/*  ======================================== */}
          {/*  layout for screen devices under 900px(md) */}
          {/*  ======================================== */}
          {!screenAboveMD && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{
                width: "95%",
                height: 80,
              }}
            >
              {/* Pages Menu */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  // aria-label="account of current user"
                  // aria-controls="menu-appbar"
                  // aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  sx={{
                    display: { xs: "block", md: "none" },
                    ...settingMenuSX,
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {
                    // when current user is a supplier but he hasn't logged in yet show this menu
                    isSupplier &&
                    !supplierData &&
                    supplierPages.map((page) => (
                      <MenuItem
                        key={page.text}
                        onClick={handleCloseNavMenu}
                        sx={menuItemSX}
                      >
                        <Link to={page.route} style={menuLinkStyle}>
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                              lineHeight: 2.5,
                            }}
                          >
                            {page.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a supplier and he has logged in show this menu
                    isSupplier &&
                    supplierData &&
                    connectedSupplierPages.map((page) => (
                      <MenuItem
                        key={page.text}
                        onClick={handleSupplierNavigate}
                        sx={menuItemSX}
                      >
                        <Link to={page.route} style={menuLinkStyle}>
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                              lineHeight: 2.5,
                            }}
                          >
                            {page.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a couple but he hasn't logged in yet show this menu
                    !isSupplier &&
                    !coupleData &&
                    couplePages.map((page) => (
                      <MenuItem
                        key={page.text}
                        onClick={handleCloseNavMenu}
                        sx={menuItemSX}
                      >
                        <Link to={page.route} style={menuLinkStyle}>
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                              lineHeight: 2.5,
                            }}
                          >
                            {page.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a couple and he is logged in show this menu
                    !isSupplier &&
                    coupleData &&
                    connectedCouplePagesSmall.map((page) => (
                      <MenuItem
                        key={page.text}
                        onClick={handleCloseNavMenu}
                        sx={menuItemSX}
                      >
                        <Link to={page.route} style={menuLinkStyle}>
                          <Typography
                            sx={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "#000",
                              lineHeight: 2.5,
                            }}
                          >
                            {page.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
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

              {/* Settings Menu */}
              <Box>
                <Tooltip title="התחברות / הרשמה">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, ml: 2 }}
                    disableRipple
                  >
                    {/* Icon */}
                    <AccountCircleIcon
                      sx={
                        isLayout
                          ? accountIconLayoutSx_Small
                          : accountIconHomeSX_Small
                      }
                    />
                  </IconButton>
                </Tooltip>

                {/* Setting Menu- Popup */}
                <Menu
                  sx={settingMenuSX}
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
                  {
                    // when current user is a supplier but he isn't logged in yet show this menu
                    isSupplier &&
                    !supplierData &&
                    supplierSettings.map((setting) => (
                      <MenuItem
                        key={setting.text}
                        onClick={handleCloseUserMenu}
                        sx={menuItemSX}
                      >
                        <Link to={setting.route} style={menuLinkStyle}>
                          <Typography sx={typographyLinkSX}>
                            {setting.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a supplier and he is logged in show this menu
                    isSupplier &&
                    supplierData &&
                    connectedSupplierSettings.map((setting) => (
                      <MenuItem
                        key={setting.text}
                        onClick={handleCloseUserMenu}
                        sx={menuItemSX}
                      >
                        <Link
                          to={setting.route}
                          style={menuLinkStyle}
                          onClick={() => handleSupplierLogout(setting.text)}
                        >
                          <Typography sx={typographyLinkSX}>
                            {setting.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a couple but he isn't logged in yet show this menu
                    !isSupplier &&
                    !coupleData &&
                    coupleSettings.map((setting) => (
                      <MenuItem
                        key={setting.text}
                        onClick={handleCloseUserMenu}
                        sx={menuItemSX}
                      >
                        <Link to={setting.route} style={menuLinkStyle}>
                          <Typography sx={typographyLinkSX}>
                            {setting.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {
                    // when current user is a couple and he is logged in show this menu
                    !isSupplier &&
                    coupleData &&
                    connectedCoupleSettings.map((setting) => (
                      <MenuItem
                        key={setting.text}
                        onClick={handleCloseUserMenu}
                        sx={menuItemSX}
                      >
                        <Link
                          to={setting.route}
                          style={menuLinkStyle}
                          onClick={() => handleCoupleLogout(setting.text)}
                        >
                          <Typography sx={typographyLinkSX}>
                            {setting.text}
                          </Typography>
                        </Link>
                      </MenuItem>
                    ))
                  }
                  {/* {Adam's}  */}
                  {!isLoading && currentUser && (supplierData || coupleData) && (
                    <MenuItem onClick={handleChat} sx={menuItemSX}>
                      <Link
                        onClick={(e) => e.preventDefault()}
                        style={menuLinkStyle}
                      >
                        {isSeen ? (
                          <Typography sx={typographyLinkSX}>צ'אט</Typography>
                        ) : (
                          <Typography sx={typographyLinkSX}>
                            צ'אט <span style={{ color: "red" }}>*</span>
                          </Typography>
                        )}
                      </Link>
                    </MenuItem>
                  )}
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

const appBarForLayoutSX = {
  position: "sticky",
  bgcolor: "white",
  color: "secondary.dark",
  mb: 5,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
};

const appBarForHomeSX = {
  position: "relative",
  bgcolor: "transparent",
  color: "white",
  "&.MuiAppBar-root": {
    boxShadow: "none",
  },
};

const accountIconLayoutSX = {
  mt: 0.5,
  color: "secondary.dark",
  "&.MuiSvgIcon-root": { fontSize: 50 },
};

const accountIconHomeSX = {
  mt: 0.5,
  color: "white",
  "&.MuiSvgIcon-root": { fontSize: 50 },
};

const accountIconLayoutSx_Small = {
  color: "secondary.dark",
  "&.MuiSvgIcon-root": { fontSize: 35 },
};

const accountIconHomeSX_Small = {
  color: "white",
  "&.MuiSvgIcon-root": { fontSize: 35 },
};

const settingMenuSX = {
  mt: "45px",
  "& .MuiBackdrop-root": {
    background: "rgba(0, 0, 0, 0.4)",
    height: "100%",
  },
  "& .MuiMenu-paper": {
    py: 2,
  },
};

const menuItemSX = {
  ":hover": {
    bgcolor: customTheme.palette.primary.light,
  },
  "&.MuiMenuItem-root": {
    display: "flex",
    width: 150,
    p: 0,
  },
};

const menuLinkStyle = { textDecoration: "none", flexGrow: 1 };

const typographyLinkSX = {
  fontWeight: "bold",
  lineHeight: 2.5,
  fontSize: 16,
  color: "#000",
  textAlign: "center",
};
// import React, { useContext, useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import AppBar from "@mui/material/AppBar";
// import { Box, Button, Stack, useMediaQuery } from "@mui/material/";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
// import { customTheme } from "../store/Theme";
// import { AppContext } from "../store/AppContext";

// function Navbar({ isLayout = true }) {
//   const screenAboveMD = useMediaQuery("(min-width: 900px)");

//   const [anchorElNav, setAnchorElNav] = useState(null);
//   const [anchorElUser, setAnchorElUser] = useState(null);
//   const { coupleData, setCoupleData, setOfferedPackage } =
//     useContext(AppContext);

//   const pages = coupleData
//     ? [
//         { route: "/", text: "דף הבית" },
//         { route: "/profile", text: "פרופיל" },
//         { route: "/package", text: "חבילה" },
//         { route: "/noPathYet", text: "Planner" },
//       ]
//     : [
//         { route: "/", text: "דף הבית" },
//         { route: "/package", text: "חבילה" },
//         { route: "/noPathYet", text: "Planner" },
//       ];

//   const settings = [
//     { route: "/login", text: "התחבר" },
//     { route: "/sign-up", text: "צור חשבון" },
//   ];
//   const userSettings = [
//     { route: "/edit", text: "עדכן פרטים" },
//     { route: "/", text: "התנתק" },
//   ];

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   function handleClick(linkText) {
//     if (linkText === "התנתק") {
//       sessionStorage.setItem("currentCouple", JSON.stringify(null));
//       setCoupleData(null);
//       sessionStorage.setItem("offeredPackage", JSON.stringify(null));
//       setOfferedPackage(null);
//     }
//   }

//   // isActive = boolean property which destructured form the NavLink component.
//   function navLinkLayoutStyles({ isActive }) {
//     return {
//       fontWeight: isActive ? "bold" : "500",
//       fontSize: isActive ? 24 : 22,
//       color: isActive ? "purple" : customTheme.palette.secondary.dark,
//       textDecoration: isActive ? "underline" : "none",
//       display: "block",
//       transform: isActive ? "translateY(-5px)" : "translateY(0px)",
//       paddingRight: "10px",
//       paddingLeft: "10px",
//     };
//   }

//   function navLinkHomeStyles({ isActive }) {
//     return {
//       fontWeight: isActive ? "bold" : "500",
//       fontSize: isActive ? 24 : 22,
//       color: isActive ? customTheme.palette.primary.light : "white",
//       textDecoration: isActive ? "underline" : "none",
//       display: "block",
//       transform: isActive ? "translateY(-5px)" : "translateY(0px)",
//       paddingRight: "8px",
//       paddingLeft: "8px",
//     };
//   }

//   return (
//     <AppBar sx={isLayout ? appBarForLayoutSX : appBarForHomeSX}>
//       <Container maxWidth="xxl" sx={{ p: 0 }}>
//         <Toolbar disableGutters>
//           {/*  layout for screen devices above 900px(md) */}
//           {screenAboveMD && (
//             <Stack
//               direction="row"
//               alignItems="center"
//               justifyContent="space-around"
//               sx={{
//                 width: "100vw",
//                 height: 80,
//               }}
//             >
//               {/* Settings Menu */}
//               <Box sx={{ width: "25%" }}>
//                 <Tooltip title="התחברות / הרשמה">
//                   <IconButton onClick={handleOpenUserMenu} disableRipple>
//                     {/* Icon */}
//                     <AccountCircleIcon
//                       sx={isLayout ? accountIconLayoutSX : accountIconHomeSX}
//                     />
//                   </IconButton>
//                 </Tooltip>
//                 {/* Setting Menu- Popup */}
//                 <Menu
//                   sx={settingMenuSX}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   {settings.map((setting) => (
//                     <MenuItem
//                       key={setting.text}
//                       onClick={handleCloseUserMenu}
//                       sx={menuItemSX}
//                     >
//                       <Link to={setting.route} style={menuLinkStyle}>
//                         <Typography sx={typographyLinkSX}>
//                           {setting.text}
//                         </Typography>
//                       </Link>
//                     </MenuItem>
//                   ))}
//                   {coupleData &&
//                     userSettings.map((item) => (
//                       <MenuItem
//                         key={item.text}
//                         onClick={handleCloseUserMenu}
//                         sx={menuItemSX}
//                       >
//                         <Link
//                           to={item.route}
//                           onClick={() => handleClick(item.text)}
//                           style={menuLinkStyle}
//                         >
//                           <Typography sx={typographyLinkSX}>
//                             {item.text}
//                           </Typography>
//                         </Link>
//                       </MenuItem>
//                     ))}
//                 </Menu>
//               </Box>

//               {/* Pages */}
//               <Stack
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="center"
//                 flexGrow={1}
//                 sx={{}}
//               >
//                 {pages.map((page) => (
//                   <NavLink
//                     key={page.text}
//                     to={page.route}
//                     style={isLayout ? navLinkLayoutStyles : navLinkHomeStyles}
//                     onClick={handleCloseNavMenu}
//                   >
//                     {page.text}
//                   </NavLink>
//                 ))}
//               </Stack>

//               {/* Logo  + Icon */}
//               <Stack
//                 direction="row-reverse"
//                 alignItems="center"
//                 sx={{ width: "30%" }}
//               >
//                 <Typography
//                   noWrap
//                   component="a"
//                   href="#"
//                   sx={{
//                     fontFamily: customTheme.font.main,
//                     fontWeight: "bold",
//                     fontSize: 24,
//                     letterSpacing: ".2rem",
//                     color: "inherit",
//                     textDecoration: "none",
//                     ml: 1,
//                   }}
//                 >
//                   WeddingWise
//                 </Typography>
//                 <CardGiftcardIcon
//                   sx={{ display: { xs: "none", md: "flex" } }}
//                 />
//               </Stack>
//             </Stack>
//           )}

//           {/*  layout for screen devices under 900px(md) */}
//           {!screenAboveMD && (
//             <Stack
//               direction="row"
//               alignItems="center"
//               justifyContent="space-around"
//               sx={{
//                 width: "95%",
//                 height: 80,
//               }}
//             >
//               {/* Pages Menu */}
//               <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//                 <IconButton
//                   size="large"
//                   aria-label="account of current user"
//                   aria-controls="menu-appbar"
//                   aria-haspopup="true"
//                   onClick={handleOpenNavMenu}
//                   color="inherit"
//                 >
//                   <MenuIcon />
//                 </IconButton>
//                 <Menu
//                   sx={{
//                     display: { xs: "block", md: "none" },
//                     ...settingMenuSX,
//                   }}
//                   id="menu-appbar"
//                   anchorEl={anchorElNav}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   open={Boolean(anchorElNav)}
//                   onClose={handleCloseNavMenu}
//                 >
//                   {pages.map((page) => (
//                     <MenuItem
//                       key={page.text}
//                       onClick={handleCloseNavMenu}
//                       sx={menuItemSX}
//                     >
//                       <Link to={page.route} style={menuLinkStyle}>
//                         <Typography
//                           sx={{
//                             textAlign: "center",
//                             fontWeight: "bold",
//                             fontSize: 16,
//                             color: "#000",
//                             lineHeight: 2.5,
//                           }}
//                         >
//                           {page.text}
//                         </Typography>
//                       </Link>
//                     </MenuItem>
//                   ))}
//                 </Menu>
//               </Box>
//               <CardGiftcardIcon
//                 sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
//               />
//               <Typography
//                 variant="h5"
//                 noWrap
//                 component="a"
//                 href="#"
//                 sx={{
//                   display: { xs: "flex", md: "none" },
//                   flexGrow: 1,
//                   fontSize: { xs: 24, sm: 28 },
//                   fontFamily: customTheme.font.main,
//                   fontWeight: 700,
//                   letterSpacing: { xs: 0, sm: 5 },
//                   color: "inherit",
//                   textDecoration: "none",
//                 }}
//               >
//                 WeddingWise
//               </Typography>

//               {/* Settings Menu */}
//               <Box>
//                 <Tooltip title="התחברות / הרשמה">
//                   <IconButton
//                     onClick={handleOpenUserMenu}
//                     sx={{ p: 0, ml: 2 }}
//                     disableRipple
//                   >
//                     {/* Icon */}
//                     <AccountCircleIcon
//                       sx={
//                         isLayout
//                           ? accountIconLayoutSx_Small
//                           : accountIconHomeSX_Small
//                       }
//                     />
//                   </IconButton>
//                 </Tooltip>

//                 {/* Setting Menu- Popup */}
//                 <Menu
//                   sx={settingMenuSX}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   {settings.map((setting) => (
//                     <MenuItem
//                       key={setting.text}
//                       onClick={handleCloseUserMenu}
//                       sx={menuItemSX}
//                     >
//                       <Link to={setting.route} style={menuLinkStyle}>
//                         <Typography sx={typographyLinkSX}>
//                           {setting.text}
//                         </Typography>
//                       </Link>
//                     </MenuItem>
//                   ))}
//                   {coupleData &&
//                     userSettings.map((item) => (
//                       <MenuItem
//                         key={item.text}
//                         onClick={handleCloseUserMenu}
//                         sx={menuItemSX}
//                       >
//                         <Link
//                           to={item.route}
//                           onClick={() => handleClick(item.text)}
//                           style={menuLinkStyle}
//                         >
//                           <Typography sx={typographyLinkSX}>
//                             {item.text}
//                           </Typography>
//                         </Link>
//                       </MenuItem>
//                     ))}
//                 </Menu>
//               </Box>
//             </Stack>
//           )}
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
// export default Navbar;

// const appBarForLayoutSX = {
//   position: "sticky",
//   bgcolor: "white",
//   color: "secondary.dark",
//   mb: 7,
//   borderBottomLeftRadius: 30,
//   borderBottomRightRadius: 30,
// };

// const appBarForHomeSX = {
//   position: "relative",
//   bgcolor: "transparent",
//   color: "white",
//   "&.MuiAppBar-root": {
//     boxShadow: "none",
//   },
// };

// const accountIconLayoutSX = {
//   mt: 0.5,
//   color: "secondary.dark",
//   "&.MuiSvgIcon-root": { fontSize: 50 },
// };

// const accountIconHomeSX = {
//   mt: 0.5,
//   color: "white",
//   "&.MuiSvgIcon-root": { fontSize: 50 },
// };

// const accountIconLayoutSx_Small = {
//   color: "secondary.dark",
//   "&.MuiSvgIcon-root": { fontSize: 35 },
// };

// const accountIconHomeSX_Small = {
//   color: "white",
//   "&.MuiSvgIcon-root": { fontSize: 35 },
// };

// const settingMenuSX = {
//   mt: "45px",
//   "& .MuiBackdrop-root": {
//     background: "rgba(0, 0, 0, 0.4)",
//     height: "100%",
//   },
//   "& .MuiMenu-paper": {
//     py: 2,
//   },
// };

// const menuItemSX = {
//   ":hover": {
//     bgcolor: customTheme.palette.primary.light,
//   },
//   "&.MuiMenuItem-root": {
//     display: "flex",
//     width: 150,
//     p: 0,
//   },
// };

// const menuLinkStyle = { textDecoration: "none", flexGrow: 1 };

// const typographyLinkSX = {
//   fontWeight: "bold",
//   lineHeight: 2.5,
//   fontSize: 16,
//   color: "#000",
//   textAlign: "center",
// };
