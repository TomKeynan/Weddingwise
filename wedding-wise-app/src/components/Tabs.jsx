import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CoupleTable from "./CoupleTable";
import CommentCard from "./CommentCard";
import { Stack } from "@mui/material";
import EditSupplier from "./EditSupplier";

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
      {value === index && (
        <Box sx={{ py: 4, px: 0, }}>
          {children}
        </Box>
      )}
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="החבילות שלי" {...a11yProps(0)} />
          <Tab label="תגובות" {...a11yProps(1)} />
          <Tab label="עריכת פרטים" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CoupleTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack sx={{ maxHeight: 500, overflowY: "scroll", rowGap: 4, p: 2 }}>
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EditSupplier />
      </CustomTabPanel>
    </Box>
  );
}
