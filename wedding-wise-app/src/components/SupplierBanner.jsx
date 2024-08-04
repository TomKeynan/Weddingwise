import { Box, Stack } from "@mui/material";
import { React} from "react";
import { customTheme } from "../store/Theme";


function SupplierBanner({supplierFirebase}) {

  return (
    <>
      {(
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
                src={supplierFirebase?.avatar || '/path/to/default/avatar.png'} // Add a fallback image URL
                alt="Supplier Avatar"
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
  backgroundImage: `url(assets/supplier_LP/banner-supplier.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "left",
  boxShadow: customTheme.shadow.strong,
  "&.MuiStack-root": {
    mb: 10,
  },
};
