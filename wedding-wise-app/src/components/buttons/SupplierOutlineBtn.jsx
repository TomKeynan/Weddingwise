import { Button } from "@mui/material";
import React from "react";
import { customTheme } from "../../store/Theme";

function SupplierOutlineBtn({ onClick, type, value, width, fontSize }) {
  const buttonSX = {
    width: width,
    fontSize: fontSize,
    color: customTheme.supplier.colors.primary.main,
      borderColor: customTheme.supplier.colors.primary.main,
      boxShadow: customTheme.shadow.main,
    "&:hover": {
      bgcolor: "rgb(254, 238, 253, 0.2)",
      borderColor: customTheme.supplier.colors.primary.dark,
      color: customTheme.supplier.colors.primary.dark,
    },
  };

  return (
    <Button variant="outlined" type={type}  onClick={onClick} sx={buttonSX}>
      {value}
    </Button>
  );
}
export default SupplierOutlineBtn;
