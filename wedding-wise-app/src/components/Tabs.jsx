import * as React from "react";
import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CoupleTable from "./CoupleTable";
import CommentCard from "./CommentCard";
import { Alert, Paper, Stack, Typography } from "@mui/material";
import EditSupplier from "./EditSupplier";
import EditAvailableDates from "./EditAvailableDates";
import { AppContext } from "../store/AppContext";
import useFetch from "../utilities/useFetch";
import { customTheme } from "../store/Theme";
import { useUserStore } from "../fireBase/userStore";
import { db } from "../fireBase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { reverseGeocoding } from "../utilities/functions";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4, px: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const { currentUser } = useUserStore();
  const [comments, setComments] = useState([]);
  const { supplierData } = useContext(AppContext);
  const [supplierPackages, setSupplierPackages] = useState([]);
  const { getData, resData } = useFetch();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "supplierComments", currentUser.id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const commentsData = docSnapshot.data().comments || [];
          const commentsWithDate = commentsData.map((comment) => ({
            ...comment,
            commentDate: comment.commentTime
              ? comment.commentTime.toDate().toLocaleDateString("en-GB")
              : "",
          }));
          commentsWithDate.sort((a, b) => b.commentTime - a.commentTime);
          setComments(commentsWithDate);
        } else {
          setComments([]);
        }
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  useEffect(() => {
    getData(`/Suppliers/getSupplierEvents/email/${supplierData.supplierEmail}`);
  }, []);

  useEffect(() => {
    const handlePackages = async () => {
      if (resData) {
        const packages = resData.map((item, index) => {
          item.id = index;
          return item;
        });
        const updatedPackages = await addAddresses(packages);
        setSupplierPackages(updatedPackages);
      }
    };
    handlePackages();
  }, [resData]);

  // Assuming result is the data array you received
  const addAddresses = async (data) => {
    // Map over the result and fetch addresses
    const updatedData = await Promise.all(
      data.map(async (item) => {
        const address = await reverseGeocoding(item.latitude, item.longitude);
        return {
          ...item,
          address,
        };
      })
    );
    // Set the suppliersEvents state with the updated data
    return updatedData;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="המידע שלי" {...a11yProps(0)} sx={tabSX} />
          <Tab label="תגובות" {...a11yProps(1)} sx={tabSX} />
          <Tab label="עריכת פרטים" {...a11yProps(2)} sx={tabSX} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <EditAvailableDates />
        <Typography
          sx={{
            textAlign: "left",
            fontFamily: customTheme.font.main,
            color: customTheme.palette.primary.main,
            fontSize: { xs: 18, sm: 24, md: 30 },
            fontWeight: "bold",
          }}
        >
          החבילות שלי!
        </Typography>
        {supplierPackages.length > 0 ? (
          <CoupleTable supplierPackages={supplierPackages} />
        ) : (
          <Paper variant="elevation" elevation={6} sx={paperSX}>
            <Alert severity="warning">
              אתם עדיין לא מופיעים באף חבילה שהומלצה לזוגות{" "}
            </Alert>
          </Paper>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            rowGap: 4,
            p: 2,
            width: "70%",
            margin: "0 auto",
          }}
        >
          {comments.map((comment, index) => (
            <CommentCard
              key={index}
              coupleAvatar={comment.coupleAvatar}
              coupleNames={comment.coupleNames}
              text={comment.text}
              commentDate={comment.commentDate}
              rating = {comment.rating}
            />
          ))}
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EditSupplier />
      </CustomTabPanel>
    </Box>
  );
}

const tabSX = {
  px: 0,
  "&.MuiButtonBase-root": {
    fontSize: { xs: 12, sm: 14, md: 16 },
  },
};

const paperSX = {
  mt: 2,
  py: 3,
  px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,0.8)",
};
