// import React from 'react';
import { styled, Box } from "@mui/material";

const Flex = styled(Box)(({ theme, wrap = "nowrap", between, bold, spacing = 0 }) => ({
  gap: theme.spacing(spacing),
  cursor: "pointer",
  display: "flex",
  fontWeight: bold ? 600 : 400,
  alignItems: "center",
  justifyContent: between ? "space-between" : "flex-start",
  flexWrap: wrap
}));

export default Flex;