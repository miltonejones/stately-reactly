import React from 'react';
import { Button} from '@mui/material'; 
import TextIcon from '../../../styled/TextIcon';
 
const ReactlyButton = ({end, startIcon, children, Label, ...props}) => {
 return (
   <Button 
    {...props}
    endIcon={<TextIcon icon={end}  />}
    startIcon={<TextIcon icon={startIcon}  />}
    >
     {children || Label}
   </Button>
 );
}
ReactlyButton.defaultProps = {};
export default ReactlyButton;
