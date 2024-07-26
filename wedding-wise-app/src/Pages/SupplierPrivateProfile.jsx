import React, { useState } from "react";
import SupplierBanner from "../components/SupplierBanner";
import { Stack, Typography } from "@mui/material";
import { translateSupplierTypeToHebrew } from "../utilities/functions";
import { customTheme } from "../store/Theme";
import Tabs from "../components/Tabs";

const initialData = JSON.parse(sessionStorage.getItem("currentSupplier"));
function SupplierPrivateProfile() {
  const [supplier, setSupplier] = useState(initialData);
  return (
    <Stack spacing={3} sx={stackWrapperSX}>
      <SupplierBanner
        // businessName={}
        type={translateSupplierTypeToHebrew(supplier.supplierType)}
      />

      <Stack
        justifyContent="center"
        sx={{
          width: "90%",
          "&.MuiStack-root": {
            margin: "0 auto",
            // m: 0,
          },
        }}
      >
        <Stack sx={{}}>
          <Typography sx={namesSX}>
            {`${translateSupplierTypeToHebrew(supplier.supplierType)} - ${
              supplier.businessName
            }`}
          </Typography>
          <Typography sx={descriptionSX}>כמות מדרגים: </Typography>
          <Typography sx={descriptionSX}>דירוג: </Typography>
          <Tabs />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SupplierPrivateProfile;

const stackWrapperSX = {
  minHeight: "inherit",
};

const namesSX = {
  fontFamily: customTheme.font.main,
  fontSize: { xs: 40, sm: 45, md: 55 },
  //   mr: { xs: 3, sm: 3, md: 8 },
  // pr: { xs: 3, sm: 5, md: 8 },
  //   WebkitTextStrokeWidth: { xs: 2, sm: 5 },
  //   color: customTheme.supplier.colors.primary.main
};

const descriptionSX = {
  // fontFamily: customTheme.font.main,
  fontSize: { xs: 30, sm: 40, md: 50 },
  //   mr: { xs: 3, sm: 3, md: 8 },
  // pr: { xs: 3, sm: 5, md: 8 },
  //   WebkitTextStrokeWidth: { xs: 2, sm: 5 },
  //   color: customTheme.supplier.colors.primary.main
};
