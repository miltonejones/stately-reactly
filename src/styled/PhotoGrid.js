// import React from 'react';
import { styled, Box } from "@mui/material";

const PhotoGrid = styled(Box)(({ theme }) => ({
  gap: theme.spacing(1),
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
}));

export default PhotoGrid;
