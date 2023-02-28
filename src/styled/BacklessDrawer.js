
import React from 'react';
import { Drawer } from '@mui/material';

const BacklessDrawer = ({children, debug, ...props}) => {
  return (
   <Drawer 
     sx={{
       '& .MuiPaper-root': {
         left: debug ? 360 : 0
       }
     }}
     ModalProps={{
       slots: { backdrop: "div" },
       slotProps: {
         root: { //override the fixed position + the size of backdrop
           style: {
             position: "absolute",
             top: "unset",
             bottom: "unset",
             left: "unset",
             right: "unset",
           },
         },
       },
       }}  {...props}>
 {children}
     </Drawer>
  );
 }

export default BacklessDrawer;
