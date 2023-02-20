import React from 'react';
import { Box } from '@mui/material';
import { 
  SettingsPanel, 
  AppSettings, PageSettings
} from "../..";
  
 
const RightPanel = (props) => {
  const {selectedComponent, selectedPage } = props;
  if (!selectedPage && !selectedComponent) {
    return <AppSettings {...props}/>
  }
  if (!selectedComponent) {
    return <PageSettings {...props}/>
  }
 return (
  <Box>
    <SettingsPanel {...props} component={selectedComponent} />
  </Box>
 );
}
RightPanel.defaultProps = {};
export default RightPanel;
