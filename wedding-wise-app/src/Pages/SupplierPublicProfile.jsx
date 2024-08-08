import {
  Alert,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import SupplierBanner from "../components/SupplierBanner";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import KpiPaper from "../components/KpiPaper";
import { customTheme } from "../store/Theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CommentForm from "../components/CommentForm";
import { Navigate } from "react-router-dom";
import CommentCarousel from "../components/CommentCarousel";
import Loading from "../components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { AppContext } from "../store/AppContext";
import { fetchSupplierData } from "../fireBase/fetchSupplier";
import { db } from "../fireBase/firebase";
import { doc, onSnapshot, getDocs, query, where, collection } from "firebase/firestore";
import { useSupplierData } from "../fireBase/supplierData";

function SupplierPublicProfile() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const screenAboveSM = useMediaQuery("(min-width: 600px)");
  const [supplierFirebase, setSupplierFirebase] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const { relevantSupplier, setRelevantSupplier } = useSupplierData();


  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        setLoadingData(true);

        // Fetch supplier ID based on email
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", relevantSupplier?.supplierEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No supplier found with this email.');
          setLoadingData(false);
          return;
        }

        const supplierId = querySnapshot.docs[0].id;
        const userDocRef = doc(db, "users", supplierId);

        // Set up a Firestore onSnapshot listener for the user document
        const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            try {
              const data = await fetchSupplierData(relevantSupplier.supplierEmail);
              setSupplierFirebase(data);
            } catch (error) {
              console.error("Error fetching supplier data:", error);
            }
          }
          setLoadingData(false);
        });

        // Clean up the listener on component unmount
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoadingData(false);
      }
    };

    if (relevantSupplier?.supplierEmail) {
      fetchAndSetData();
    }
  }, [relevantSupplier]);

  console.log(supplierFirebase);

  if (loading || loadingData) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }



  return (
    <Stack alignItems="center" sx={stackWrapperSX}>
      <SupplierBanner supplierFirebase={supplierFirebase} />
      <Stack
        spacing={10}
        sx={{
          width: { xs: "90%", sm: "60%" },
          mt: { xs: 0, sm: 3 },
        }}
      >
        {/* social media links */}
        <Stack direction="row" justifyContent="space-around">
          {supplierFirebase?.socialLinks?.YouTube && (
            <Link
              component="button"
              variant="body1"
              onClick={() => {
                const youtubeLink = supplierFirebase.socialLinks.YouTube.startsWith('http')
                  ? supplierFirebase.socialLinks.YouTube
                  : `https://${supplierFirebase.socialLinks.YouTube}`;

                window.open(youtubeLink, "_blank");
              }}
            >
              <YouTubeIcon sx={socialIconsSX} />
            </Link>
          )}
          {supplierFirebase?.socialLinks?.Instagram && (
            <Link
              component="button"
              variant="body1"
              onClick={() => {
                const instagramLink = supplierFirebase.socialLinks.Instagram.startsWith('http')
                  ? supplierFirebase.socialLinks.Instagram
                  : `https://${supplierFirebase.socialLinks.Instagram}`;

                window.open(instagramLink, "_blank");
              }}
            >
              <InstagramIcon sx={socialIconsSX} />
            </Link>
          )}

          {supplierFirebase?.socialLinks?.LinkedIn && (
            <Link
              component="button"
              variant="body1"
              onClick={() => {
                const linkedInLink = supplierFirebase.socialLinks.LinkedIn.startsWith('http')
                  ? supplierFirebase.socialLinks.LinkedIn
                  : `https://${supplierFirebase.socialLinks.LinkedIn}`;

                window.open(linkedInLink, "_blank");
              }}
            >
              <LinkedInIcon sx={socialIconsSX} />
            </Link>
          )}

          {supplierFirebase?.socialLinks?.Facebook && (
            <Link
              component="button"
              variant="body1"
              onClick={() => {
                const facebookLink = supplierFirebase.socialLinks.Facebook.startsWith('http')
                  ? supplierFirebase.socialLinks.Facebook
                  : `https://${supplierFirebase.socialLinks.Facebook}`;

                window.open(facebookLink, "_blank");
              }}
            >
              <FacebookIcon sx={socialIconsSX} />
            </Link>
          )}
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
            data={relevantSupplier.ratedCount}
            icon={<PeopleOutlineIcon />}
          />
          <KpiPaper
            title="דירוג:"
            data={relevantSupplier.rating}
            icon={<StarOutlineIcon />}
          />
        </Stack>
        {/* supplier description */}
        <Stack>
          <Typography sx={{ ...titleSX, mb: 5 }}>
            אודות {relevantSupplier?.businessName}{" "}
          </Typography>
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Typography sx={{ textAlign: "center" }}>
              {supplierFirebase?.description}
            </Typography>
          </Paper>
        </Stack>
      </Stack>
      {/* carousel */}
      {supplierFirebase && supplierFirebase["comments"]?.length > 0 ? (
        <Stack sx={{ minHeigh: 300, width: { xs: "70%", sm: "80%" }, my: 15 }}>
          <Typography sx={{ ...titleSX, mb: 5 }}>
            הזוגות של <span style={{ color: "#eb77e2" }}>W</span>edding
            <span>W</span>ise משתפים
          </Typography>
          <CommentCarousel supplierComments={supplierFirebase?.comments} />
        </Stack>
      ) : (
        <Stack sx={{ width: { xs: "90%", sm: "60%" }, my: 10 }}>
          <Typography sx={{ ...titleSX, mb: 5 }}>
            הזוגות של <span style={{ color: "#eb77e2" }}>W</span>edding
            <span style={{ color: "#eb77e2" }}>W</span>ise משתפים
          </Typography>
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Alert severity="warning" sx={alertSX}>
              תהיו הראשנים לשתף את דעתכם על השירות שקיבלתם מ"
              {relevantSupplier?.businessName}"
            </Alert>
          </Paper>
        </Stack>
      )}
      {/* comment form */}
      <Stack sx={{ maxWidth: 700, width: { xs: "90%", sm: "60%" } }}>
        <Typography sx={{ ...titleSX, mb: 5, px: 2 }}>
          השאירו תגובה מהחוויה שלכם עם {relevantSupplier.businessName}
        </Typography>
        <CommentForm supplierFirebase={supplierFirebase} />
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

const alertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
  textAlign: "center",
};
