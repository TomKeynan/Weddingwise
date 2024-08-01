import { Link, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useContext, useState } from "react";
import SupplierBanner from "../components/SupplierBanner";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import KpiPaper from "../components/KpiPaper";
import { AppContext } from "../store/AppContext";
import { customTheme } from "../store/Theme";
import Carousel from "../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CommentForm from "../components/CommentForm";
import MessageDialog from "../components/Dialogs/MessageDialog";
import { Navigate } from "react-router-dom";

function SupplierPublicProfile() {
  const screenAboveSM = useMediaQuery("(min-width: 600px)");

  const { supplierData } = useContext(AppContext);

  return !supplierData ? (
    <Navigate to="/suppliers" />
  ) : (
    <Stack alignItems="center" sx={stackWrapperSX}>
      <SupplierBanner />
      <Stack
        spacing={10}
        sx={{
          width: { xs: "90%", sm: "60%" },
          mt: { xs: 0, sm: 3 },
        }}
      >
        {/* social media links */}
        <Stack direction="row" justifyContent="space-around">
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              window.open("https://www.youtube.com/", "_blank");
            }}
          >
            <YouTubeIcon sx={socialIconsSX} />
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              window.open("https://www.youtube.com/", "_blank");
            }}
          >
            <InstagramIcon sx={socialIconsSX} />
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              window.open("https://www.youtube.com/", "_blank");
            }}
          >
            <LinkedInIcon sx={socialIconsSX} />
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => {
              window.open("https://www.youtube.com/", "_blank");
            }}
          >
            <FacebookIcon sx={socialIconsSX} />
          </Link>
        </Stack>
        {/* rating and number of raters */}
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
        {/* supplier description */}
        <Stack>
          <Typography sx={{ ...titleSX, mb: 5 }}>אודות שם ספק </Typography>
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Typography>כאן יבוא התיאור</Typography>
            <Typography>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo,
              laboriosam esse nisi eum asperiores facilis repellat cupiditate
              distinctio, repellendus mollitia perspiciatis pariatur iste
              reiciendis itaque?
            </Typography>
          </Paper>
        </Stack>
      </Stack>
      {/* carousel */}
      <Stack sx={{ minHeigh: 300, width: { xs: "70%", sm: "80%" }, my: 15 }}>
        <Typography sx={{ ...titleSX, mb: 5 }}>
          הזוגות של WeddingWise משתפים
        </Typography>
        <Carousel />
      </Stack>
      {/* comment form */}
      <Stack sx={{ maxWidth: 700, width: { xs: "90%", sm: "60%" } }}>
        <Typography sx={{ ...titleSX, mb: 5, px: 2 }}>
          השאירו תגובה מהחוויה שלכם עם שם ספק
        </Typography>
        <CommentForm />
      </Stack>
    </Stack>
  );
}

export default SupplierPublicProfile;

const stackWrapperSX = {
  minHeight: "inherit",
  backgroundImage: "url(assets/bg-stars.png)",
  pb: 10,
};

const socialIconsSX = {
  fontSize: 60,
  color: "primary.main",
  cursor: "pointer",
};

const paperSX = {
  mt: 2,
  py: 3,
  px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,1)",
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 30, md: 36 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },
  // WebkitTextStrokeColor: "black",
};
