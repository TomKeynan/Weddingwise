import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { questionsArray } from "../../utilities/collections";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { QuestionsContext } from "../../store/QuestionsContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const Question = ({ activePage, onUserSelection }) => {
  const screenAboveSM = useMediaQuery("(min-width: 500px)");
  const { coupleAnswers, onSelectOption } = useContext(QuestionsContext);

  useEffect(() => {
    setSelectedOption(coupleAnswers[activePage]);
  }, []);

  const [selectedOption, setSelectedOption] = useState(0);

  function handleChange(e) {
    setSelectedOption(e.target.value);
    onSelectOption(activePage, e.target.value);
    // onUserSelection(e.target.value)
  }

  const currentQ = questionsArray[activePage];
  return (
    <Paper variant="elevation" elevation={6} sx={paperSX}>
      <Stack
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        // mt={1}
        px={2}
      >
        <Typography
          sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, fontWeight: "bold" }}
        >
          {`מה חשוב יותר לחתונה שלכם, ${currentQ.title} ?`}
        </Typography>
        {!screenAboveSM && (
          <Stack direction="row" spacing={2}>
            <img className="suppliers-sticker" src={currentQ.sticker_1} />
            <img className="suppliers-sticker" src={currentQ.sticker_2} />
          </Stack>
        )}
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        pt={{ xs: 1, sm: 4 }}
      >
        {screenAboveSM && (
          <img className="suppliers-sticker" src={currentQ.sticker_1} />
        )}
        <Stack>
          <FormControl>
            {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
            <RadioGroup
              name="radio-buttons-group"
              value={selectedOption}
              onChange={handleChange}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: { xs: 16, sm: 20, md: 22 },
                },
              }}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label={`לגמרי מעדיפים ${currentQ.options.supplier_1}`}
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label={`בגדול מעדיפים ${currentQ.options.supplier_1}`}
              />
              <FormControlLabel
                value={3}
                control={<Radio />}
                label={`אין לנו העדפה`}
              />
              <FormControlLabel
                value={4}
                control={<Radio />}
                label={`בגדול מעדיפים ${currentQ.options.supplier_2}`}
              />
              <FormControlLabel
                value={5}
                control={<Radio />}
                label={`לגמרי מעדיפים ${currentQ.options.supplier_2}`}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        {screenAboveSM && (
          <img className="suppliers-sticker" src={currentQ.sticker_2} />
        )}
      </Stack>
    </Paper>
  );
};

export default Question;

const paperSX = {
  width: { xs: "95%", md: "100%" },
  maxWidth: "800px",
  minHeight: "350px",
  backgroundColor: "transparent",
  textAlign: "center",
  p: { xs: 1, sm: 5 },
};
