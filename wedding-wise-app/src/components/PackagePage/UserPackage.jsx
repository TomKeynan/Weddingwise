import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  supplierCards,
  typeWeights,
  stickers,
} from "../../utilities/collections";
import TypeWeightCard from "./TypeWeightCard";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../OutlinedButton";
import SupplierCard from "../SupplierCard";
import { customTheme } from "../../store/Theme";
import useFetch from "../../utilities/useFetch";
import { buildTypeWeightsCard } from "../../utilities/functions";
import DialogMessage from "../DialogMessage";

function UserPackage() {
  const { sendData } = useFetch();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [currentType, setCurrentType] = useState("");

  function handleClick() {
    navigate("/questionnaire");
  }

  const currentCouple = JSON.parse(sessionStorage.getItem("currentUser"));

  const alterativeSuppliers = JSON.parse(sessionStorage.getItem("currentUser"))
    .package.alternativeSuppliers;
  // console.log(alterativeSuppliers);

  const typeWeights = JSON.parse(
    sessionStorage.getItem("currentUser")
  ).typeWeights;

  //במקרה של החלפת ספק או חבילה שלמה יש לעדכן את האובייקט הזה ורק אז לשלוח אותו
  let packageData = {
    Package: currentCouple.package,
    TypeReplacements: [1, 0, 0, 1, 0, 1],
    TypeWeights: typeWeights,
  };

  function startReplaceSupplier(supplierType) {
    setOpen(true);
    setCurrentType(supplierType);
  }

  function handleSupplierReplacement() {
    setOpen(false);
  }
  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      sx={{ textAlign: "center", pb: 8, width: "95%", margin: "0 auto" }}
      spacing={5}
    >
      {open && (
        <DialogMessage
          title="נותני שירות חלופיים"
          open={open}
          btnValue="החלף ספק"
          onClose={handleSupplierReplacement}
        >
          {
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-around"
              flexWrap="wrap"
              rowGap={3}
              columnGap={2}
            >
              {alterativeSuppliers[currentType].map(
                (supplier, index) => (
                  <SupplierCard
                    key={index}
                    props={supplier}
                    showActionBtn={true}
                    onReplacement={startReplaceSupplier}
                  />
                )
              )}
            </Stack>
          }
        </DialogMessage>
      )}
      <Stack
        spacing={5}
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "80%" }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          העדפות שלכם (%)
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Grid container sx={cardsContainer}>
            {buildTypeWeightsCard(typeWeights, stickers).map((type, index) => (
              <TypeWeightCard key={index} props={type} />
            ))}
          </Grid>
        </Stack>
      </Stack>
      <Stack
        spacing={3}
        sx={{ width: "100%" }}
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", width: "90%", px: { xs: 1, sm: 5 } }}
        >
          חבילת נותני השירות המתאימים במיוחד אליכם
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignContent="space-around"
          flexWrap="wrap"
          rowGap={3}
          columnGap={2}
        >
          {currentCouple["package"]["selectedSuppliers"].map(
            (supplier, index) => (
              <SupplierCard
                key={index}
                props={supplier}
                showActionBtn={true}
                onReplacement={startReplaceSupplier}
              />
            )
          )}
        </Stack>
        <Stack spacing={3}>
          <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
            חבילה זו מתאימה עבורכם ב-{" "}
            {currentCouple.package.totalScore.toFixed(2)} אחוזי התאמה
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: customTheme.palette.secondary.dark,
              px: { xs: 2, sm: 4, md: 6 },
              fontWeight: "bold",
              fontSize: { xs: 16, sm: 18, md: 22 },
            }}
            onClick={() => {
              sendData(
                "https://localhost:44359/api/Packages/insertPackage",
                "POST",
                packageData
              );
            }}
          >
            אשר חבילה
          </Button>
          {/* <Button
            variant="contained"
            sx={{
              bgcolor: customTheme.palette.secondary.dark,
              px: { xs: 2, sm: 4, md: 6 },
              fontWeight: "bold",
              fontSize: { xs: 16, sm: 18, md: 22 },
            }}
          >
            אשר חבילה
          </Button> */}
        </Stack>
      </Stack>
      <Stack
        spacing={5}
        alignItems="center"
        sx={{ width: "90%", px: { xs: 1, sm: 5 } }}
      >
        <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
          לא התחברתם לחבילה המומלצת? לא לדאוג... ניתן לענות שוב שאלון העדפות
          ולקבל חבילה חדשה לגמרי.
        </Typography>
        <OutlinedButton btnValue="מילוי שאלון חדש" handleClick={handleClick} />
      </Stack>
    </Stack>
  );
}

export default UserPackage;

const cardsContainer = {
  gridTemplateRows: "repeat( auto-fill, minmax(200px, 1fr) );",
  // gridTemplateRows: 'repeat(3, 1fr)',
  margin: "0 auto",
  width: "100%",
  p: 1,
  rowGap: 3,
};
