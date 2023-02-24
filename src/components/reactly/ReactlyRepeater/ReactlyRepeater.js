import React from 'react';
import { styled, Box } from '@mui/material';
 import { RepeaterContext } from '../../../context';
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ReactlyRepeater = ({children, ...props}) => {
  
 return (
  <>

<Layout data-testid="test-for-ReactlyRepeater" {...props}>
  {props.dataRows?.map(row => <RepeaterContext.Provider
    value={{
      ...row,
      columnNames: props.columnNames
    }}
    >{children}</RepeaterContext.Provider>)}
  </Layout>

   ReactlyRepeater Component
     <pre>
      {JSON.stringify(props,0,2)}
     </pre>
 
  </>
 );
}
ReactlyRepeater.defaultProps = {};
export default ReactlyRepeater;
