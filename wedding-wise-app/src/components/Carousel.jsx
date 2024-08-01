import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import CommentCard from "./CommentCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@mui/material";
import { customTheme } from "../store/Theme";
import { db } from "../fireBase/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useUserStore } from "../fireBase/userStore";

function Carousel({ supplierFirebase }) {
  const { currentUser } = useUserStore();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!supplierFirebase) {
      return;
    }
  
    const unSub = onSnapshot(
      doc(db, "supplierComments", supplierFirebase.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const commentsData = docSnapshot.data().comments || [];
          
          // Ensure commentsData is not undefined or null
          if (Array.isArray(commentsData)) {
            // Map and sort comments
            const commentsWithDate = commentsData.map((comment) => ({
              ...comment,
              commentDate: comment.commentTime
                ? comment.commentTime.toDate().toLocaleDateString("en-GB")
                : "",
            }));
            commentsWithDate.sort((a, b) => (b.commentTime || 0) - (a.commentTime || 0));
            setComments(commentsWithDate);
          } else {
            // Handle case where commentsData is not an array (though unlikely in this case)
            setComments([]);
          }
        } else {
          setComments([]); // Handle case where document exists but has no comments
        }
      },
      (error) => {
        console.error("Error fetching comments: ", error);
        setComments([]); // Handle error case
      }
    );
  
    // Cleanup the listener on component unmount
    return () => {
      unSub();
    };
  }, [supplierFirebase]);
  
  
  const settings = {
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
      {comments.map((comment, index) => (
        <div style={{ overflow: "hidden" }} key={index}>
          <CommentCard
            coupleAvatar={comment.coupleAvatar}
            coupleNames={comment.coupleNames}
            text={comment.text}
            commentDate={comment.commentDate}
            rating={comment.rating}
          />
        </div>
      ))}
    </Slider>
  );
}

export default Carousel;
