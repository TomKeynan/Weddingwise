import React, { useContext, useEffect, useState } from "react";
import { RegisterContext } from "../store/RegisterContext";
import { TextField } from "@mui/material";
import {
  editCoupleValidations,
  signupCoupleValidations,
} from "../utilities/collections";

const initialCheckState = {
  name: null,
  isValid: true,
};

const TextInput = ({
  variant,
  type,
  value,
  name,
  label,
  textFieldSX,
  inputProps,
  editMode = false,
  InputProps,
}) => {
  const { userDetails, editValue, updateUserDetails, updateEditValue } =
    useContext(RegisterContext);

  const [check, setCheck] = useState(initialCheckState);

  useEffect(() => {
    if (editMode) {
      if (name !== "password") {
        validationCheck(name, editValue[name]);
      }
    } else {
      validationCheck(name, userDetails[name]);
    }
  }, []);

  function handleChange(e) {
    let value = e.target.value;
    validationCheck(name, value);

    if (editMode) updateEditValue({ [name]: value });
    else updateUserDetails({ [name]: value });
  }

  function validationCheck(key, value) {
    let validator = signupCoupleValidations;
    if (editMode === true) {
      validator = editCoupleValidations;
    }

    if (validator[key].regex.test(value)) {
      setCheck({ name: key, isValid: true, validMsg: validator[key].valid });
    } else
      setCheck({ name: key, isValid: false, errorMsg: validator[key].error });
  }

  return (
    <TextField
      variant={variant}
      type={type}
      value={value}
      name={name}
      label={label}
      error={check.isValid !== true}
      helperText={check.isValid === true ? check.validMsg : check.errorMsg}
      onChange={handleChange}
      sx={textFieldSX}
      inputProps={inputProps}
      InputProps={InputProps}
    />
  );
};

export default TextInput;
