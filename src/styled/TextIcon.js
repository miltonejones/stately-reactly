
import React from 'react';
import * as Icons from "@mui/icons-material";

const TextIcon = ({ icon , ...props}) => {
  if (typeof icon === 'string') {
    const Icon = Icons[icon];
    if (icon) {
      return <Icon {...props}/>
    }
    return <i />
  } 

  console.log ({
    error: icon
  })
  return <>:: object?</>
} 

export default TextIcon;
