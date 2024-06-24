import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { customTheme } from "../../store/Theme";

export default function MessageDialog ({
  title,
  btnValue,
  open,
  onClose,
  children,
  mode,
}) {
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

  const btnMode =
    mode == "error" ? errorBtnSX : mode == "success" ? successBtnSX : infoBtnSX;
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={wrapperMode}
        // sx={isInfo ? infoWrapperSX : msgWrapperSX}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={titleMode}
        >
          {title}
        </DialogTitle>
        <DialogContent sx={{ pb: { xs: 1, sm: 2 } }}>{children}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onClose}
            autoFocus
            variant="contained"
            sx={btnMode}
          >
            {btnValue}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

// ================= INFO SX ==================

const infoWrapperSX = {
  "& .MuiPaper-root": {
    width: "90%",
    maxWidth: "900px",
  },
};

const infoTitleSX = {
  my: 1,
  textAlign: "center",
  color: customTheme.palette.primary.dark,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 18, sm: 30 },
};

const infoBtnSX = { mt: 1, mb: 2, width: "80%" };

// ================= ERROR SX ==================

const errorWrapperSX = {
  "& .MuiPaper-root": {
    p: { xs: 1, sm: 3 },
  },
};

const errorTitleSX = {
  textAlign: "center",
  color: customTheme.palette.error.light,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 20, sm: 30 },
  fontWeight: "bold",
};

const errorBtnSX = {
  mt: 1,
  mb: 2,
  width: "80%",
  bgcolor: customTheme.palette.error.light,
  "&:hover": {
    bgcolor: customTheme.palette.error.dark,
  },
};

// ================= SUCCESS SX ==================

const successWrapperSX = {
  "& .MuiPaper-root": {
    p: { xs: 1, sm: 3 },
  },
};

const successTitleSX = {
  textAlign: "center",
  color: customTheme.palette.success.main,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 20, sm: 30 },
  fontWeight: "bold",
};

const successBtnSX = {
  mt: 1,
  mb: 2,
  width: "80%",
  bgcolor: customTheme.palette.success.main,
  "&:hover": {
    bgcolor: customTheme.palette.success.dark,
  },
};
