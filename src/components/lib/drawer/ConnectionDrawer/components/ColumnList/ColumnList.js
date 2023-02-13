import React from 'react';
import { styled, Box, Typography } from '@mui/material';
import { TinyButton, Flex } from '../../../../../../styled';
import { ConfirmPopover } from '../../../../..';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ColumnList = ({ resource, connectionChange, send }) => {
  const { columns, node } = resource;
  const prefix = !node ? '' : `${node}/`;
  return (
    <Layout data-testid="test-for-ColumnList">
    {columns.map(col => (<>

      <ConfirmPopover message={`Are you sure you want to delete this key?`} 
        onChange={ok => {
          !!ok && connectionChange(resource.ID, 'columns', columns.filter(c => c !== col));
        }}  >  
        <Flex sx={{pb: 1}}>
        <TinyButton icon="CheckCircle" />
        <Typography variant="body2">{prefix}{col}</Typography></Flex>
      </ConfirmPopover>
    </>))}

      {/* <pre>
        {JSON.stringify(columns,0,2)}
      </pre> */}
    </Layout>
  );
}

ColumnList.defaultProps = {};
export default ColumnList;
