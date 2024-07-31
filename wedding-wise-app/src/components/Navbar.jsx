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
import { useNavigate } from "react-router-dom";
import { auth } from "../fireBase/firebase";
import { useChatStore } from "../fireBase/chatStore";
import { useUserStore } from "../fireBase/userStore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../fireBase/firebase";
import { useEffect } from "react";

function Navbar({ isLayout = true }) {
  const navigate = useNavigate();
  // isLayout detect rather navbar's style should be for home page or all other pages
  const screenAboveMD = useMediaQuery("(min-width: 900px)");

  const { resetChat, changeChatStatus, isSeen, changeIsSeenStatus } =
    useChatStore();
  const { currentUser,isLoading } = useUserStore();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { coupleData, setCoupleData, setOfferedPackage } =
    useContext(AppContext);

  const pages = coupleData
    ? [
        { route: "/", text: "דף הבית" },
        { route: "/profile", text: "פרופיל" },
        { route: "/package", text: "חבילה" },
        { route: "/noPathYet", text: "Planner" },
      ]
    : [
        { route: "/", text: "דף הבית" },
        { route: "/package", text: "חבילה" },
        { route: "/noPathYet", text: "Planner" },
      ];

  const settings = [
    { route: "/login", text: "התחבר" },
    { route: "/sign-up", text: "צור חשבון" },
    { route: "/suppliers", text: "נותן שירות?" },
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
      sessionStorage.setItem("currentCouple", JSON.stringify(null));
      setCoupleData(null);
      sessionStorage.setItem("offeredPackage", JSON.stringify(null));
      setOfferedPackage(null);

      auth.signOut();
      resetChat();
    }
  }
  const {chatStatus} = useChatStore();

  // Adam's
  const handleChat = () => {
    debugger;
    console.log(chatStatus);
    changeChatStatus();
    handleCloseUserMenu();
  };

  // Listen for changes to the current chat and update the local state
  useEffect(() => {
    
    let unSub = null;
    if (currentUser?.id) {
      unSub = onSnapshot(doc(db, "userChats", currentUser.id), (res) => {
        const chatsData = res.data();
        if (chatsData && Array.isArray(chatsData.chats)) {
          const hasUnseenChat = chatsData.chats.some(
            (chat) => chat.isSeen === false
          );
          changeIsSeenStatus(!hasUnseenChat);
        }
      });
    }

    // Cleanup the listener on component unmount
    return () => {
      if (unSub) {
        unSub();
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
                      {/* {Adam's} */}
                      {(!isSeen && currentUser && !isLoading) && (
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
                    )}
                    <IconButton onClick={handleOpenUserMenu} disableRipple>
                      {/* Icon */}
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
                    {/* {settings.map((setting) => ( */}
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
                        {settings.map((setting) => (
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
                        ))}

                        {/* {Adam's}  */}
                        {!isLoading && currentUser && (
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

                        {coupleData &&
                          userSettings.map((setting) => (
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
                          ))}
                        {coupleData &&
                          userSettings.map((item) => (
                            <MenuItem
                              key={item.text}
                              onClick={handleCloseUserMenu}
                              sx={menuItemSX}
                            >
                              <Link
                                to={item.route}
                                onClick={() => handleClick(item.text)}
                                style={menuLinkStyle}
                              >
                                <Typography sx={typographyLinkSX}>
                                  {item.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))}
                      </Menu>
                    </Box>
                    {/* Settings Menu - supplier */}
                    {!coupleData && !isLayout && (
                      <Box sx={{}}>
                        <Tooltip title="התחברות / הרשמה">
                          <IconButton
                            onClick={() => {
                              navigate("/suppliers");
                            }}
                            disableRipple
                          >
                            <Typography
                              variant="h6"
                              color="white"
                              sx={{
                                "&:hover": {
                                  textDecorationLine: "underline",
                                  color: customTheme.palette.primary.light,
                                },
                              }}
                            >
                              נותן שירות?
                            </Typography>
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
                          {settings.map((setting) => (
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
                          ))}
                          {coupleData &&
                            userSettings.map((item) => (
                              <MenuItem
                                key={item.text}
                                onClick={handleCloseUserMenu}
                                sx={menuItemSX}
                              >
                                <Link
                                  to={item.route}
                                  onClick={() => handleClick(item.text)}
                                  style={menuLinkStyle}
                                >
                                  <Typography sx={typographyLinkSX}>
                                    {item.text}
                                  </Typography>
                                </Link>
                              </MenuItem>
                            ))}
                        </Menu>
                      </Box>
                    )}
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
                {pages.map((page) => (
                  <NavLink
                    key={page.text}
                    to={page.route}
                    style={isLayout ? navLinkLayoutStyles : navLinkHomeStyles}
                    onClick={handleCloseNavMenu}
                  >
                    {page.text}
                  </NavLink>
                ))}
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

          {/*  layout for screen devices under 900px(md) */}
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
                  {pages.map((page) => (
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
                  {settings.map((setting) => (
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
                  ))}
                  {coupleData &&
                    userSettings.map((item) => (
                      <MenuItem
                        key={item.text}
                        onClick={handleCloseUserMenu}
                        sx={menuItemSX}
                      >
                        <Link
                          to={item.route}
                          onClick={() => handleClick(item.text)}
                          style={menuLinkStyle}
                        >
                          <Typography sx={typographyLinkSX}>
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

const appBarForLayoutSX = {
  position: "sticky",
  bgcolor: "white",
  color: "secondary.dark",
  mb: 7,
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
