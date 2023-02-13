
// import React from 'react';
import { styled, Box } from '@mui/material';

const SectionHead = styled(Box)(({ theme, active, nopadding } ) => ({
  display: 'flex',
  alignItems: 'center',
  borderBottom: 'solid 1px ' + theme.palette.divider,
  fontSize: '0.85rem',
  fontWeight: 600,
  textTransform: 'capitalize',
  cursor: 'pointer',
  color: active ? theme.palette.error.dark : theme.palette.text.secondary,
  padding: theme.spacing(nopadding ? 0 : 1, 0)
}))

export default SectionHead;
