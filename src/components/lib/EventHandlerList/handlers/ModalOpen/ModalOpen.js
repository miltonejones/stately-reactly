import React from 'react';
import { styled, Box, MenuItem } from '@mui/material';
import { AppStateContext } from '../../../../../context';
import { PillMenu, Pill, Flex, IconTextField, Spacer } from '../../../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ModalOpen = ({ action, actionChange }) => {
  const { target, open } = action;
  const context = React.useContext(AppStateContext)
  const modals = context.getApplicationModals();
  const options = [
    {
      label: 'open',
      value: true
    },
    {
      label: 'close',
      value: false
    },
    {
      label: 'toggle',
      value: 'toggle' 
    },
  ];
  const option = options.find(o => o.value === open);

 return (
   <Layout data-testid="test-for-ModalOpen">
      {/* <Typography variant="body2"><b>Open or close modal component:</b></Typography> */}
     <IconTextField 
        label="Open or close"
        startIcon={!option ? null : <Pill>{option.label}</Pill>}
        fullWidth select size="small" value={target}
        onChange={e => {
          actionChange({
            target: e.target.value,
            open
          })
        }} 
     >
        {modals.map(modal => <MenuItem value={modal.ID}>{modal.PageName||"application"}.{modal.ComponentName}</MenuItem>)}
     </IconTextField>
     <Flex sx={{pt: 1}}>
      <Spacer/>
      
      <PillMenu options={options} value={open}  
          onChange={val => {
            actionChange({
              open: val,
              target
            })
        }} />
     </Flex>
   </Layout>
 );
}
ModalOpen.defaultProps = {};
export default ModalOpen;
