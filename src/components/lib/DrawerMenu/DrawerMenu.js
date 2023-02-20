import React from 'react';
import { styled, Stack } from '@mui/material';
import {  Gamepad, RecentActors, Code, AutoStories } from "@mui/icons-material";
import { BorderButton} from "../../../styled";
import { AppStateContext } from "../../../context";
 
const Layout = styled(Stack)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const DrawerMenu = ({ wide, onClose }) => {
  const context = React.useContext(AppStateContext);
  const drawerMenuItems =  {
    code: {
      icon: <RecentActors />,
      machine: context.clientStatePane, 
    },
    state: {
      icon: <Code />, 
      machine: context.clientScriptPane, 
    },
    connect: {
      icon: <AutoStories />, 
      machine: context.connectionPane, 
    }, 
    registrar: {
      icon: <Gamepad />, 
      machine: context.registrar, 
    }, 
  };
 return (
   <Layout direction={wide ? 'row' : 'column' }>
      {Object.keys(drawerMenuItems).map((ico) => (
        <BorderButton disabled={drawerMenuItems[ico].machine.state.matches('opened')} onClick={() => {
          onClose && onClose()
          drawerMenuItems[ico].machine.send('OPEN');
        }} key={ico} color="inherit">
          {drawerMenuItems[ico].icon}
        </BorderButton>
      ))} 
   </Layout>
 );
}
DrawerMenu.defaultProps = {};
export default DrawerMenu;
