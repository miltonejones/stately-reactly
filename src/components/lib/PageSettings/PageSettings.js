import React from 'react';
import { styled, Box, Card, Stack, MenuItem, TextField } from '@mui/material';
import { Spacer, TabButton, TabList, Json, SectionHead, TinyButton, Columns } from "../../../styled";  
import EventHandlerList from '../EventHandlerList/EventHandlerList';  
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

export const PageForm = ({ application, page, send }) => {
  return <Card sx={{p: 2, m: 1}}>

  <Stack spacing={1}>
    <SectionHead>Page Settings</SectionHead> 
    <TextField 
      size="small"
      label="Name"
      autoComplete="off"
      helperText={<>
      Path: <em>{page.PagePath}</em>
      </>}
      value={page.PageName}
      onChange={e => {
        send({
          type: 'PAGECHANGE',
          key: 'PageName',
          value: e.target.value,
          pageID: page.ID 
        });
      }}
    /> 

    <TextField 
      size="small"
      label="Parent Page"
      autoComplete="off"
      value={page.pageID}
      select
      onChange={e => {
        send({
          type: 'PAGECHANGE',
          key: 'pageID',
          value: e.target.value
        })
      }}
    >
      {application.pages.map(page => <MenuItem value={page.ID} key={page.ID}>{page.PageName}</MenuItem>)}
    </TextField>

    <SectionHead>Path Parameters

      <Spacer />
      <TinyButton icon="Add"/>
    </SectionHead>
    {!!page.parameters && <>
    <Columns columns="30% 1fr 32px">
      {Object.keys(page.parameters).map(param => <>
        <Box>{param}</Box>
        <TextField 
          label="Default value"
          size="small"
          autoComplete="off"
          value={page.parameters[param]}
        /> 
        <TinyButton icon="Delete" />
      </>)}
    </Columns>
    </>}
  </Stack>

</Card>
}
 
const PageSettings = (props) => {
  const { send, selectedType = 0,  selectedPage } = props;
  return (
    <Layout data-testid="test-for-PageSettings">
    {/* {JSON.stringify(delegate.state.value)}
    {JSON.stringify(delegate.event_index)}--
    {JSON.stringify(delegate.events?.length)} */}
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

      {selectedType === 0 && <PageForm application={props.application} page={selectedPage} send={send} />}


      {selectedType === 1 && (<Box sx={{p:1}}>
        <EventHandlerList 
          eventChanged={event => {
            // const { events = [] } = selectedPage;
            // const existing = events.find(e => e.ID === event.ID);
            // const eventList = existing ? events.map(e => e.ID === event.ID ?  event  : e) : events.concat(event);
            send({
              type: 'CHANGE',
              group: 'events',
              object: event,
              pageID: selectedPage.ID
            }) 

            // send({
            //   type: "APPCHANGE",
            //   key: 'events',
            //   value: eventList
            // })
          }}  
          supportedEvents={pageEvents}  
          events={selectedPage.events}
          /> 
        </Box>)}


      {selectedType === 2 && <Json>
          {JSON.stringify(selectedPage,0,2)}
        </Json>} 


    </Layout>
  );
}
PageSettings.defaultProps = {};
export default PageSettings;

const pageEvents =  [
  {
    name: 'onPageLoad',
    title: 'Page loads',
    description: 'Page finishes loading.'
  },  
]
