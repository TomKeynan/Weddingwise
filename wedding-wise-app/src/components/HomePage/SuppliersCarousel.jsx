import React, { useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { customTheme } from "../../store/Theme";
import Slider from "react-slick";
import SupplierCard from "../SupplierCard";
import useFetch from "../../utilities/useFetch";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SuppliersCarousel() {
  const screenUnderSM = useMediaQuery("(max-width: 600px)");

  const { getData, resData, loading, error } = useFetch();

  const [suppliersList, setSuppliersList] = useState([]);

  useEffect(() => {
    getData("/Suppliers/getTopSuppliers");
  }, []);

  useEffect(() => {
    if (resData) {
      setSuppliersList(resData);
    }
  }, [resData]);

  function showArrow() {
    let display = "block";
    if (screenUnderSM) display = "none";
    return display;
  }

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    rtl: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 860,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],

    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: `${showArrow()}`,
          background: "grey",
          borderRadius: "50%",
          boxShadow: customTheme.shadow.strong,
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
         display: `${showArrow()}`,
          background: "grey",
          borderRadius: "50%",
          boxShadow: customTheme.shadow.strong,
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <Stack justifyContent="center" sx={{ textAlign: "center", my: 10 }}>
      {!error && (
        <Stack>
          <Typography sx={carouselTextSX}>
            נותני השירות המקוצעיים ביותר
          </Typography>
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Slider {...settings}>
              {suppliersList.map((supplier) => (
                <Box
                  key={supplier.supplierEmail}
                  sx={{
                    overflow: "hidden",
                    margin: "0 auto",
                    py: 5,
                    width: { xs: 250, sm: 270 },
                  }}
                >
                  <SupplierCard showMoreInfoBtn={true} props={supplier} />
                </Box>
              ))}
            </Slider>
          </Paper>
        </Stack>
      )}
    </Stack>
  );
}

export default SuppliersCarousel;

const paperSX = {
  width: {
    xs: "90%",
    lg: "80%",
  },
  px: { xs: 2, sm: 4, md: 5 },
  py: { xs: 1, sm: 5 },
  backgroundColor: "rgba(255,255,255, 0.6)",
  borderTopLeftRadius: 50,
  borderBottomRightRadius: 50,
  position: "relative",
  textAlign: "center",
  height: "100%",
  margin: "0 auto",
};

const carouselTextSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
  textShadow: " 0px 1px 1px #282828",
  mb: 3,
};
