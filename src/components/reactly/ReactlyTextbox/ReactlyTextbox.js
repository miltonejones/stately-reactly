import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import TextIcon from '../../../styled/TextIcon';
  
 
const ReactlyTextbox = ({onEnterPress, icon, end, ...props}) => {


  const startAdornment = !icon ? null : <InputAdornment position="start"><TextIcon icon={icon} /></InputAdornment>;
  const endAdornment = !end ? null : <InputAdornment position="start"><TextIcon icon={end} /></InputAdornment>;

  const adornment = {
    startAdornment,
    endAdornment 
  };

 return (
   <TextField 
    {...props} 
    onKeyUp={e => {
      e.keyCode === 13 && onEnterPress && onEnterPress(e)
    }} 
    InputProps={adornment} 
     />
 );
}
ReactlyTextbox.defaultProps = {};
export default ReactlyTextbox;
