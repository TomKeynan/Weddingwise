import { Box, Stack } from "@mui/material";
import React from "react";
import { customTheme } from "../store/Theme";
import { useUserStore } from "../fireBase/userStore";
import Loading from "./Loading";

function SupplierBanner() {
  const { currentUser, isLoading } = useUserStore();
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          sx={bannerSX}
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", zIndex: 1, minHeight: 400 }}
          >
            <Box
              sx={{
                border: "3px solid black",
                width: { xs: 250, sm: 400 },
                height: { xs: 250, sm: 400 },
                borderRadius: "50%",
                position: "absolute",
                bottom: { xs: "-20%", sm: "-40%" },
              }}
            >
              <Box
                component="img"
                src={currentUser.avatar}
                sx={{
                  width: { xs: 250, sm: 400 },
                  height: { xs: 250, sm: 400 },
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default SupplierBanner;

const bannerSX = {
  minWidth: "100%",
  position: "relative",
  minHeight: { xs: 300, sm: 400 },
  top: -90,
  minWidth: "100%",
  backgroundImage: `url(assets/supplier_LP/banner-supplier.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "left",
  boxShadow: customTheme.shadow.strong,
  "&.MuiStack-root": {
    mb: 10,
  },
};

const namesSX = {
  fontFamily: customTheme.font.main,
  fontSize: { xs: 40, sm: 45, md: 55 },
  //   mr: { xs: 3, sm: 3, md: 8 },
  pr: { xs: 3, sm: 5, md: 8 },
  //   color: customTheme.supplier.colors.primary.main
};
// import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
// import React from "react";
// import { customTheme } from "../store/Theme";

// const size = 400
// function SupplierBanner({ businessName, type }) {
//     const screenAboveSM = useMediaQuery("(min-width: 1200px)");
//   return (
//       <Stack spacing={4} direction="row" justifyContent="space-between" sx={bannerSX}>
//       <Stack
//         justifyContent="flex-end"
//         alignItems="center"
//         sx={{ width: "40%", zIndex: 1, minHeight: size }}
//       >
//         <Box sx={{ width: size, height: size }}>
//           <Box
//             sx={{
//               border: "3px solid black",
//               width: size,
//               height: size,
//               borderRadius: "50%",
//               position: "absolute",
//               bottom: "-40%",
//             }}
//           >
//             <img
//               src="/assets/login.jpg"
//               style={{
//                 width: size,
//                 height: size,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//               }}
//             />
//           </Box>
//         </Box>
//       </Stack>
//       <Stack
//         justifyContent="flex-end"
//         alignItems="flex-end"
//         sx={{ zIndex: 1, minHeight: size, flexGrow: 1 }}
//       >
//         <Typography sx={namesSX}> {`${type} - ${businessName}`}</Typography>
//       </Stack>
//     </Stack>
//   );
// }

// export default SupplierBanner;

// const bannerSX = {
//   minWidth: "100%",
//   position: "relative",
//   minHeight: { xs: 300, sm: 400 },
//   top: -90,
//   minWidth: "100%",
//   backgroundImage: `url(assets/supplier_LP/banner-supplier.png)`,
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "cover",
//   backgroundPosition: "left",
//   boxShadow: customTheme.shadow.strong,
//   "&.MuiStack-root": {
//     mb: 25,
//   },
// };

// const namesSX = {
//   fontFamily: customTheme.font.main,
//   fontSize: { xs: 40, sm: 45, md: 55 },
// //   mr: { xs: 3, sm: 3, md: 8 },
//   pr: { xs: 3, sm: 5, md: 8},
//   //   WebkitTextStrokeWidth: { xs: 2, sm: 5 },
//   //   color: customTheme.supplier.colors.primary.main
// };
