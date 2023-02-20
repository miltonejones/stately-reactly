import React from 'react';
import { styled, Stack, Box, Drawer, Typography, LinearProgress, Collapse, IconButton} from '@mui/material';
import { AppStateContext } from "../../../../context";
import { DrawerMenu } from "../../.."; 
import { Flex, Nowrap, TinyButton, Btn, SectionHead, Spacer } from "../../../../styled"; 
import { Close } from "@mui/icons-material";
import ConfirmPopover from '../../ConfirmPopover/ConfirmPopover';
import ResourceForm from './components/ResourceForm/ResourceForm';
import ColumnList from './components/ColumnList/ColumnList';
import { CloseConfirm, EventHandlerList } from '../../..';
import { handleObjectChange } from '../../../../util/handlers';
import ConnectionForm from './components/ConnectionForm/ConnectionForm';
import { useDataExecute } from '../../../../machines/dataExecuteMachine';
import ColumnTree from './components/ColumnTree/ColumnTree';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  minHeight: '60vh'
}));

const SplitBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  transition: 'all 0.2s linear',
  gridTemplateColumns: '1fr 30% 1fr 1fr'
 }));
 
 const supportedEvents =  [
  {
    name: 'dataLoaded', 
    title: 'data loads',
    description: 'Data finishes loading.'
  }, 
  {
    name: 'loadStarted', 
    title: 'data starts loading',
    description: 'Data starts loading.'
  }, 
]


 const ConnectionTree = ({ connections, connection, resource, resources, send }) => {
  if (!connections) {
    return <i />
  }
  return <Stack>
    {connections 
      .map(conn => (<Collapse in={!connection || conn.ID === connection.ID}>

      <Flex onClick={() => {
        send({
          type: 'EDITCONNECTION',
          ID: conn.ID
        })
      }}><Nowrap hover variant="body2" bold={conn.ID === connection?.ID}>{conn.name}</Nowrap>
      </Flex>

        {conn.ID === connection?.ID && resources
          .filter(res => res.connectionID  === conn.ID)
          .map(res => (<>
          <Flex onClick={() => {
            send({
              type: 'EDITRESOURCE',
              ID: res.ID
            })
          }} sx={{pl: 2}} spacing={1}>
            <Typography variant="caption"><b>{res.method}</b></Typography>
          <Nowrap hover variant="body2" bold={res.ID === resource?.ID}>{res.name}</Nowrap>
            </Flex>
        </>))}
    </Collapse>))}
  </Stack>
 }
 
const ConnectionDrawer = () => {
  const context = React.useContext(AppStateContext);
  const exec = useDataExecute({
    appProps: context.appProps,
    pageProps: context.pageProps,
    onComplete: console.log
  })
  const connectionChange = handleObjectChange(context.connectionPane)
  const handleClose = () => { 
    context.connectionPane.send('EXIT')
  }
  const handleTest = () => {
    const { resource, connection } = context.connectionPane;
    const { values: terms } = resource;
    // alert (JSON.stringify(resource))
    exec.send({
      type: !!exec.response ? 'CLEAR' : 'TEST',
      resource,
      connection,
      terms
    })
  }

  const toggleColumn = field => {
    const { resource } = context.connectionPane;
    const { columns } = resource;

    connectionChange(resource.ID, 'columns', 
    columns.find(c => c === field)
     ? columns.filter(c => c !== field)
     : columns.concat(field) 
     );
  }


  const { state, send, dirty } = context.connectionPane;
  const { events } = context.connectionPane.resource ?? {};
 return (
    <Drawer onClose={handleClose}  open={context.connectionPane.open} anchor="bottom">
   <Layout data-testid="test-for-ConnectionDrawer">


    <SectionHead nopadding>

      <Box>
        Data resources 
      </Box>

      <ConfirmPopover message={`Add connection`} 
        prompt="Newstate"   >
        <Btn endIcon={<TinyButton icon="Add" /> }>add connection</Btn> 
      </ConfirmPopover>

      <Spacer />
      <DrawerMenu wide onClose={handleClose}/>
      <IconButton onClick={handleClose} >
        <Close />
      </IconButton>

    </SectionHead>

    {exec.state.matches ("execute") && <>
    <LinearProgress />
    {JSON.stringify(exec.state.value)}
    </>}


    <SplitBox>
      <SectionHead> 
        connections
        <Spacer />
        {state.matches('opened.connection_edit.idle') && <TinyButton onClick={() => send('CLOSE')} icon="Close" />} 
      </SectionHead>

      <SectionHead> 
        edit {state.matches('opened.connection_edit.idle') ? "connection" : "resource"}
        <Spacer />
          {state.matches('opened.connection_edit') && (<>
            {dirty && <TinyButton onClick={() => send('SAVE')} icon="Save" />} 
            <TinyButton onClick={() => send('CLOSE')} icon="Close" />
          </>)}  
      </SectionHead>

      <SectionHead> 
        {!exec.response ? "selected columns" : "choose columns"}  
      </SectionHead>

      <SectionHead> 
        {!!exec.response ? "selected columns" : "events"} 
      </SectionHead> 

      <ConnectionTree 
        send={context.connectionPane.send}
        resource={context.connectionPane.resource}
        connection={context.connectionPane.connection}
        connections={context.connectionPane.connectionProps}
        resources={context.connectionPane.resourceProps}
        /> 

      {['opened.connection_edit.confirm','opened.confirm'].some(state.matches) && (<>
        <CloseConfirm  send={send}/>
      </>)}

      {state.matches('opened.connection_edit.idle') && (<>
        <ConnectionForm connectionChange={connectionChange} send={send} connection={context.connectionPane.connection} />
      </>)}

    {state.matches('opened.connection_edit.resource_edit') && (<>
      <ResourceForm handleTest={handleTest} response={exec.response} connectionChange={connectionChange} send={send} resource={context.connectionPane.resource} />
      {!!exec.response && <Box>
        <ColumnTree 
            resource={context.connectionPane.resource}
            onAddProp={toggleColumn}
             nodes={exec.response} />
        </Box>}
       <ColumnList connectionChange={connectionChange} send={send} resource={context.connectionPane.resource}/>
      {!exec.response &&<EventHandlerList 
        supportedEvents={supportedEvents} 
        eventChanged={event => {
          const existing = events.find(e => e.ID === event.ID);
          const eventList = existing ? events.map(e => e.ID === event.ID ?  event  : e) : events.concat(event);
          connectionChange(context.connectionPane.resource.ID, 'events', eventList);
        }}  
        events={events}/>}
    </>)} 

    </SplitBox>
 
   </Layout>
   </Drawer>
 );
}
ConnectionDrawer.defaultProps = {};
export default ConnectionDrawer;
