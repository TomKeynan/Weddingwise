import React, { useState } from "react";
import SupplierBanner from "../components/SupplierBanner";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { translateSupplierTypeToHebrew } from "../utilities/functions";
import { customTheme } from "../store/Theme";
import Tabs from "../components/Tabs";
import KpiPaper from "../components/KpiPaper";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

const initialData = JSON.parse(sessionStorage.getItem("currentSupplier"));

const kpis = [
  { title: "מספר המדרגים:", data: "125", icon: <PeopleOutlineIcon /> },
  { title: "דירוג:", data: "4.75", icon: <StarOutlineIcon /> },
];

function SupplierPrivateProfile() {
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  const [supplier, setSupplier] = useState(initialData);
  return (
    <Stack spacing={3} sx={stackWrapperSX}>
      <SupplierBanner />
      <Stack
        justifyContent="center"
        sx={{
          width: "70%",
          "&.MuiStack-root": {
            margin: "0 auto",
          },
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ teatAlign: "center", mt: { xs: 0, sm: 3 } }}
        >
          <Typography sx={namesSX}>
            {`${translateSupplierTypeToHebrew(supplier.supplierType)} - ${
              supplier.businessName
            }`}
          </Typography>
        </Stack>
        <Stack
          direction={screenAboveSM ? "row" : "column"}
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ mb: 15, mt: 10 }}
        >
          {kpis.map((kpi, index) => (
            <KpiPaper key={index} kpi={kpi} />
          ))}
        </Stack>
        <Tabs />
      </Stack>
    </Stack>
  );
}

export default SupplierPrivateProfile;

const stackWrapperSX = {
  minHeight: "inherit",
  backgroundImage: "url(assets/bg-stars.png)",
};

const namesSX = {
  fontFamily: customTheme.font.main,
  fontSize: { xs: 32, sm: 45, md: 55 },
  color: customTheme.palette.primary.main,
  textAlign: "center",
  WebkitTextStrokeWidth: { xs: 2, sm: 5 },
};

const descriptionSX = {
  // fontFamily: customTheme.font.main,
  fontSize: { xs: 30, sm: 40, md: 50 },
  //   mr: { xs: 3, sm: 3, md: 8 },
  // pr: { xs: 3, sm: 5, md: 8 },
  //   WebkitTextStrokeWidth: { xs: 2, sm: 5 },
  //   color: customTheme.supplier.colors.primary.main
};
