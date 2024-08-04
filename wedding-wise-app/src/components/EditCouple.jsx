import React, { useContext, useEffect, useRef, useState } from "react";
import { RegisterContext } from "../store/RegisterContext";
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TextInput from "./TextInput";
import { customTheme } from "../store/Theme";
import { regions, updateCoupleDetailsResponse } from "../utilities/collections";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getFullDate } from "../utilities/functions";
import { AppContext } from "../store/AppContext";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import useFetch from "../utilities/useFetch";
import Loading from "./Loading";
import MessageDialog from "./Dialogs/MessageDialog";
import { useNavigate } from "react-router-dom";
import { QuestionsContext } from "../store/QuestionsContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputFileUpload from "./InputFileUpload";

function EditCouple() {
  const navigate = useNavigate();

  const {
    editValue,
    updateEditValue,
    saveDateValue,
    isFormCompleted,
    isEditFormValid,
  } = useContext(RegisterContext);

  const { coupleData, updateCoupleData } = useContext(AppContext);

  const { handleCreateNewPackage } = useContext(QuestionsContext);

  const { resData, loading, error, sendData, setResData, setError } =
    useFetch();

  const [isUpdateDetailsValid, setIsUpdateDetailsValid] = useState(false);

  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

  const [openQuestionsConfirm, setOpenQuestionsConfirm] = useState(false);

  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    let counter = 0;
    const { typeWeights, package: couplePackage, ...rest } = coupleData;
    for (const key in rest) {
      if (rest[key] != editValue[key]) counter++;
    }
    if (
      isFormCompleted(editValue) &&
      isEditFormValid(editValue) &&
      counter > 0
    ) {
      setIsUpdateDetailsValid(true);
    } else {
      setIsUpdateDetailsValid(false);
    }
  }, [editValue, openSuccessMessage]);

  useEffect(() => {
    if (resData) {
      setOpenSuccessMessage(true);
      updateCoupleData(editValue);
    } else if (error) {
      setOpenErrorMessage(true);
    }
  }, [resData, error]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  function handleWeddingDateChange(dateInput) {
    let weddingDateObject = getFullDate(dateInput);
    updateEditValue({
      desiredDate: `${weddingDateObject.desiredDate}T00:00:00`,
    });
    saveDateValue(dateInput);
  }

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // ======================= CONFIRM UPDATE =======================

  function startUpdateCoupleDetails() {
    setOpenUpdateConfirm(true);
  }

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function handleUpdateApproval() {
    sendData("/Couples/updateCouple", "PUT", editValue);
    setResData(undefined);
    setOpenUpdateConfirm(false);
  }

  function showUpdateConfirmDialog() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
        onApproval={handleUpdateApproval}
        // disabledBtn={isUpdateDetailsValid}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          לחיצה על אישור תוביל לשינוי פרטי החתונה הקיימים באלו שעכשיו בחרתם.
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          האם אתה בטוחים שאתם רוצים לבצע שינוי זה?
        </Typography>
      </ConfirmDialog>
    );
  }

  function handleQuestionsApproval() {
    navigate("/questionnaire");
    setOpenQuestionsConfirm(false);
  }

  function handleQuestionsCancel() {
    handleCreateNewPackage();
    setOpenQuestionsConfirm(false);
  }

  function showQuestionsConfirm() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openQuestionsConfirm}
        onCancel={handleQuestionsCancel}
        onApproval={handleQuestionsApproval}
        approvalBtn="נמלא שאלון"
        cancelBtn="נבחרת חדשה"
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
          שנייה לפני שנמליץ לכם על נבחרת ספקים חדשה , באפשרותכם למלא את השאלון
          מחדש
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
          ------
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          לתשובות שלכם יש משקל חשוב בהרכבת החבילה המתאימה ביותר עבורכם
        </Typography>
      </ConfirmDialog>
    );
  }

  // ======================= Message Dialog =======================

  function handleCloseMessage() {
    setOpenErrorMessage(false);
    setError(undefined);
  }

  function handleCloseSuccessMsg() {
    setOpenSuccessMessage(false);
    setOpenQuestionsConfirm(true);
  }

  function showErrorMessage(status) {
    return (
      <MessageDialog
        title="שגיאה"
        open={openErrorMessage}
        btnValue="הבנתי!"
        onClose={handleCloseMessage}
        xBtn={handleCloseMessage}
        mode="error"
      >
        {
          <Stack
            direction="row"
            justifyContent="center"
            alignContent="space-around"
            flexWrap="wrap"
            rowGap={3}
            columnGap={2}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
            >
              {updateCoupleDetailsResponse[status]}
            </Typography>
          </Stack>
        }
      </MessageDialog>
    );
  }

  function showSuccessMessage(resData) {
    return (
      <MessageDialog
        title="אלופים! פרטי החתונה עודכנו בהצלחה."
        open={openSuccessMessage}
        btnValue="הבנתי!"
        onClose={handleCloseSuccessMsg}
        xBtn={handleCloseMessage}
        mode="success"
      >
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
        >
          {updateCoupleDetailsResponse[resData]}
        </Typography>
      </MessageDialog>
    );
  }

  return (
    <Paper variant="elevation" elevation={6} sx={paperSX}>
      <Grid
        container
        // sx={{ maxWidth: { xs: "80%", sm: "60%" }, margin: "0 auto" }}
        spacing={2}
      >
        {openUpdateConfirm && showUpdateConfirmDialog()}
        {loading && <Loading />}
        {error && showErrorMessage(error)}
        {openSuccessMessage && showSuccessMessage(resData)}
        {openQuestionsConfirm && showQuestionsConfirm()}
        <Grid item xs={12} md={6}>
          <TextInput
            variant="standard"
            type="text"
            value={editValue.numberOfInvitees}
            name="numberOfInvitees"
            label="כמות מוזמנים"
            textFieldSX={textFieldSX}
            editMode={true}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextInput
            variant="standard"
            type="text"
            value={Number(editValue.budget)}
            name="budget"
            label="תקציב"
            textFieldSX={textFieldSX}
            editMode={true}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={regions}
            freeSolo={false}
            value={editValue.desiredRegion}
            onChange={(event, newValue) => {
              updateEditValue({ desiredRegion: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                name="desiredRegion"
                label="איזור"
                sx={textFieldSX}
                helperText="בחרו את האיזור בו תערך החתונה"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DatePicker
              label="תאריך"
              showDaysOutsideCurrentMonth
              value={dayjs(editValue.desiredDate)}
              onChange={(newValue) => handleWeddingDateChange(newValue)}
              required
              disablePast={true}
              slotProps={{
                textField: {
                  name: "desiredDate",
                  variant: "standard",
                  helperText: "בחרו את התאריך בו תתקיים החתונה",
                  sx: textFieldSX,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl color="primary" sx={textFieldSX}>
            <TextInput
              variant="standard"
              name="password"
              label="סיסמא"
              type={showPassword ? "text" : "password"}
              editMode={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fill: customTheme.palette.primary.main,
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl
            name="userImage"
            sx={textFieldSX}
            onChange={handleAvatar}
          >
            <InputFileUpload isUpload={avatar.file} />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ margin: "0 auto" }}>
          <Button
            variant="outlined"
            type="button"
            sx={submitBtnSX}
            // ref={formRef}
            onClick={startUpdateCoupleDetails}
            disabled={!isUpdateDetailsValid}
          >
            עדכן פרטים
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default EditCouple;

// ============================== styles ==============================

const textFieldSX = {
  p: 0,
  width: "100%",
  "& .MuiFormLabel-root": {
    fontSize: 18,
    color: customTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root": {
    fontSize: 15,
  },
};

const submitBtnSX = {
  mt: 1,
  mb: 2,
  width: "100%",
  bgcolor: "white",
  borderColor: customTheme.palette.primary.main,
  boxShadow: customTheme.shadow.main,
  px: { xs: 1, sm: 2 },
  py: 0,
  fontSize: { xs: 16, sm: 20 },
  borderWidth: 3,
  "&.MuiButtonBase-root:hover": {
    borderColor: "white",
    bgcolor: customTheme.palette.primary.dark,
    color: "white",
    borderWidth: 3,
  },
};

const paperSX = {
  width: { xs: "90%", sm: "60%" },
  p: 5,
  mt: 2,
  // py: 3,
  // px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,0.8)",
};

// import React, { useContext, useEffect, useRef, useState } from "react";
// import { RegisterContext } from "../store/RegisterContext";
// import { Autocomplete, Button, Grid, TextField } from "@mui/material";
// import TextInput from "./TextInput";
// import { customTheme } from "../store/Theme";
// import { regions } from "../utilities/collections";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import dayjs from "dayjs";
// import {
//   convertDateToDateServerFormat,
//   getFullDate,
// } from "../utilities/functions";

// import { AppContext } from "../store/AppContext";

// function EditCouple({ formRef, isValidAndComplete }) {
//   const {
//     editValue,
//     updateEditValue,
//     saveDateValue,
//     isFormCompleted,
//     isEditFormValid,
//   } = useContext(RegisterContext);

//   const { coupleData } = useContext(AppContext);

//   useEffect(() => {
//     console.log(coupleData)
//     let counter = 0;
//     const { typeWeights, package: couplePackage, ...rest } = coupleData;
//     for (const key in rest) {
//       if (rest[key] != editValue[key]) counter++;
//     }
//     if (
//       isFormCompleted(editValue) &&
//       isEditFormValid(editValue) &&
//       counter > 0
//     ) {
//       isValidAndComplete(true);
//     } else {
//       isValidAndComplete(false);
//     }
//   }, [editValue]);

//   function handleWeddingDateChange(dateInput) {
//     let weddingDateObject = getFullDate(dateInput);
//     updateEditValue({
//       desiredDate: `${weddingDateObject.desiredDate}T00:00:00`,
//     });
//     saveDateValue(dateInput);
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const data = Object.fromEntries(formData.entries());
//     data.desiredDate = convertDateToDateServerFormat(data.desiredDate);
//     console.log(data);
//     console.log(editValue);
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <Grid container justifyContent="space-around" spacing={1}>
//         <Grid item xs={12} md={6}>
//           <TextInput
//             variant="standard"
//             type="text"
//             value={editValue.numberOfInvitees}
//             name="numberOfInvitees"
//             label="כמות מוזמנים"
//             textFieldSX={textFieldSX}
//             editMode={true}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <TextInput
//             variant="standard"
//             type="text"
//             value={editValue.budget}
//             name="budget"
//             label="תקציב"
//             textFieldSX={textFieldSX}
//             editMode={true}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Autocomplete
//             options={regions}
//             freeSolo={false}
//             value={editValue.desiredRegion}
//             onChange={(event, newValue) => {
//               updateEditValue({ desiredRegion: newValue });
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 variant="standard"
//                 name="desiredRegion"
//                 label="איזור"
//                 sx={textFieldSX}
//                 helperText="בחרו את האיזור בו תערך החתונה"
//               />
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <LocalizationProvider
//             dateAdapter={AdapterDayjs}
//             adapterLocale="en-gb"
//           >
//             <DatePicker
//               label="תאריך"
//               showDaysOutsideCurrentMonth
//               value={dayjs(editValue.desiredDate)}
//               onChange={(newValue) => handleWeddingDateChange(newValue)}
//               required
//               disablePast={true}
//               slotProps={{
//                 textField: {
//                   name: "desiredDate",
//                   variant: "standard",
//                   helperText: "בחרו את התאריך בו תתקיים החתונה",
//                   sx: textFieldSX,
//                 },
//               }}
//             />
//           </LocalizationProvider>
//         </Grid>

//         <Button
//           variant="outlined"
//           type="submit"
//           sx={submitBtnSX}
//           ref={formRef}
//         ></Button>
//       </Grid>
//     </form>
//   );
// }

// export default EditCouple;

// // ============================== styles ==============================

// const textFieldSX = {
//   p: 0,
//   width: "100%",
//   "& .MuiFormLabel-root": {
//     fontSize: { xs: 18, sm: 20 },
//     color: customTheme.palette.primary.main,
//   },
//   "& .MuiFormHelperText-root": {
//     fontSize: 15,
//   },
// };

// const submitBtnSX = {
//   display: "none",
//   // bgcolor: "white",
//   // borderRadius: 10,
//   // borderColor: customTheme.palette.primary.main,
//   // boxShadow: customTheme.shadow.main,
//   // px: { xs: 1, sm: 3 },
//   // py: 0,
//   // fontSize: { xs: 18, sm: 25 },
//   // borderWidth: 3,
//   // position: "relative",
//   // left: { xs: 5, sm: 15 },
//   // "&.MuiButtonBase-root:hover": {
//   //   bgcolor: customTheme.palette.primary.dark,
//   //   color: "white",
//   //   borderWidth: 3,
//   // },
// };
