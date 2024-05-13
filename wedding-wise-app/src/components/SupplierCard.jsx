import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers, suppliersImage } from "../utilities/collections";
import { getRandomSupplierImage } from "../utilities/functions";

function SupplierCard({ props, showActionBtn = false }) {
  const {
    imageSrc,
    imageAlt,
    businessName,
    phoneNumber,
    supplierEmail,
    price,
    supplierType,
  } = props;

  const [sticker, setSticker] = useState({});

  const [supplierImage, setSupplierImage] = useState("");

  useEffect(() => {
    const cardSticker = stickers.filter((sticker) => {
      if (sticker.stickerSrc.includes("makeup")) return sticker;
      else return sticker.stickerSrc.includes(supplierType);
    });
    setSticker({ ...cardSticker[0] });

    setSupplierImage(getRandomSupplierImage(suppliersImage, supplierType))
  }, []);
  
  return (
    <Grid item xs={12} sm={6} md={4} lg={2} sx={cardContainerSX}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: "90%", margin: "0 auto" }}
      >
        <Box>
          <img src={supplierImage} alt={imageAlt} className="supplier-card-image" />
        </Box>
        <Stack
          spacing={1}
          sx={{
            width: { xs: "50%", sm: "60%", md: "85%", lg: "50%" },
            textAlign: "center",
            px: 4,
          }}
        >
          <Stack
            direction="row"
            // justifyContent="start"
            justifyContent="space-between"
            alignItems="center"
          >
            <img
              src={sticker.stickerSrc}
              alt={sticker.stickerAlt}
              className="supplier-card-sticker"
            />
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {businessName}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            // justifyContent="start"
            alignItems="center"
          >
            <PhoneIcon sx={{ fontSize: 25 }} />
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {phoneNumber}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            // justifyContent="start"
            alignItems="center"
            justifyContent="space-between"
          >
            <AlternateEmailIcon sx={{ fontSize: 25 }} />
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {supplierEmail}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography
              sx={{
                textAlign: "center",
                my: 1,
                fontSize: 22,
                color: customTheme.palette.primary.dark,
              }}
              variant="body1"
            >
              מחיר: {price} $
            </Typography>
          </Stack>
          {showActionBtn && (
            <Stack
              direction="row"
              justifyContent="space-around"
              sx={{ height: "100%" }}
            >
              <Button variant="outlined" sx={actionBtnSX}>
                החלף ספק
              </Button>
              <Button variant="contained" sx={actionBtnSX}>
                מידע נוסף
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Grid>
  );
}

export default SupplierCard;

const actionBtnSX = {
  p: 1,
};

const cardContainerSX = {
  px: { xs: 2, sm: 0 },
  mb: 2,
  // bgcolor: customTheme.palette.primary.light,
  // py: 2,
  // border: 1,
};
