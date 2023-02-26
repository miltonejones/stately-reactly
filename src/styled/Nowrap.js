
// import React from 'react';
import { styled, Typography } from '@mui/material';
// import { blue } from '@mui/material/colors';

const Nowrap = styled(Typography)(( { theme, color, width, muted, small, thin, odd, bold = false, hover } ) => {
  const obj = {
    cursor: hover ? 'pointer' : 'default',
    fontWeight:  bold ? 600 : 400,
    // backgroundColor: odd ? blue[50] : 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width:  width || '100%',
    color: muted ? theme.palette.text.secondary : theme.palette.text.primary ,
    '&:hover': {
      textDecoration: hover ? 'underline' : 'none'
    }
  };
  if (small) {
    Object.assign(obj, {
      fontSize: '0.85rem'
    })
  }
  if (thin) {
    Object.assign(obj, {
      lineHeight: '1em'
    })
  }

  if (color && theme.palette[color]){
    Object.assign(obj, {
      color: theme.palette[color].main
    })
  }
  return obj;
})

export default Nowrap;
