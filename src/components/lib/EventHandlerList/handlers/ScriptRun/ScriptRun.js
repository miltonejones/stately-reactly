import React from 'react';
import { styled, Box } from '@mui/material'; 
import ScriptSelect from '../../../ScriptSelect/ScriptSelect';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ScriptRun = ({ action, actionChange }) => {
  const { target } = action; 
  return (
    <Layout data-testid="test-for-ScriptRun">
    {/* <Typography variant="body2"><b>Run client script:</b></Typography> */}
      
    <ScriptSelect 
      value={target}    
      onChange={e => {
          actionChange({
            target: e 
          })
        }}  
      />
    </Layout>
  );
}
ScriptRun.defaultProps = {};
export default ScriptRun;
