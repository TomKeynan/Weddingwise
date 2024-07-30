import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckIcon from "@mui/icons-material/Check";
import { customTheme } from "../store/Theme";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
});

export default function InputFileUpload({ isUpload }) {
  let btnBgColor = isUpload
    ? customTheme.supplier.colors.secondary.dark
    : customTheme.palette.primary.main;
  return (
    <Button
      sx={{
        p: 1.5,
        bgcolor: btnBgColor,
        "&:hover": { bgcolor: btnBgColor },
        fontSize: { xs: 16, sm: 18 },
      }}
      component="label"
    //   role={undefined}
      variant="contained"
      tabIndex={-1}
      endIcon={isUpload ? <CheckIcon /> : <CloudUploadIcon />}
    >
      תמונת פרופיל
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        id="userImage"
        name="userImage"
      />
    </Button>
  );
}
