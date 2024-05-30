import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DialogMessage({
  title,
  btnValue,
  open,
  onClose,
  children
}) {
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ "& .MuiPaper-root": { px: 2, py: 3, width: "100%" } }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
          {title}
        </DialogTitle>
        <DialogContent>
            {children}
          {/* <DialogContentText id="alert-dialog-description">
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus variant="contained">
            {btnValue}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
