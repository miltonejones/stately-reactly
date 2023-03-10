import React from 'react';
import { styled, Chip, Typography, Box } from '@mui/material';
import { AppRegistration, Save, Code } from "@mui/icons-material";
import { Launch } from "@mui/icons-material";
import { SettingsMenu } from "../..";
import { Nowrap, Btn, Flex, BorderButton, typeIcons, Spacer } from '../../../styled';

 
const Layout = styled(Box)(({ theme }) => ({
  minHeight: 52,
  margin: theme.spacing(0),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 1),
  borderBottom: 'solid 1px ' + theme.palette.divider,
}));

const AddressBar = styled(Box)(({ theme }) => ({
  border: 'solid 1px ' + theme.palette.divider,
  width: '100%',
  backgroundColor: theme.palette.grey[200],
  borderRadius: 20,
  margin: theme.spacing(0, 1),
  padding: theme.spacing(0.5, 2),
  // gap: theme.spacing(1),
  display: 'flex',
  alignItems: 'center'
}));

const B = styled('b')(({ theme }) => ({
  color: theme.palette.success.main
}))
 
const AppBar = ({ showJSON, send, state, routeProps, application, selectedPage = {}, active_machine, navigate }) => {
  const { parameters = {} } = selectedPage ?? {};
  const params = !!routeProps && Object.keys(routeProps).length ? routeProps : parameters;
  const paramKeys = Object.values(params).length 
    ? <>/<B>{Object.values(params).join('/')}</B></>
    : ""
  return (
   <Layout data-testid="test-for-AppBar">
     <AppRegistration />
     <Typography>Reactly</Typography>
     {!!application && (
      <>
        <Flex spacing={1} sx={{  p: 1 }}>
          <Chip onClick={() => navigate(`/edit/${application.path}`)} label={application.Name} color="primary" variant={!!selectedPage ? "filled" : "outlined"}/>
          <Typography variant="body2">Menu</Typography>
        </Flex>
        <Box onClick={() => navigate('/')}> {typeIcons.back}</Box>
        {/* [{JSON.stringify(routeProps)}] */}
        <AddressBar>
          <Nowrap width="fit-content" sx={{mr: 1}} bold variant="caption">URL</Nowrap>
          <Nowrap width="min-content" muted variant="body2">/app/{application.path}</Nowrap>
          {!!selectedPage && <Nowrap width="min-content" variant="body2">/{selectedPage.PagePath}{paramKeys}</Nowrap>}
          <Spacer />
          <Launch />
          <Nowrap width="min-content" variant="caption">Open</Nowrap>
        </AddressBar>

        {state.matches("edit") && <BorderButton 
          active={!!showJSON}
          onClick={() => {
            send({
              type: 'RESTATE',
              key: 'showJSON',
              value: !showJSON
            })
          }}
        ><Code /></BorderButton>}

       {!state.matches("edit") && <Btn variant="outlined" size="small" onClick={() => navigate(`/apps/edit/${application.ID}`)}>edit</Btn>}
        <Btn variant="contained" onClick={() => send('SAVE')} disabled={!application.dirty} size="small" endIcon={<Save />}>save</Btn>
        {/* <Btn variant="outlined" onClick={() => send('UNDO')} disabled={!application.dirty} size="small" >undo</Btn> */}
 
      </>)}

      {!application && <Spacer />}

      {/* <Nowrap width="fit-content">[{JSON.stringify(state.value)}]</Nowrap> */}

      <SettingsMenu value={active_machine} onChange={(value) => {
        send({
          type: 'RESTATE',
          key: 'active_machine',
          value
        })
      }}/>
   </Layout>
 );
}
AppBar.defaultProps = {};
export default AppBar;
