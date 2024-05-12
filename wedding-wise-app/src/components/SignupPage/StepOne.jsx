import React, { useContext } from "react";
import { RegisterContext } from "../../store/RegisterContext";
import { Stack } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "./steps.css";

const StepOne = () => {
  const { userDetails, updateUserDetails } = useContext(RegisterContext);

  const handleChange = (event) => {
    updateUserDetails({ [event.target.name]: event.target.value });
  };
  // console.log(userDetails);

  return (
    <FormControl>
      <RadioGroup
        name="Relationship"
        onChange={handleChange}
        value={userDetails.Relationship}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 20 }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 100 }}
          >
            <img
              className="step1-img"
              src={"assets/female-icon.png"}
              alt="female-gender-sign"
            />
            <FormControlLabel value="female" control={<Radio />} label="נשים" />
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 100 }}
          >
            <img
              className="step1-img"
              src={"assets/men-icon.png"}
              alt="female-gender-sign"
            />
            <FormControlLabel value="male" control={<Radio />} label="גברים" />
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 100 }}
          >
            <img
              className="step1-img"
              src={"assets/couple-icon.png"}
              alt="female-gender-sign"
            />
            <FormControlLabel
              value="couple"
              control={<Radio />}
              label="אישה & גבר"
              sx={{ width: 120, m: 0 }}
            />
          </Stack>
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

export default StepOne;
