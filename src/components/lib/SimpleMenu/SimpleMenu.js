import React from 'react';
import { styled, Menu, MenuItem, Box } from '@mui/material';
import { useMenu } from "../../../machines";
import { typeIcons, Flex } from "../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const SimpleMenu = ({ onChange, children, caret, options, value }) => {
  const menu = useMenu(onChange);
  const open = !!menu.anchorEl;
  return (
    <Layout> 
      <Flex spacing={1} onClick={menu.handleClick}  >{children} {!!caret && <>{typeIcons[open?'up': 'down']}</>}</Flex>
      <Menu 
        onClose={menu.handleClose()}
        anchorEl={menu.anchorEl} 
        open={!!menu.anchorEl}
        value={value}
      >

    {options.map((option) => <MenuItem 
      onClick={ menu.handleClose(option.id || option)} 
      key={option.id || option} value={option.id || option}>
        <Flex spacing={1} bold={value === (option.id || option)}>
        {option.icon}<Box>{option.label || option}</Box>
        </Flex>
      </MenuItem>)}
      </Menu>

    </Layout>
  );
}
SimpleMenu.defaultProps = {};
export default SimpleMenu;
