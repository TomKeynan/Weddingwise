import React, { Fragment } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { customTheme } from "../../store/Theme";

function ConfirmDialog({ title, open, onClose, onCancel, children }) {
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={wrapperSX}
      >
        <DialogTitle id="alert-dialog-title" sx={titleSX}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ pb: { xs: 1, sm: 2 } }}>{children}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Stack
            direction="row"
            justifyContent="space-around"
            sx={{ width: "90%" }}
          >
            <Button
              onClick={onClose}
              autoFocus
              variant="contained"
              sx={confirmBtnSX}
            >
              אישור
            </Button>
            <Button
              onClick={onCancel}
              autoFocus
              variant="contained"
              sx={cancelBtnSX}
            >
              ביטול
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmDialog;

const wrapperSX = {
  "& .MuiPaper-root": {
    width: { xs: "70%", sm: "60%", md: "50%", lg: "30%" },
    maxWidth: "700px",
  },
};

const titleSX = {
  my: 1,
  textAlign: "center",
  color: customTheme.palette.primary.dark,
  fontFamily: customTheme.font.main,
  fontSize: { xs: 18, sm: 30 },
};

const cancelBtnSX = {
  mt: 1,
  mb: 2,
  width: "30%",
  bgcolor: customTheme.palette.error.main,
  "&:hover": {
    bgcolor: customTheme.palette.error.dark,
  },
};

const confirmBtnSX = {
  mt: 1,
  mb: 2,
  width: "30%",
  bgcolor: customTheme.palette.success.main,
  "&:hover": {
    bgcolor: customTheme.palette.success.dark,
  },
};
