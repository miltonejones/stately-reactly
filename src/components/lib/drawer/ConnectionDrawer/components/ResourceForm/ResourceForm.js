import React from 'react';
import { styled, Box, Grid, Switch, Collapse, Typography } from '@mui/material';
import { IconTextField, Pill, Flex, Btn } from '../../../../../../styled';
import { ScriptSelect, SimpleMenu } from "../../../../..";
import ValuesForm from '../ValuesForm/ValuesForm';

 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ResourceForm = ({ resource, handleTest, response, connectionChange, send }) => {
  // const { values } = resource;
 return (
   <Layout data-testid="test-for-ResourceForm">
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <IconTextField 
          label="Name"
          fullWidth
          size="small"
          onChange={e => connectionChange(resource.ID, 'name', e.target.value)}
          value={resource.name}
          />
      </Grid> 
      <Grid item xs={6}>
        <IconTextField 
          fullWidth
          label="Path"
          size="small"
          onChange={e => connectionChange(resource.ID, 'path', e.target.value)}
          value={resource.path}
          endIcon={<SimpleMenu onChange={value => !!value &&  connectionChange(resource.ID, 'method', value)} value={resource.method} options={['DELETE','GET','POST','PUT']}
          ><Pill nopadding bold>
            {resource.method}
          </Pill></SimpleMenu>}
          />
      </Grid>


      <Grid item xs={12}>
        <Collapse in={!!resource.transform}>
          <ScriptSelect value={resource.transform} 
            onChange={e => connectionChange(resource.ID, 'transform', e) }
            label={
              resource.method === 'GET' 
                ? 'Transform incoming response'
                : 'Transform outgoing request'
            }
            />
        </Collapse> 
      </Grid>

      <Grid item xs={10}>
        <Flex>
          {resource.method === 'GET' && (<>
            <Switch checked={resource.format === 'rest' && resource.method === 'GET'} 
              onChange={e => connectionChange(resource.ID, 'format', e.target.checked ? "rest" : "querystring") }
              />
          <Typography variant="body2">RESTful</Typography>
          </>)}
            <Switch checked={!!resource.transform}
              onChange={e => connectionChange(resource.ID, 'transform', e.target.checked) }
              />
          <Typography variant="body2">Transform {resource.method === 'GET' ? "response" : "request"}</Typography>
        </Flex>
      </Grid>

      <Grid item xs={2} sx={{ textAlign: 'right' }}>
        {/* <Btn sx={{mr: 1}} variant="outlined" size="small" onClick={() => send('CLOSE')}>cancel</Btn> */}
        <Btn 
          onClick={handleTest}
          variant={!!response ? "outlined" : "contained"}  
          color="warning" size="small"
          >
            {!!response ? "clear" : "test"}
          </Btn> 
      </Grid>

    </Grid>

   {resource.method === 'GET' && <ValuesForm resource={resource} send={send} connectionChange={connectionChange}/>}
    {/* <pre>
      {JSON.stringify(rest,0,2)}
    </pre> */}
   </Layout>
 );
}
ResourceForm.defaultProps = {};
export default ResourceForm;
