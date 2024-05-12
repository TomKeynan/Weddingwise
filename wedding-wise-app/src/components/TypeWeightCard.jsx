import { Box, Grid, Typography } from "@mui/material";
import React from "react";

function TypeWeightCard({ props }) {
  const { name, stickerSrc, stickerAlt, weight } = props;
  const decimalWeight = weight.toFixed(2) * 100;
  return (
    <Grid item xs={12} sm={6} md={2} sx={cardContainerSX}>
      <Typography variant="h6" sx={{fontWeight: "bold"}}>{stickerAlt}</Typography>
      <Box>
        <img className="type-card-image" src={stickerSrc} alt={stickerAlt} />
      </Box>
      <Typography variant="h6" sx={{fontWeight: "bold"}}>{decimalWeight}%</Typography>
    </Grid>
  );
}

export default TypeWeightCard;

const cardContainerSX = {
  px: { xs: 2, sm: 0 },
  mb: 2,
  // bgcolor: customTheme.palette.primary.light,
  // py: 2,
  // border: 1,
};