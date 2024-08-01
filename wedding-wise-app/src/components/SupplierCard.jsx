import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers } from "../utilities/collections";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import useSupplierStore from "../fireBase/supplierStore";
import Loading from './Loading';


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
  const { businessName, phoneNumber, supplierEmail, price, supplierType } = props;
  const { suppliers, loading, fetchSupplierData } = useSupplierStore();
  const supplierData = suppliers[supplierEmail];

  const navigate = useNavigate();
  const [sticker, setSticker] = useState({});
  const [supplierImage, setSupplierImage] = useState("");


  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchSupplierData(supplierEmail);
  }, [supplierEmail, fetchSupplierData]);

  useEffect(() => {

    if (supplierData) {

      const cardSticker = stickers.filter((sticker) => {
        if (sticker.stickerSrc.includes("makeup")) return sticker;
        return sticker.stickerSrc.includes(supplierType);
      });
      setSticker({ ...cardSticker[0] });
      setSupplierImage(supplierData.avatar);
    }
  }, [supplierData, supplierType]);

  const handleMoreInformation = () => {
  
    sessionStorage.setItem('currentSupplierEmail', supplierEmail);  // Save the email to sessionStorage
    navigate('/supplier-public-profile');  // Navigate to the profile page
  };


 
  if (loading) {
    return <Loading />; // Show loading spinner if data is still loading
  }

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
            <Button onClick={handleMoreInformation} variant="contained" sx={actionBtnSX}>
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
