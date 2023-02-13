
import React from 'react';
import * as Icons from "@mui/icons-material";
import { IconButton } from '@mui/material';

// const Icons = React.lazy(() => import('./icons'));

const TinyButton = ({ icon , ...props}) => {
  const Icon = Icons[icon];
  return <IconButton {...props}  sx={{width: 18, height: 18}} >
    <Icon sx={{width: 16, height: 16}} />
  </IconButton>
}

export default TinyButton;
