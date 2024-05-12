import React from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { customTheme } from "../store/Theme";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export default function AccordionLayout({ title, btnValue, children }) {
  const navigate = useNavigate();

  function handleClick(e) {
    navigate(`${e.target.value}`);
  }
  return (
    <Box sx={{ mb: 5 }}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={accordionSummarySX}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
        <AccordionActions>
          <Button sx={{ fontSize: 20 }} value={btnValue} onClick={handleClick}>
            מידע נוסף...
          </Button>
          {/* <Button>Agree</Button> */}
        </AccordionActions>
      </Accordion>
    </Box>
  );
}

const accordionSummarySX = {
  width: "100%",
  "& .MuiAccordionSummary-content": {
    color: customTheme.palette.primary.main,
    textAlign: "center",
    display: "inline-block",
    fontSize: 20,
  },
  "& .MuiAccordionSummary-content:hover": {
    color: customTheme.palette.primary.dark,
    textDecoration: "underline",
  },
};
