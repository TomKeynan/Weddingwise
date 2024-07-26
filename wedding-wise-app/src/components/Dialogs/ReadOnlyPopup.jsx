import React, { Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { customTheme } from "../../store/Theme";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ReadOnlyPopup({ title, text, open, children, mode }) {
  const wrapperMode =
    mode == "error"
      ? errorWrapperSX
      : mode == "success"
      ? successWrapperSX
      : infoWrapperSX;

  const titleMode =
    mode == "error"
      ? errorTitleSX
      : mode == "success"
      ? successTitleSX
      : infoTitleSX;

  return (
    <Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={wrapperMode}
      >
        <DialogTitle id="alert-dialog-title" sx={titleMode}>
          {title}
        </DialogTitle>
        {text && (
          <Typography
            sx={{
              px: 2,
              my: 1,
              textAlign: "center",
              fontSize: { xs: 16, sm: 22 },
            }}
          >
            {text}
          </Typography>
        )}
        <DialogContent
          sx={{
            "&.MuiDialogContent-root": { pt: "10px" },
          }}
        >
          {children}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

// ================= INFO SX ==================

const infoWrapperSX = {
  "& .MuiPaper-root": {
    width: "90%",
    maxWidth: "900px",
    position: "relative",
    p: 0,
  },
};

const infoTitleSX = {
  my: 2,
  textAlign: "center",
  color: customTheme.palette.primary.dark,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 18, sm: 30 },
  pt: 10,
};

// ================= ERROR SX ==================

const errorWrapperSX = {
  "& .MuiPaper-root": {
    // p: 0.5,
  },
};

const errorTitleSX = {
  textAlign: "center",
  color: customTheme.palette.error.light,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 20, sm: 30 },
  fontWeight: "bold",
};

// ================= SUCCESS SX ==================

const successWrapperSX = {
  "& .MuiPaper-root": {
    px: { xs: 1, sm: 3 },
    py: 4,
    backgroundImage: 'url(assets/bg-stars.png)'
    // pt: 0,
    // p: 0.5,
  },
};

const successTitleSX = {
  textAlign: "center",
  color: customTheme.palette.success.main,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 20, sm: 30 },
  fontWeight: "bold",
  // mt: 4,
};
