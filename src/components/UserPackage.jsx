import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { supplierCard, typeWeights } from "../utilities/collections";
import TypeWeightCard from "./TypeWeightCard";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "./OutlinedButton";
import SupplierCard from "./SupplierCard";
import { customTheme } from "../store/Theme";

function UserPackage() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/questionnaire");
  }
  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      sx={{ textAlign: "center" }}
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
            {typeWeights.map((type, index) => (
              <TypeWeightCard key={index} props={type} />
            ))}
          </Grid>
        </Stack>
      </Stack>
      <Stack spacing={3} justifyContent="space-around" alignItems="center">
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", width: "90%", px: {xs: 1 , sm:5}  }}
        >
          חבילת נותני השירות המתאימים במיוחד אליכם
        </Typography>
        <Stack sx={{ width: "90%" }}>
          <Grid container sx={cardsContainer}>
            {supplierCard.map((supplier, index) => (
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
          >
            אשר חבילה
          </Button>
        </Box>
      </Stack>
      <Stack
        spacing={3}
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "90%", px: {xs: 1 , sm:5} }}
      >
        <Typography sx={{typography: {xs: "body1", sm: "h5", md: "h4"}}}>
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


