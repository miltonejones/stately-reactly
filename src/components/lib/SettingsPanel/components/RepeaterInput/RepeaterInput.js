import React from 'react';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const RepeaterInput = ({value}) => {
  const bindingProp = !value 
    ? {}
    : JSON.parse(value);
 return (
   <Layout>
    <pre>
      {JSON.stringify(bindingProp,0,2)}
    </pre>
     RepeaterInput Component
   </Layout>
 );
}
RepeaterInput.defaultProps = {};
export default RepeaterInput;
