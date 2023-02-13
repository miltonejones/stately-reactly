import React from 'react';
import * as Icons from "@mui/icons-material";
import { IconButton } from '@mui/material';
  
 
const ReactlyIconButton = ({icon, ...props}) => {
  const Icon = Icons[icon]
  return ( 
    <IconButton {...props}>
      {!!Icon && <Icon />}
    </IconButton>
  );
}
ReactlyIconButton.defaultProps = {};
export default ReactlyIconButton;
