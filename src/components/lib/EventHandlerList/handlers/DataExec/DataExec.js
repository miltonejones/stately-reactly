import React from 'react';
import { styled, Box, MenuItem, Stack, Typography } from '@mui/material';
import { StateSelect } from '../../../..';
import { AppStateContext } from '../../../../../context';
import Columns from '../../../../../styled/Columns';
import { IconTextField, Pill } from '../../../../../styled'; 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const DataExec = ({ action, actionChange, supportedEvent }) => {
  const context = React.useContext(AppStateContext); 
  const { terms, target } = action; 
  if (!context.application.resources) {
    return <i />
  }

  const { resources } = context.application;

  const chosenResource = resources.find(f => f.ID === action.target);

  return (
    <Layout data-testid="test-for-DataExec">
      <IconTextField
        label="Select data resource"
        startIcon={<Pill>Execute</Pill>}
        select
        fullWidth
        size="small"
        value={target}>
        {context.application.resources.map(res => <MenuItem value={res.ID}>{res.name}</MenuItem>)}
      </IconTextField>


      {!!chosenResource?.values && <Stack sx={{mt: 1}} spacing={1}>
          <Typography variant="body2">Set request parameters</Typography>
          <Columns columns="30% 1fr">
          {chosenResource.values.map(param => (
            <>
            <Box>{param.key}</Box>
              <Box>
                <StateSelect value={terms[param.key]} 
                  supportedEvent={supportedEvent}
                  params 
                  onChange={e => {

                      actionChange({
                        target,
                        terms: {
                          ...terms,
                          [param.key]: e
                        }
                      })
                  }}/>
              </Box>
            </>
          ))}


        </Columns>

          </Stack>}


      
      {/* <pre>
        {JSON.stringify(terms,0,2)}
      </pre> */}
    </Layout>
  );
}
DataExec.defaultProps = {};
export default DataExec;
