import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CoupleTable from "./CoupleTable";
import CommentCard from "./CommentCard";
import { Stack } from "@mui/material";
import EditSupplier from "./EditSupplier";
import EditAvailableDates from "./EditAvailableDates";
import { useUserStore } from "../fireBase/userStore";
import { db } from "../fireBase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';


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




    
  useEffect(() => {
    if (!currentUser?.id) return;
debugger;
    const unSub = onSnapshot(doc(db, "supplierComments", currentUser.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const commentsData = docSnapshot.data().comments || [];
        const commentsWithDate = commentsData.map(comment => ({
          ...comment,
          commentDate: comment.commentTime ? comment.commentTime.toDate().toLocaleDateString('en-GB') : "",
        }));
        commentsWithDate.sort((a, b) => b.commentTime - a.commentTime);
        console.log(commentsWithDate);
        setComments(commentsWithDate);
      } else {
        setComments([]);
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    (
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
          <CoupleTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Stack sx={{ maxHeight: 500, overflowY: "scroll", rowGap: 4, p: 2 }}>
          {comments.map((comment, index) => (
       <CommentCard
          key={index}
          coupleAvatar = {comment.coupleAvatar}
          coupleNames={comment.coupleNames}
          text={comment.text}
          commentDate={comment.commentDate}
        />
      ))}
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <EditSupplier />
        </CustomTabPanel>
      </Box>
    ));
}

const tabSX = {
  px: 0,
  "&.MuiButtonBase-root": {
    fontSize: { xs: 12, sm: 14 },
  },
};
