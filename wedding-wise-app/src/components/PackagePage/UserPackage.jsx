import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
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

function UserPackage() {
  const { sendData } = useFetch();

  const navigate = useNavigate();

  function handleClick() {
    navigate("/questionnaire");
  }

  const suppliers = JSON.parse(sessionStorage.getItem("currentUser")).package;

  const typeWeights = JSON.parse(
    sessionStorage.getItem("currentUser")
  ).typeWeights;

  //במקרה של החלפת ספק או חבילה שלמה יש לעדכן את האובייקט הזה ורק אז לשלוח אותו
  let packageData = {
    Package: suppliers,
    TypeReplacements: [1, 0, 0, 1, 0, 1],
    TypeWeights: typeWeights,
  };

  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      sx={{ textAlign: "center", pb: 8, width: "95%", margin: "0 auto" }}
      spacing={5}
    >
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
      <Stack spacing={3} justifyContent="space-around" alignItems="center">
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", width: "90%", px: { xs: 1, sm: 5 } }}
        >
          חבילת נותני השירות המתאימים במיוחד אליכם
        </Typography>
        <Stack sx={{ width: "90%" }}>
          <Grid container sx={cardsContainer}>
            {suppliers["selectedSuppliers"].map((supplier, index) => (
              <SupplierCard key={index} props={supplier} showActionBtn={true} />
            ))}
          </Grid>
        </Stack>
        <Box>
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
        </Box>
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
  maxWidth: "100%",
  p: 1,
  rowGap: 3,
};
