import React from 'react';
import { styled, Box } from '@mui/material';
import { TabButton, TabList, Json } from "../../../styled"; 
import {  
  EditForm
} from "../..";
import EventHandlerList from '../EventHandlerList/EventHandlerList';  
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const AppSettings = (props) => {
  const { send, selectedType = 0 } = props;
  return (
    <Layout data-testid="test-for-AppSettings">

      <TabList sx={{mb: 2}} value={selectedType} onChange={(e,n) => {
          send({
            type: "RESTATE",
            key: 'selectedType',
            value: n
          })
        }}> 
        <TabButton label={`Settings`} /> 
        <TabButton label={`Events`} />
        <TabButton label={`JSON`} />
      </TabList>

      {selectedType === 0 && <EditForm application={props.application} send={send} />}


      {selectedType === 1 && (<Box sx={{p:1}}>
        <EventHandlerList 
          eventChanged={event => {
            const { events = [] } = props.application;
            const existing = events.find(e => e.ID === event.ID);
            const eventList = existing ? events.map(e => e.ID === event.ID ?  event  : e) : events.concat(event);
            send({
              type: "APPCHANGE",
              key: 'events',
              value: eventList
            })
          }}  
          supportedEvents={appEvents}  
          events={props.application.events}
          /> 
        </Box>)}


      {selectedType === 2 && <Json>
          {JSON.stringify(props.application,0,2)}
        </Json>} 

    </Layout>
  );
}
AppSettings.defaultProps = {};
export default AppSettings;

const appEvents =  [
  {
    name: 'onApplicationLoad',
    title: 'Application loads',
    description: 'Application finishes loading.'
  },  
]

