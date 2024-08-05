import React, { useEffect, useState, useContext } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers, suppliersImage } from "../utilities/collections";
import { addCommasToNumber, getRandomSupplierImage } from "../utilities/functions";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import Loading from './Loading';
import { db } from "../fireBase/firebase";
import { getDocs, query, where, collection } from "firebase/firestore";
import { AppContext } from "../store/AppContext";

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
  const navigate = useNavigate();
  const [sticker, setSticker] = useState({});
  const [avatar, setAvatar] = useState(null);
  const { setSupplierData } = useContext(AppContext);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchSupplierDataAsync = async () => {
      setSupplierData(props);
      if (avatar) {
        const cardSticker = stickers.find((sticker) =>
          sticker.stickerSrc.includes(supplierType) || sticker.stickerSrc.includes("makeup")
        );
        setSticker(cardSticker || {});
      }

      try {
        setLoadingData(true);

        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", supplierEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return;

        const supplier = querySnapshot.docs[0].data();
        setAvatar(supplier.avatar);
      } catch (error) {
        console.error("Error fetching supplier data: ", error);
      }
      finally{
        setLoadingData(false);
      }
    };

    fetchSupplierDataAsync();
  }, [supplierEmail, supplierType, avatar, props]);


  const handleMoreInformation = () => {
    setSupplierData(props);
    navigate('/supplier-public-profile');
  };


  // if (!avatar) {
  //   return <Loading />;
  // }

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
          src={avatar}
          alt={businessName}
          className={isPackage ? "supplier-card-image-package" : "supplier-card-image"}
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
          {sticker.stickerSrc && (
            <img
              src={sticker.stickerSrc}
              alt={sticker.stickerAlt}
              className="supplier-card-sticker"
            />
          )}
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
            ₪מחיר: {addCommasToNumber(price)}
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
            <Button onClick={  handleMoreInformation} variant="contained" sx={actionBtnSX}>
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
