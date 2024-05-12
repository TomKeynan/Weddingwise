import React, { useState, useContext, useEffect } from "react";
import { RegisterContext } from "../store/RegisterContext";
import { customTheme } from "../store/Theme";
import {
  Box,
  Stack,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Dialog,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import StepOne from "./SignUp-Steps/StepOne";
import StepThree from "./SignUp-Steps/StepThree";
import StepTwo from "./SignUp-Steps/StepTwo";
import Loading from "./Loading";
import { signupResponse } from "../utilities/collections";
import DialogMessage from "./DialogMessage";

const steps = [
  {
    text: " בחרו את הרכב הזוגיות שלכם.",
    label: " הזוג שאתם",
    icon: <PeopleAltIcon />,
  },
  {
    text: "אנא מלאו את פרטי האירוע, הפרטים יהיו ניתנים לשינוי גם לאחר ההרשמה. ",
    label: "העדפות",
    icon: <ListIcon />,
  },
  {
    text: "אנא מלאו את פרטיכם האישיים",
    label: "פרטים אישיים",
    icon: <DriveFileRenameOutlineIcon />,
  },
];

export default function Registration() {
  const {
    userDetails,
    error,
    loading,
    isFormCompleted,
    isFormValid,
    handleSubmit,
  } = useContext(RegisterContext);

  const [activeStep, setActiveStep] = useState(0);

  const [open, setOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {loading && <Loading />}
      {error && (
        <DialogMessage
          title="שגיאה!"
          content={signupResponse[error]}
          btnValue="אוקיי!"
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
      <Stepper nonLinear={true} activeStep={activeStep} sx={stepStyle}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton
              color="inherit"
              disableRipple
              onClick={handleStep(index)}
              icon={step.icon}
            >
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <Typography variant="h6" sx={{ mt: 2, mb: 1, py: 1 }}>
          {steps[activeStep].text}
        </Typography>

        <Stack sx={{ minHeight: 180, mb: 5 }}>
          {activeStep === 0 ? (
            <StepOne />
          ) : activeStep === 1 ? (
            <StepTwo />
          ) : (
            <StepThree />
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            mx: "auto",
            mt: 3,
            mb: 5,
          }}
        >
          <Button
            color="black"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1, fontSize: { xs: 18, sm: 25 } }}
          >
            הקודם
          </Button>

          {/* <Button
            variant="outlined"
            onClick={handleSubmission}
            sx={submitBtnSX}
          >
            צור חשבון
          </Button> */}

          {isFormCompleted(userDetails) && isFormValid(userDetails) && (
            <Button
              variant="outlined"
              onClick={() => {
                handleClickOpen();
                handleSubmit();
              }}
              sx={submitBtnSX}
            >
              צור חשבון
            </Button>
          )}
          <Button
            color="black"
            disabled={activeStep === 2}
            onClick={handleNext}
            sx={{ mr: 1, fontSize: { xs: 18, sm: 25 } }}
          >
            שלב הבא
          </Button>
        </Stack>
      </div>
    </Box>
  );
}

// ============================ Styles ============================

const stepStyle = {
  "& .MuiStep-root": {
    // bgcolor: "red",
    "& .MuiStepLabel-root": {
      flexDirection: "column",
      gap: 1,
    },
    "& .MuiStepLabel-iconContainer": {
      bgcolor: "primary.light",
      borderRadius: "50%",
      justifyContent: "center",
      alignItems: "center",
      p: 1,
      "& .MuiSvgIcon-root": {
        fontSize: "3rem",
      },
    },
  },
  "& .Mui-active": {
    "&.MuiStepLabel-iconContainer": {
      bgcolor: "primary.main",
    },
    "& .MuiStepConnector-line": {
      borderColor: "primary.main",
      borderTopWidth: 2,
    },
  },

  "& .MuiSvgIcon-root": {
    fontSize: "3rem",
  },
  "& .MuiStepConnector-root": {
    mb: 3,
  },
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
  },
};

const submitBtnSX = {
  bgcolor: "white",
  borderRadius: 10,
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 1, sm: 3 },
  py: 0,
  fontSize: { xs: 18, sm: 25 },
  borderWidth: 3,
  position: "relative",
  left: { xs: 5, sm: 15 },
  "&.MuiButtonBase-root:hover": {
    bgcolor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};
