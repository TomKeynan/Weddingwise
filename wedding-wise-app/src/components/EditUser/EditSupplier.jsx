import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RegisterContextProvider from "../../store/RegisterContext";
import { customTheme } from "../../store/Theme";
import { Visibility, VisibilityOff, YouTube } from "@mui/icons-material";
import {
  editSupplierValidations,
  regions,
  signupSupplierErrors,
} from "../../utilities/collections";
import InputFileUpload from "../InputFileUpload";
import SupplierOutlineBtn from "../buttons/SupplierOutlineBtn";
import useFetch from "../../utilities/useFetch";
import Loading from "../Loading";
import MessageDialog from "../Dialogs/MessageDialog";
import { auth, db } from "../../fireBase/firebase";
import { doc } from "firebase/firestore";
import upload from "../../fireBase/upload";
import { AppContext } from "../../store/AppContext";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import { useUserStore } from "../../fireBase/userStore";
import { updatePassword } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { geocodeAddress } from "../../utilities/functions";
import { useGlobalStore } from "../../fireBase/globalLoading";

const EditSupplier = ({ supplierFirebase }) => {
  const { editSupplier, setEditSupplier, setSupplierData } =
    useContext(AppContext);
  const { sendData, resData, setResData, loading, error, setError } =
    useFetch();
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [openAddressError, setOpenAddressError] = useState(false);
  const [currentSupplierData, setCurrentSupplierData] = useState(null);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const { globalLoading, setGlobalLoading } = useGlobalStore();
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [InstagramLink, setInstagramLink] = useState("");
  const [FacebookLink, setFacebookLink] = useState("");
  const [YouTubeLink, setYouTubeLink] = useState("");
  const [LinkedInLink, setLinkedInLink] = useState("");

  useEffect(() => {
    if (supplierFirebase) {
      setInstagramLink(supplierFirebase.socialLinks?.Instagram || "");
      setFacebookLink(supplierFirebase.socialLinks?.Facebook || "");
      setYouTubeLink(supplierFirebase.socialLinks?.YouTube || "");
      setLinkedInLink(supplierFirebase.socialLinks?.LinkedIn || "");
    }
  }, [supplierFirebase]);

  useEffect(() => {
    const updateUser = async () => {
      if (resData) {
        const { Password, ...rest } = currentSupplierData;
        try {
          setSupplierData(rest);
          await updateUserFirebase();
          window.scrollTo({ top: 0, behavior: "smooth" });
          setOpenUpdateSuccess(true);
        } catch (error) {
          setGlobalLoading(false);
          console.error("Error updating user:", error);
        } finally {
          setGlobalLoading(false);
          setResData(undefined);
        }
      }
    };

    updateUser();
   
  }, [resData, currentSupplierData]);


  useEffect(() => {
    setCurrentDescription(supplierFirebase?.description);
    setCurrentAddress(supplierFirebase?.address);
  }, [supplierFirebase]);

  const updateUserFirebase = async () => {
    const username = currentSupplierData.businessName;
    const password = currentSupplierData.password;
    const description = currentDescription;

    const socialLinksWithDefaults = {
      Instagram: InstagramLink || "",
      Facebook: FacebookLink || "",
      YouTube: YouTubeLink || "",
      LinkedIn: LinkedInLink || "",
    };

    try {
      await Promise.race([
        (async () => {
          const user = auth.currentUser;
          if (password) {
            await updatePassword(user, password);
          }

          let imgUrl = null;
          if (avatar && avatar.file) {
            imgUrl = await upload(avatar.file);
          }

          const userRef = doc(db, "users", supplierFirebase.id);
          await updateDoc(userRef, {
            username: username || supplierFirebase.username,
            description: description || supplierFirebase?.description,
            avatar: imgUrl || supplierFirebase.avatar,
            socialLinks: socialLinksWithDefaults,
          });
        })(),
      ]);
    } catch (err) {
      console.log(err);
      setGlobalLoading(false);
    }
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  async function handleFormSubmit(e) {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    delete data.description;
    delete data.userImage;
    delete data.Instagram;
    delete data.Facebook;
    delete data.YouTube;
    delete data.LinkedIn;

    if (data.venueAddress) {
      try {
        const { latitude, longitude } = await geocodeAddress(data.venueAddress);
        if (latitude == null || longitude == null) {
          setOpenAddressError(true);
          return;
        }
        else {
          data.latitude = latitude;
          data.longitude = longitude;
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    const newErrors = {};
    for (let field in data) {
      if (
        editSupplierValidations.hasOwnProperty(field) &&
        !editSupplierValidations[field].regex.test(data[field])
      ) {
        newErrors[field] = editSupplierValidations[field].error;
      } else {
        if (data[field] === "" && field !== "password") {
          newErrors[field] = "שדה זה נדרש להיות מלא";
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
     
      return;
    } else {
      setCurrentSupplierData({ ...editSupplier, ...data });
      setOpen(true);
      setOpenUpdateConfirm(true);
      setErrors({});
    }
  }

  function handleInputChange(e) {
    setEditSupplier((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  }

  // ================  handling incorrect venue address ================

  function showAddressErrorMessage() {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={openAddressError}
        onClose={handleCloseMessage}
        xBtn={handleCloseMessage}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          הכתובת שהזנת לא נמצאה. אנא כתבו כתובת אחרת או נסו שנית
        </Typography>
      </MessageDialog>
    );
  }

  // ================ error handling ================
  function handleCloseMessage() {
    setOpenAddressError(false);
    setOpen(false);
    setError(undefined);
  }

  function showErrorMessage(status) {
    return (
      <MessageDialog
        title="שגיאה!"
        btnValue="אוקיי!"
        open={open}
        onClose={handleCloseMessage}
        xBtn={handleCloseMessage}
        mode="error"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {signupSupplierErrors[status]}
        </Typography>
      </MessageDialog>
    );
  }

  // ================ Confirm update handling ================

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function handleApprovalUpdateConfirm() {
    setGlobalLoading(true);
    sendData("/Suppliers/updateSupplier", "PUT", currentSupplierData);
    setOpenUpdateConfirm(false);
  }

  function showUpdateConfirmDialog() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
        onApproval={handleApprovalUpdateConfirm}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          האם את\ה בטוחים שאתם רוצים לעדכן את הפרטים?
        </Typography>
      </ConfirmDialog>
    );
  }

  // ================  Updated success handling ================

  function showSuccessMessage() {
    return (
      <MessageDialog
        title="כל הכבוד!"
        btnValue="אוקיי!"
        open={openUpdateSuccess}
        onClose={() => setOpenUpdateSuccess(false)}
        xBtn={() => setOpenUpdateSuccess(false)}
        mode="success"
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          עדכון הפרטים החדשים שלך עבר בהצלחה
        </Typography>
      </MessageDialog>
    );
  }

 

  return (
    <RegisterContextProvider>
      {globalLoading && <Loading/>}
      {error && showErrorMessage(error)}
      {openUpdateConfirm && showUpdateConfirmDialog()}
      {openUpdateSuccess && showSuccessMessage()}
      {openAddressError && showAddressErrorMessage()}
      <Stack
        spacing={2}
        textAlign="center"
        justifyContent="flex-start"
        sx={{
          width: "90%",
          margin: "auto",
          minHeight: "inherit",
          pb: 10,
        }}
      >
        <Paper variant="elevation" elevation={6} sx={paperSX}>
          <form onSubmit={handleFormSubmit}>
            <Grid container sx={{ rowGap: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="שם העסק"
                  name="businessName"
                  max={5}
                  sx={textFieldSX}
                  inputProps={{ maxLength: 30 }}
                  helperText="שם העסק יופיע בפרופיל שלכם"
                  value={editSupplier.businessName}
                  onChange={handleInputChange}
                />
                {errors.businessName && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.businessName}
                  </Alert>
                )}
              </Grid>
              {/* SupplierTypes */}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  value={editSupplier.phoneNumber}
                  label="מס' טלפון"
                  name="phoneNumber"
                  sx={textFieldSX}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.phoneNumber}
                  </Alert>
                )}
              </Grid>
              {editSupplier.supplierType === "venue" && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="filled"
                      type="text"
                      label="כמות אורחים"
                      name="capacity"
                      sx={textFieldSX}
                      value={
                        editSupplier.capacity === null
                          ? 0
                          : editSupplier.capacity
                      }
                      onChange={handleInputChange}
                    />
                    {errors.capacity && (
                      <Alert severity="error" sx={errorAlertSX}>
                        {errors.capacity}
                      </Alert>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="filled"
                      type="text"
                      value={currentAddress}
                      label="כתובת"
                      onChange={(e) => setCurrentAddress(e.target.value)}
                      name="venueAddress"
                      sx={textFieldSX}
                    />
                    {errors.venueAddress && (
                      <Alert severity="error" sx={errorAlertSX}>
                        {errors.venueAddress}
                      </Alert>
                    )}
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  label="מחיר"
                  name="price"
                  sx={textFieldSX}
                  helperText="המחיר הממוצע עבור השירות שלכם"
                  value={editSupplier.price}
                  onChange={handleInputChange}
                />
                {errors.price && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.price}
                  </Alert>
                )}
              </Grid>
              {/* Region */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={regions}
                  freeSolo={false}
                  value={editSupplier.availableRegion}
                  onChange={(event, newValue) => {
                    setEditSupplier((prevData) => {
                      return {
                        ...prevData,
                        availableRegion: newValue,
                      };
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="איזור"
                      name="availableRegion"
                      sx={textFieldSX}
                    />
                  )}
                />
                {errors.availableRegion && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.availableRegion}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  variant="filled"
                  label="תיאור"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  multiline
                  maxRows={5}
                  sx={textareaSX}
                  helperText="תיאור זה יופיע בפרופיל - כתבו תיאור הולם עבור העסק והשירות שאתם מציעים"
                />
                {errors.description && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.description}
                  </Alert>
                )}
              </Grid>

              {/* <Grid item xs={12} md={6}>
                <FormControl
                  color="primary"
                  variant="outlined"
                  sx={textFieldSX}
                >
                  <TextField
                    id="password-input"
                    name="password"
                    label="סיסמא"
                    type={showPassword ? "text" : "password"}
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
                {errors.password && (
                  <Alert severity="error" sx={errorAlertSX}>
                    {errors.password}
                  </Alert>
                )}
              </Grid> */}
              <Grid item xs={12} md={6}>
                <FormControl
                  name="userImage"
                  sx={textFieldSX}
                  onChange={handleAvatar}
                >
                  <InputFileUpload isUpload={avatar.file} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "left", color: "grey", pl: 3 }}
                >
                  קישורים לרשתות החברתיות
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  value={YouTubeLink}
                  name="YouTube"
                  label="קישור ליוטיוב"
                  onChange={(e) => setYouTubeLink(e.target.value)}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  value={InstagramLink}
                  name="Instagram"
                  label="קישור לאינסטגרם"
                  onChange={(e) => setInstagramLink(e.target.value)}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  value={FacebookLink}
                  name="Facebook"
                  label="קישור לפייסבוק"
                  onChange={(e) => setFacebookLink(e.target.value)}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  type="text"
                  value={LinkedInLink}
                  name="LinkedIn"
                  label="קישור ללינקדין"
                  onChange={(e) => setLinkedInLink(e.target.value)}
                  sx={textFieldSX}
                />
              </Grid>

              <Grid item xs={12}>
                <SupplierOutlineBtn
                  type="submit"
                  value="עדכן פרטים"
                  width="100%"
                  fontSize={{ xs: 16, sm: 20 }}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Stack>
    </RegisterContextProvider>
  );
};

export default EditSupplier;

const paperSX = {
  py: 3,
  px: { xs: 1, sm: 3 },
  backgroundColor: "rgba(255,255,255,0.8)",
};

const textFieldSX = {
  width: "95%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: { xs: 12, sm: 15 },
  },
};

const textareaSX = {
  width: "98%",
  "& .MuiFormLabel-root": {
    fontSize: { xs: 14, sm: 16 },
    color: customTheme.palette.primary.main,
    left: "-3px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: { xs: 12, sm: 15 },
  },
};

const errorAlertSX = {
  fontSize: 14,
  px: 1,
  justifyContent: "center",
  width: "90%",
  m: "12px auto 0",
  "& .MuiAlert-icon": {
    mr: "3px",
  },
};
