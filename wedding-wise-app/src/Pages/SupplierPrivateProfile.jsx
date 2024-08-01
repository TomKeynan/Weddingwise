import React, { useContext, useEffect } from "react";
import SupplierBanner from "../components/SupplierBanner";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { translateSupplierTypeToHebrew } from "../utilities/functions";
import { customTheme } from "../store/Theme";
import Tabs from "../components/Tabs";
import KpiPaper from "../components/KpiPaper";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { AppContext } from "../store/AppContext";
import { useUserStore } from "../fireBase/userStore";
import Loading from "../components/Loading";
import useFetch from "../utilities/useFetch";
import { Navigate } from "react-router-dom";

function SupplierPrivateProfile() {
  const { isLoading, fetchUserInfo } = useUserStore();
  const { loading } = useFetch();
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  const { supplierData } = useContext(AppContext);

  return !supplierData ? (
    <Navigate to="/suppliers" />
  ) : isLoading || loading ? (
    <Loading />
  ) : (
    <Stack spacing={3} sx={stackWrapperSX}>
      <SupplierBanner />
      <Stack
        justifyContent="center"
        sx={{
          width: { xs: "90%", sm: "70%" },
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
            {`${translateSupplierTypeToHebrew(supplierData.supplierType)} - ${
              supplierData.businessName
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
          <KpiPaper
            title="מספר המדרגים:"
            data={supplierData.ratedCount}
            icon={<PeopleOutlineIcon />}
          />
          <KpiPaper
            title="דירוג:"
            data={supplierData.rating}
            icon={<StarOutlineIcon />}
          />
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
  pb: 10,
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
