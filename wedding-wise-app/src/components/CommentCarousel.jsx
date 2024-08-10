import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import CommentCard from "./CommentCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { customTheme } from "../store/Theme";
import { Box } from "@mui/material";

function CommentCarousel({ supplierComments }) {
  const [sortedComments, setSortedComments] = useState([]);

  useEffect(() => {
    if (supplierComments && supplierComments?.length) {
      const sorted = [...supplierComments].sort(
        (a, b) => a.commentTime - b.commentTime
      );
      setSortedComments(sorted);
    }
  }, [supplierComments]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
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
          display: "block",
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
          display: "block",
          background: "grey",
          borderRadius: "50%",
          boxShadow: customTheme.shadow.strong,
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <Slider {...settings}>
      {sortedComments.map((comment, index) => (
        <Box
          key={index}
          sx={{
            overflow: "hidden",
            margin: "0 auto",
            py: 5,
          }}
        >
          <CommentCard
            giverAvatar={comment.giverAvatar}
            giverName={comment.giverName}
            text={comment.text}
            commentDate={comment.commentDate}
            rating={comment.rating}
          />
        </Box>
        // <div style={{ overflow: "hidden" }} key={index}>
        // </div>
      ))}
    </Slider>
  );
}

export default CommentCarousel;
