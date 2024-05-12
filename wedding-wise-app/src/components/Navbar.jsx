import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { Box, Stack, useMediaQuery } from "@mui/material/";
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
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const screenAboveMD = useMediaQuery("(min-width: 900px)");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{}}
                    disableRipple
                  >
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
                    sx={{
                      color: "white",
                      fontSize: 18,
                    }}
                  >
                    {page.text}
                  </NavLink>
                ))}
              </Stack>

              {/* Logo  + Icon */}
              <Stack direction="row-reverse" alignItems="center" flexGrow={1}>
                <CardGiftcardIcon
                  sx={{ display: { xs: "none", md: "flex" } }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    fontFamily: "Varela Round",
                    fontWeight: "bold",
                    fontSize: { xs: 22, md: 26 },
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  WeddingWise
                </Typography>
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
              <Box sx={{ flexGrow: 1 }}>
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
                        mt: 0.5,
                        color: "secondary.dark",
                        "&.MuiSvgIcon-root": { transform: "scale(1.3)" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    height: "1000px",
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
                </Menu>
              </Box>
              <CardGiftcardIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                WeddingWise
              </Typography>

              <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.text}</Typography>
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

// import React, { useState } from "react";
// import classes from "./Navbar.module.css";
// import { NavLink, useNavigate } from "react-router-dom";
// import { customTheme } from "../store/Theme";
// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// import { Stack } from "@mui/system";
// import { Paper, Slide } from "@mui/material";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// const pages = [
//   { route: "/", text: "דף הבית" },
//   { route: "/profile", text: "פרופיל" },
//   { route: "/package", text: "חבילה" },
//   { route: "/noPathYet", text: "Planner" },
// ];
// const settings = [
//   { route: "/login", text: "התחבר" },
//   { route: "/sign-up", text: "צור חשבון" },
// ];

// const mobileNavOptions = pages.concat(settings);

// function Navbar({ styled }) {
//   const navigate = useNavigate();
//   const [isNavOpen, setIsNavOpen] = useState(false);
//   const [anchorElUser, setAnchorElUser] = useState(null);

//   const handleOpenNav = () => {
//     setIsNavOpen((prev) => !prev);
//   };

//   const handleCloseNav = (route) => {
//     switch (route) {
//       case "/":
//         navigate("/");
//         break;

//       case "/login":
//         navigate("/login");
//         break;

//       case "/sign-up":
//         navigate("/sign-up");
//         break;

//       case "/profile":
//         navigate("/profile");
//         break;

//       case "/package":
//         navigate("/package");
//         break;

//       default:
//         navigate("/");
//     }
//     setIsNavOpen(false);
//   };

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <Container maxWidth="auto" sx={styled !== "home" ? ContainerNavSX : ContainerNavHomeSX}>
//       {/* ==================== mobile ================= */}
//       <Box
//         sx={{
//           display: { xs: "flex", md: "none" },
//           width: "80%",
//           height: "100%",
//           justifyContent: "space-between",
//           alignItem: "center",
//           margin: "0 auto",
//         }}
//       >
//         <IconButton
//           disableRipple
//           size="large"
//           aria-label="account of current user"
//           aria-controls="menu-appbar"
//           aria-haspopup="true"
//           onClick={handleOpenNav}
//           color="inherit"
//         >
//           <MenuIcon sx={{ width: 30, height: 30 }} />
//         </IconButton>
//         <Typography
//           noWrap
//           sx={{
//             fontFamily: "sans-serif",
//             fontWeight: "bold",
//             fontSize: { xs: 28, sm: 35 },
//             letterSpacing: "-.1rem",
//             textDecoration: "none",
//             m: "auto 0",
//             mr: 2,
//           }}
//         >
//           WeddingWise
//         </Typography>
//       </Box>
//       {isNavOpen && (
//         <Slide in={true}>
//           <Paper
//             sx={{
//               display: { xs: "flex", md: "none" },
//               height: "50vh",
//               width: { xs: "90vw", sm: "300px" },
//               position: "absolute",
//               top: 65,
//               // left: 0,
//               zIndex: 10,
//               bgcolor: "white",
//               m: "0 8px",
//             }}
//             elevation={12}
//           >
//             <Stack
//               justifyContent="space-evenly"
//               alignItems="center"
//               m=" 10px auto"
//             >
//               {mobileNavOptions.map((page) => (
//                 <MenuItem
//                   key={page.text}
//                   onClick={() => handleCloseNav(page.route)}
//                   sx={{
//                     "&.MuiButtonBase-root:hover": {
//                       bgcolor: customTheme.palette.secondary.light,
//                     },
//                   }}
//                 >
//                   <Typography textAlign="center">{page.text}</Typography>
//                 </MenuItem>
//               ))}
//             </Stack>
//           </Paper>
//         </Slide>
//       )}
//       {/* =============== md screen ============= */}

//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         width="80%"
//         margin="0 auto"
//         sx={{ height: "100%", display: { xs: "none", md: "flex" } }}
//       >
// <Stack
//   direction="row"
//   justifyContent="space-evenly"
//   alignItems="center"
//   sx={{
//     width: 120,
//     py: 1,
//     borderRadius: 80,
//     bgcolor: customTheme.palette.secondary.dark,
//     cursor: "pointer",
//     ml: 2,
//   }}
//   onClick={handleOpenUserMenu}
// >
//   <Box>
// <AccountCircleIcon
//   fontSize="large"
//   sx={{
//     mt: 0.5,

//     "&.MuiSvgIcon-root": { transform: "scale(1.1)" },
//   }}
// />
//   </Box>
//   <Box>
//     <MenuIcon
//       sx={{
//         mt: 0.5,
//         "&.MuiSvgIcon-root": {
//           transform: "scale(1.3)",
//           color: customTheme.palette.secondary.light,
//         },
//       }}
//     />
//   </Box>
// </Stack>
//         <Box
//           sx={{
//             gap: 2,
//             display: "flex",
//             justifyContent: "space-evenly",
//             alignItems: "center",
//             height: "100px",
//             width: "45%",
//           }}
//         >
//           {pages.map((page) => (
//             <NavLink
//               to={page.route}
//               key={page.text}
//               className={({ isActive }) =>
//                 isActive ? classes.active : classes.navLink
//               }
//               end
//             >
//               {page.text}
//             </NavLink>
//           ))}
//         </Box>
//         <Box>
//           <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{
//               mr: 2,
//               display: { xs: "none", md: "flex" },
//               fontFamily: "sans-serif",
//               fontWeight: "bold",
//               fontSize: 30,
//               letterSpacing: "-.1rem",
//               textDecoration: "none",

//             }}
//           >
//             WeddingWise
//           </Typography>
//         </Box>
//       </Stack>
//       <Menu
//         sx={{
//           mt: "45px",
//           "& .MuiPaper-root": { p: 1, cursor: "pointer" },
//         }}
//         id="menu-appbar"
//         anchorEl={anchorElUser}
//         anchorOrigin={{
//           vertical: 120,
//           horizontal: 115,
//         }}
//         keepMounted
//         transformOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         open={Boolean(anchorElUser)}
//         onClose={handleCloseUserMenu}
//       >
//         {settings.map((setting) => (
//           <MenuItem
//             key={setting.text}
//             sx={{
//               "&.MuiButtonBase-root:hover": {
//                 bgcolor: customTheme.palette.secondary.light,
//               },
//             }}
//             onClick={() => handleCloseNav(setting.route)}
//           >
//             <Typography textAlign="center">{setting.text}</Typography>
//           </MenuItem>
//         ))}
//       </Menu>
//     </Container>
//   );
// }
// export default Navbar;

// const ContainerNavSX = {
//   mb: 3,
//   position: "sticky",
//   borderBottomLeftRadius: 50,
//   borderBottomRightRadius: 50,
//   height: 90,
//   top: 0,
//   zIndex: 10,
//   background: "white",
//   color: "black",
//   boxShadow: customTheme.shadow.main,
//   "&.MuiContainer-root": {
//     padding: 0,
//   },
// };
// const ContainerNavHomeSX = {
//   mb: 3,
//   position: "sticky",
//   borderBottomLeftRadius: 50,
//   borderBottomRightRadius: 50,
//   height: "10vh",
//   top: 0,
//   zIndex: 5,
//   color: "white",
//   "&.MuiContainer-root": {
//     padding: 0,
//     bgcolor: "transparent"
//   },
// };
