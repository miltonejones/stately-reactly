import React from 'react';
import { styled, Card, Stack, Typography, Divider } from '@mui/material';
import { Btn, Spacer, Flex, TinyButton } from '../../../styled'; 
 
const Layout = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1), 
}));
 
const CloseConfirm = ({ send, allowSave }) => {
 return (
  <Layout>
    <Flex spacing={1} sx={{ p: 1 }}>
      {/* <Warning color="warning"/> */}
      <TinyButton icon="Warning" color="warning" />
      <Typography variant="subtitle2">Unsaved changes</Typography>
      <Spacer />
      <TinyButton icon="Close" onClick={() => send('CANCEL')} />
    </Flex>

    {/* <Divider/> */}

    <Stack sx={{p: 1}}>
      <Typography>Do you want to save the changes you made?</Typography>
      <Typography variant="body2">Your changes will be lost if you don't save them.</Typography>
    </Stack>

    <Divider/>

    <Flex spacing={1} sx={{ p: 1 }}>
      <Btn variant="contained" color="error" onClick={() => send('CONFIRM')}>
        Don't save
      </Btn>
      <Spacer /> 
      {allowSave && <Btn variant="contained" onClick={() => send('SAVE')}>
        Save
      </Btn>}
      <Btn variant="outlined" onClick={() => send('CANCEL')}>
        Cancel
      </Btn>
    </Flex>
   </Layout>
 ); 
}
CloseConfirm.defaultProps = {};
export default CloseConfirm;
