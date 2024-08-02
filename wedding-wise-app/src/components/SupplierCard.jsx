import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { customTheme } from "../store/Theme";
import { stickers, suppliersImage } from "../utilities/collections";
import { addCommasToNumber, getRandomSupplierImage } from "../utilities/functions";
import CheckIcon from "@mui/icons-material/Check";
import { db } from "../fireBase/firebase";
import { getDocs, query, where, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SupplierCard({
  props, // card data
  showReplaceSupplierBtn, // determine if to show replacement btn or not
  showMoreInfoBtn, // determine if to show more info btn or not
  cardBg = "white",
  onReplacement, // pass a function to onClick event's of replacement btn
  onCheckBtnClick, // related to approval of supplier replacement
  isAlternative, // detect if this card associated with alternative supplier or not
  isPackage, //detect if this card placed at package page or not
}) {
  const { businessName, phoneNumber, supplierEmail, price, supplierType } =
    props;

  const navigate = useNavigate();
  const [sticker, setSticker] = useState({});

  const [supplierImage, setSupplierImage] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Reference to the 'users' collection
        const userRef = collection(db, "users");

        // Query to find a user by email
        const q = query(userRef, where("email", "==", supplierEmail));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // If a user is found, set the user state
        if (!querySnapshot.empty) {
          setUser(querySnapshot.docs[0].data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchImage();
  }, [supplierEmail]);

  useEffect(() => {
    if (user) {
      const cardSticker = stickers.filter((sticker) => {
        if (sticker.stickerSrc.includes("makeup")) return sticker;
        return sticker.stickerSrc.includes(supplierType);
      });
      setSticker({ ...cardSticker[0] });
      setSupplierImage(user.avatar);
    }
  }, [user, supplierType, stickers, setSticker, setSupplierImage]);

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
            <Button
              variant="contained"
              sx={actionBtnSX}
              onClick={() => navigate("/supplier-public-Profile")}
            >
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
