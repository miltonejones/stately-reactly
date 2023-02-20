import React from 'react';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ReactlyList = (props) => {
 return (
   <Layout data-testid="test-for-ReactlyList">
     ReactlyList Component
     <pre>
      {JSON.stringify(props,0,2)}
     </pre>
   </Layout>
 );
}
ReactlyList.defaultProps = {};
export default ReactlyList;
