import { Button } from "@mui/material";
import React from "react";
import { customTheme } from "../../store/Theme";

function SupplierContainBtn({ onClick, value, width, fontSize }) {
    const buttonSX = {
      width: width,
      fontSize: fontSize,
      color: "white",
      borderColor: customTheme.supplier.colors.primary.main,
      bgcolor: customTheme.supplier.colors.primary.main,
      boxShadow: customTheme.shadow.main,
      "&:hover": {
        bgcolor: customTheme.supplier.colors.primary.dark,
        borderColor: customTheme.supplier.colors.primary.main,
        // color: customTheme.supplier.colors.primary.main,
      },
    };
  
    return (
    <Button variant="outlined" onClick={onClick} sx={buttonSX}>
      {value}
    </Button>
  );
}
export default SupplierContainBtn;

