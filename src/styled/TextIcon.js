
import React from 'react';
import * as Icons from "@mui/icons-material";

const TextIcon = ({ icon , ...props}) => {
  const Icon = Icons[icon];
  if (icon) {
    return <Icon {...props}/>
  }
  return <i />
} 

export default TextIcon;
