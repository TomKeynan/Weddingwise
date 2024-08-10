import React, { Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { customTheme } from "../../store/Theme";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MessageDialog({
  title,
  text,
  btnValue,
  open,
  onClose,
  children,
  xBtn,
  mode,
  disabledBtn = false,
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={wrapperMode}
      >
        <Box sx={CloseBtnSX} onClick={xBtn}>
          <CloseIcon />
        </Box>
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
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onClose}
            disabled={disabledBtn}
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

const CloseBtnSX = {
  cursor: "pointer",
  position: "absolute",
  pr: 1,
  pt: 1,
  right: 0,
};

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
  my: 1,
  textAlign: "center",
  color: customTheme.palette.primary.dark,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 18, sm: 30 },
  // pt: 10,
};

const infoBtnSX = { mt: 1, mb: 2, width: "80%" };

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
    // px: { xs: 1, sm: 3 },
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
  mt: 4,
  pb: 0,
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
