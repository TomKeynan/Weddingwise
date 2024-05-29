import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers, suppliersImage } from "../utilities/collections";
import { getRandomSupplierImage } from "../utilities/functions";

function SupplierCard({
  props,
  showReplaceSupplierBtn = false,
  showMoreInfoBtn = false,
  cardBg = "white",
  onReplacement,
}) {
  const {
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

    setSupplierImage(getRandomSupplierImage(suppliersImage, supplierType));
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        bgcolor: cardBg,

        pb: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      {/* care-image */}
      <Box
        sx={{
          width: "100%",
          height: "250px",
          margin: "0 auto",
        }}
      >
        <img
          src={supplierImage}
          alt={imageAlt}
          className="supplier-card-image"
        />
      </Box>

      {/* card-content */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          textAlign: "center",
          mt: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1 }}
        >
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {businessName}
          </Typography>
          <img
            src={sticker.stickerSrc}
            alt={sticker.stickerAlt}
            className="supplier-card-sticker"
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1 }}
        >
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {phoneNumber}
          </Typography>
          <PhoneIcon sx={{ fontSize: 20 }} />
        </Stack>
        <Stack
          direction="row"
          // justifyContent="start"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1 }}
        >
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {supplierEmail}
          </Typography>
          <AlternateEmailIcon sx={{ fontSize: 20 }} />
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
        <Stack
          direction="row"
          justifyContent="space-around"
          sx={{ height: "100%" }}
        >
          {showReplaceSupplierBtn && (
            <Button
              variant="outlined"
              sx={actionBtnSX}
              onClick={() => onReplacement(supplierType)}
            >
              החלף ספק
            </Button>
          )}
          {showMoreInfoBtn && (
            <Button variant="contained" sx={actionBtnSX}>
              מידע נוסף
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
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
