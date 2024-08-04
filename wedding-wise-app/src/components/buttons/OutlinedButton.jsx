import { Box, Button } from "@mui/material";
import React from "react";
import { customTheme } from "../../store/Theme";

function OutlinedButton({ btnValue, handleClick, type = "button" }) {
  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={BtnSX}
        type={type}
        disableRipple
        value={btnValue}
      >
        {btnValue}
      </Button>
    </Box>
  );
}

export default OutlinedButton;

const BtnSX = {
  bgcolor: "white",
  borderRadius: 10,
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 1, sm: 2 },
  py: 0,
  fontSize: { xs: 18, sm: 22 },
  borderWidth: 3,
  "&.MuiButtonBase-root:hover": {
    bgcolor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};
