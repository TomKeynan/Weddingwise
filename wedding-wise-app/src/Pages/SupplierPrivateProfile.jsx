import React, { useContext, useEffect, useState } from "react";
import SupplierBanner from "../components/SupplierBanner";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { translateSupplierTypeToHebrew } from "../utilities/functions";
import { customTheme } from "../store/Theme";
import Tabs from "../components/Tabs";
import KpiPaper from "../components/KpiPaper";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { AppContext } from "../store/AppContext";
import { Navigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Loading from "../components/Loading";
import { fetchSupplierData } from "../fireBase/fetchSupplier";

function SupplierPrivateProfile() {

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  const { supplierData } = useContext(AppContext);
  const [supplierFirebase, setSupplierFirebase] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (supplierData?.supplierEmail) {
        setLoadingData(true);
        try {
          const data = await fetchSupplierData(supplierData.supplierEmail);
          setSupplierFirebase(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchData();
  }, [supplierData?.supplierEmail]);

  // Hope it finally works
  if (loading || loadingData) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (

    <Stack spacing={3} sx={stackWrapperSX}>
      <SupplierBanner supplierFirebase={supplierFirebase} />
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
            {`${translateSupplierTypeToHebrew(supplierData.supplierType)} - ${supplierData.businessName
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
