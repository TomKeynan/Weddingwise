import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers, suppliersImage } from "../utilities/collections";
import { getRandomSupplierImage } from "../utilities/functions";
import CheckIcon from "@mui/icons-material/Check";
function SupplierCard({
  props,
  showReplaceSupplierBtn,
  showMoreInfoBtn,
  cardBg = "white",
  onReplacement,
  onCheckBtnClick,
  isAlternative,
  isPackage,
}) {
  const { businessName, phoneNumber, supplierEmail, price, supplierType } =
    props;

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
        boxShadow: customTheme.shadow.main,
        borderRadius: 4,
      }}
    >
      {/* care-image */}
      <Box
        sx={{
          minWidth: "100%",
          height: "250px",
          margin: "0 auto",
        }}
      >
        <img
          src={supplierImage}
          alt={businessName}
          className={
            isPackage ? "supplier-card-image-package" : "supplier-card-image"
          }
        />
      </Box>

      {/* card-content */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          textAlign: "center",
          py: 2,
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
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1 }}
        >
          <Typography
            variant="body2"
            sx={{ textAlign: "left", wordBreak: "break-all", width: "185px" }}
          >
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
          {showReplaceSupplierBtn &&
            (isAlternative ? (
              <Button
                variant="outlined"
                sx={actionBtnSX}
                onClick={() => onCheckBtnClick(supplierEmail)}
              >
                <CheckIcon />
              </Button>
            ) : (
              <Button
                variant="outlined"
                disableRipple
                sx={actionBtnSX}
                onClick={() => onReplacement(supplierType, supplierEmail)}
              >
                החלף ספק
              </Button>
            ))}
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
