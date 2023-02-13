import React from 'react';
import { styled, Box, Card } from '@mui/material';
import { TinyButton }  from '../../../styled';
 
const Layout = styled(Card)(({ theme }) => ({
  display: 'flex',
  borderRadius: 4,
  padding: theme.spacing(0.5, 1), 
  backgroundColor: theme.palette.grey[200],
  fontSize: '0.9rem', 
  gap: theme.spacing(0.25),
  margin: theme.spacing(0),
  '--menu-width': 0,
  '&:hover': {
    '--menu-width': '60px',
  }
}));
 
const Submenu = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.25),
  width: 'var(--menu-width)' ,
  transition: 'all 0.2s linear',
  overflow: 'hidden'
}));
 
const ComponentInfoChip = ({ component, library }) => {
  if (!component) {
    return <i />
  }
  const icon =  library[component.ComponentType].Icon
  return (
    <Layout data-testid="test-for-ComponentInfoChip"> 
        <TinyButton icon={icon} />
        {component.ComponentName}  
        <Submenu>
          <TinyButton icon="CopyAll" />
          <TinyButton icon="Delete" />
          <TinyButton icon="Input" />
        </Submenu>
        <TinyButton icon="Close" />
    </Layout>
  );
}
ComponentInfoChip.defaultProps = {};
export default ComponentInfoChip;
