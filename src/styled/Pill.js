
// import React from 'react';
import { styled, Box } from '@mui/material';

const Pill = styled(Box)(({ theme, bold }) => ({
  cursor: 'pointer',
  borderRadius: 4,
  whiteSpace: "nowrap",
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.2),
  fontWeight: bold ? 600 : 400,
  outline: bold ? `solid 1px ${theme.palette.grey[500]}` : "none",
  backgroundColor: theme.palette.grey[200],
  fontSize: '0.7rem',
  '&:hover': {
    backgroundColor: theme.palette.grey[500],
  }
}))

export default Pill;
