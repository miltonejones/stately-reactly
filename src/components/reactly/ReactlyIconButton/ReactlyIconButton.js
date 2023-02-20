import React from 'react';
import * as Icons from "@mui/icons-material";
import { IconButton } from '@mui/material';
import TextIcon from '../../../styled/TextIcon';
  
 
const ReactlyIconButton = ({icon, ...props}) => { 
  return ( 
    <IconButton {...props}>
      <TextIcon icon={icon} /> 
    </IconButton>
  );
}
ReactlyIconButton.defaultProps = {};
export default ReactlyIconButton;
