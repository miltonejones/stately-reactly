import React from 'react';
import { styled, Stack,  Typography,  Box } from '@mui/material';
import { StateSelect } from '../../../..';
import { AppStateContext } from '../../../../../context';
import { PillMenu, Flex } from '../../../../../styled'; 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const SetState = ({ action, actionChange, supportedEvent }) => {
  const context = React.useContext(AppStateContext); 
  const { value, target } = action; 
  const { state } = context.application
  const { selectedPage } = context;

  const appProps = state?.map(opt => ({
    id: `application.${opt.Key}`,
    label: `application.${opt.Key}`,
    type: opt.Type
  }));

  const pageProps = !selectedPage ? [] : selectedPage.state?.map(opt => ({
    id: opt.Key,
    label: opt.Key,
    type: opt.Type
  }));

  // const paramProps = !selectedPage?.parameters ? [] : Object.keys(selectedPage.parameters).map(paramKey => {
  //   return {
  //     id: `parameters.${paramKey}`,
  //     label: `parameters.${paramKey}`
  //   };
  // })

  const options = [...pageProps, ...appProps];
  // const targets = [...paramProps, ...options];

  const selectedProp = options.find(f => f.id === target);
  const booleanOptions = [
    {
      label: 'true',
      value: true
    },
    {
      label: 'false',
      value: false
    },
    {
      label: 'toggle' ,
      value: 'toggle'
    },
  ];

 return (
   <Layout data-testid="test-for-SetState">
    <Stack spacing={1}>

      {/* <Typography variant="body2"><b>Change client variable:</b></Typography> */}
    
      {/* action.target  */}
      <StateSelect pill="Change" value={target} onChange={e => {
          actionChange({
            target: e,
            value
          })
      }} /> 

      <Stack 
        sx={{ alignItems: selectedProp?.type === 'boolean' ? 'center' : 'baseline' }}
        direction={selectedProp?.type === 'boolean' ? "row" : "column"}>
       

        {/* action.value  */}
        {selectedProp?.type !== 'boolean' && <StateSelect pill="To" supportedEvent={supportedEvent} params value={value} onChange={e => {
          actionChange({
            target,
            value: e
          })
      }} /> }

        {selectedProp?.type === 'boolean' && <Flex spacing={1}>
           <Typography variant="body2"><b>To:</b></Typography>
          <PillMenu onChange={val => {
            actionChange({
              value: val,
              target
            })
        }} options={booleanOptions} value={value} /></Flex>}
      </Stack>
    </Stack>

   <pre>
   {/* {JSON.stringify(stateProps,0,2)} */}
   {/* {JSON.stringify(state,0,2)}*/}
   </pre> 
   </Layout>
 );
}
SetState.defaultProps = {};
export default SetState;
