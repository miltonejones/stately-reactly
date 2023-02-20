import React from 'react';
import { Drawer } from '@mui/material';
import { AppStateContext } from '../../../context';
  
const ReactlyDrawer = ({children, ID, ...props}) => {
  const context = React.useContext(AppStateContext);
  const refs = context.references;
  const open = props.open || (!!refs && !!refs[ID]);
  const handleClose = () => {
    context.send({
      type: 'MODAL',
      ID,
      open: false
    })
  }
  return (
    <Drawer {...props} open={open} onClose={handleClose}>
      {children}
    </Drawer>
  );
}
ReactlyDrawer.defaultProps = {};
export default ReactlyDrawer;
