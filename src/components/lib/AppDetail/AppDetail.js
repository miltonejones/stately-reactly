import React from 'react';
import {  
  Card,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  Stack,
  MenuItem,
  TextField,
  Box
} from '@mui/material';
import { typeIcons, TabButton, TabList } from '../../../styled';

const DetailList = ({ title, options, ...props }) => {
  const openKey = `${title}_open`;
  const visible = options.slice(0, 3);
  const more = options.slice(3);
  const open = !!props[openKey];

  return (
    <List
      dense
      subheader={<Typography variant="body1">{title}</Typography>}
      sx={{
        width: '100%',
        maxWidth: 'calc(100vw - 32px)',
        bgcolor: 'background.paper',
        mb: 2,
      }}
    >
      {visible.concat(open ? more : []).map((option, value) => (
        <ListItem
          sx={{ borderBottom: 1, borderColor: 'divider', cursor: 'pointer' }}
          key={value}
          disableGutters
          secondaryAction={
            <IconButton aria-label="comment">{typeIcons.more}</IconButton>
          }
        >
          <ListItemText {...option} />
        </ListItem>
      ))}
      {!!more.length && (  <ListItem
          onClick={() => {
            props.send({
              type: 'RESTATE',
              key: openKey,
              value: !props[openKey]
            })
          }} 
          sx={{ borderBottom: 1, borderColor: 'divider', cursor: 'pointer' }} 
          disableGutters 
        >
          <ListItemText primary={<>
            Show {more.length} more {title.toLowerCase()} {typeIcons[open ? 'up' : 'down']}
          </>}/>
        </ListItem>)}
    </List>
  );
};

const EditForm = ({ application, send }) => {
  return <Card sx={{p: 2, maxWidth: 360}}>

    <Stack spacing={1}>
    <Typography variant="body1">Settings</Typography>
      <TextField 
        size="small"
        label="Name"
        autoComplete="off"
        value={application.Name}
        onChange={e => {
          send({
            type: 'CHANGE',
            key: 'Name',
            value: e.target.value
          })
        }}
      />
      <TextField 
        size="small"
        label="Photo"
        autoComplete="off"
        value={application.Photo}
        onChange={e => {
          send({
            type: 'CHANGE',
            key: 'Photo',
            value: e.target.value
          })
        }}
      />
      <TextField 
        size="small"
        label="HomePage"
        autoComplete="off"
        value={application.HomePage}
        select
        onChange={e => {
          send({
            type: 'CHANGE',
            key: 'HomePage',
            value: e.target.value
          })
        }}
      >
        {application.pages.map(page => <MenuItem value={page.ID} key={page.ID}>{page.PageName}</MenuItem>)}
      </TextField>
    </Stack>

  </Card>
}

export default function AppDetail({ application, ...props }) {
  const { send, selectedTab = 0 } = props;
  if (!application.pages) {
    return <pre>{JSON.stringify(application, 0, 2)}</pre>;
  }
  const connectionItems = application.connections?.map((connection) => ({
    primary: connection.name,
    secondary: connection.root,
  }));
  const pageItems = application.pages.map((page) => ({
    primary: page.PageName,
    secondary: page.PagePath,
  }));
  const resourceItems = application.resources?.map((resource) => ({
    primary: resource.name,
    secondary: `${resource.method} - ${resource.path}`,
  }));
  return (
    <Box sx={{p: 2}}>
      {/* <Typography>{application.Name }</Typography>

      <Button onClick={() => send('CLOSE')}>close</Button> */}
      <TabList sx={{mb: 2}} value={selectedTab} onChange={(e,n) => {
        send({
          type: "RESTATE",
          key: 'selectedTab',
          value: n
        })
      }}>
        <TabButton label="All" />
        <TabButton label={`Connections (${connectionItems?.length})`} />
        <TabButton label={`Resources (${resourceItems?.length})`} />
        <TabButton label={`Pages (${pageItems?.length})`} />
        <TabButton label={`Settings`} />
      </TabList>


      {!!connectionItems && <Collapse in={selectedTab === 0 || selectedTab === 1}>
      <DetailList options={connectionItems} title="Connections" {...props}/>
      </Collapse>}
      
     {!!resourceItems && <Collapse in={selectedTab === 0 || selectedTab === 2}>
      <DetailList options={resourceItems} title="Resources" {...props}/>
      </Collapse>}
      
     {!!pageItems && <Collapse in={selectedTab === 0 || selectedTab === 3}>
      <DetailList options={pageItems} title="Pages" {...props}/>
      </Collapse>}
    
      <Collapse in={selectedTab === 4}>
      <EditForm application={application} {...props}/>
      </Collapse>
      {/* <pre>{JSON.stringify(application, 0, 2)}</pre> */}
    </Box>
  );
}
