import React from "react";
import Slider from "react-slick";
import CommentCard from "./CommentCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@mui/material";

function Carousel() {
  //   var settings = {
  //     dots: true,
  //     infinite: false,
  //     speed: 500,
  //     slidesToShow: 4,
  //     slidesToScroll: 4,
  //     initialSlide: 0,
  //     responsive: [
  //       {
  //         breakpoint: 1024,
  //         settings: {
  //           slidesToShow: 3,
  //           slidesToScroll: 3,
  //           infinite: true,
  //           dots: true
  //         }
  //       },
  //       {
  //         breakpoint: 600,
  //         settings: {
  //           slidesToShow: 2,
  //           slidesToScroll: 2,
  //           initialSlide: 2
  //         }
  //       },
  //       {
  //         breakpoint: 480,
  //         settings: {
  //           slidesToShow: 1,
  //           slidesToScroll: 1
  //         }
  //       }
  //     ]
  //   };
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
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
          display: "block",
          background: "#9DD2B9",
          borderRadius: "50%",
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
          display: "block",
          background: "#9DD2B9",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <Slider {...settings}>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
      <div style={{ overflow: "hidden" }}>
        <CommentCard />
      </div>
    </Slider>
  );
}

export default Carousel;
