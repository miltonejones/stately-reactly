import React from 'react';
import { styled, Pagination } from '@mui/material';
 
const Layout = styled(Pagination)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const ReactlyPagination = (props) => {
  if (!props.page) {
    return <i />
  }
  return ( 
    <Layout  
        {...props}
        page={Number(props.page)}  
        onChange={(e, page) => { 
          props.onPageChange && props.onPageChange(e, { page })
        }}
      /> 
  );
}
ReactlyPagination.defaultProps = {};
export default ReactlyPagination;
