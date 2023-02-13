import React from 'react';
import { styled, Box, TextField } from '@mui/material';
import { TinyButton, Spacer } from '../../../../../../styled';
import SectionHead from '../../../../../../styled/SectionHead';
 import {ConfirmPopover} from '../../../../..';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2, 0)
}));
 
const SplitBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  transition: 'all 0.2s linear',
  gridTemplateColumns: '30% 1fr 32px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1)
 }));

const ValuesForm = ({resource, connectionChange, send}) => {
  const { values } = resource;
 return (
   <Layout data-testid="test-for-ValuesForm">
   <SectionHead>
    
      Values
      <Spacer />
      <ConfirmPopover message={`Add request value`} 
        onChange={val => {
          !!val && connectionChange(resource.ID, 'values', values.concat({
            key: val,
            value: ""
          })); 
        }}
        prompt="Key" >
      <TinyButton icon="Add" />
      </ConfirmPopover>
   </SectionHead>
   <SplitBox>

  {!!values.length && (<>
    <Box>
   Key</Box>
   <Box>
   Value</Box>
   <Box>
   &nbsp;</Box>
  </>)}
 


    {values?.map(val => (<>
      <TextField size="small" disabled value={val.key} />
      <TextField size="small" value={val.value} onChange={e => {
        connectionChange(resource.ID, 'values', values.map(v => v.key === val.key ? {...v, value: e.target.value} : v));
      }}/>
      <ConfirmPopover message={`Are you sure you want to delete this key?`} 
        onChange={ok => {
          !!ok && connectionChange(resource.ID, 'values', values.filter(f => f.key !== val.key)); 
        }}  >
        <TinyButton icon="Delete" />
      </ConfirmPopover>
    </>))}

   </SplitBox>
     {/* {JSON.stringify(values)} */}
   </Layout>
 );
}



ValuesForm.defaultProps = {};
export default ValuesForm;
