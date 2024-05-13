import React from "react";
import { Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { supplierCards } from "../../utilities/collections";
import SupplierCard from "../SupplierCard";
import { carouselTheme } from "../../utilities/collections";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { customTheme } from "../../store/Theme";
import SuppliersCardDemo from "../suppliersCardDemo";

function SuppliersCarousel() {
  const screenUnderSM = useMediaQuery("(max-width: 600px)");
  if (screenUnderSM) {
    return (
      <Stack rowGap={3} sx={{ textAlign: "center", py: 5 }}>
        <Typography sx={carouselTextSX}>
          נותני השירות המקוצעיים ביותר
        </Typography>
        <Carousel
          responsive={carouselTheme}
          containerClass="carousel-container"
        >
          {supplierCards.map((supplier, index) => (
            <SupplierCard key={index} props={supplier} showActionBtn={true} />
          ))}
        </Carousel>
      </Stack>
    );
  } else {
    return (
      <Paper variant="elevation" elevation={6} sx={paperSX}>
        <Stack rowGap={5}>
          <Typography sx={carouselTextSX}>
            נותני השירות המקוצעיים ביותר
          </Typography>
          <Carousel
            responsive={carouselTheme}
            containerClass="carousel-container"
          >
            {supplierCards.map((supplier, index) => (
              <SuppliersCardDemo key={index} props={supplier} showActionBtn={true} />
            ))}
          </Carousel>
        </Stack>
      </Paper>
    );
  }
}

export default SuppliersCarousel;

const paperSX = {
  width: "80%",
  px: { xs: 2, sm: 4, md: 5 },
  py: 5,
  backgroundColor: "rgba(255,255,255, 0.6)",
  borderTopLeftRadius: 50,
  borderBottomRightRadius: 50,
  position: "relative",
  textAlign: "center",
  height: "100%",
  margin: "60px auto",
};

const carouselTextSX = {
  fontSize: { xs: 22, sm: 24, md: 35 },
  fontFamily: "Varela Round",
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  textShadow: " 0px 1px 1px #282828",
};
