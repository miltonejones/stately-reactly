import React from 'react';
import { styled, Box, Stack, Switch, Typography, TextField } from '@mui/material';
import { Flex } from '../../../../../../styled'; 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ConnectionForm = ({ connection, connectionChange}) => {
 return (
    <Layout data-testid="test-for-ConnectionForm">
      <Stack spacing={1}>
        <TextField 
          label="Connection name"
          fullWidth
          size="small"
          value={connection.name}
          onChange={e => connectionChange(connection.ID, 'name', e.target.value)}
          />
        <TextField 
          label="Root URL"
          fullWidth
          size="small"
          value={connection.root}
          onChange={e => connectionChange(connection.ID, 'root', e.target.value)}
          />

        <Flex onClick={e => connectionChange(connection.ID, 'type', connection.type !== 'rest' ? "rest" : "querystring") }>
          <Switch checked={connection.type === 'rest'}  />
          <Typography variant="body2">Service is RESTful</Typography>
        </Flex>
      </Stack>
     {/* <pre>
      {JSON.stringify(connection,0,2)}
     </pre> */}
    </Layout>
 );
}
ConnectionForm.defaultProps = {};
export default ConnectionForm;
