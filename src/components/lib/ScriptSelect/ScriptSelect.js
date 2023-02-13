import React from 'react';
import { styled, MenuItem, Box } from '@mui/material';
import { IconTextField, Pill  } from "../../../styled";
import { AppStateContext } from "../../../context"; 
import { ScriptModal } from '../..';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
 
const ScriptSelect = ({ value, label, onChange }) => {
  const { getApplicationScripts } = React.useContext(AppStateContext);
  const scriptList = getApplicationScripts()

  const getOptionLabel = (option) => {   
    if (option.PageName) {
      return option.PageName + "." + option.name;
    }
    return "application." + option.name; 
  }

   const script = scriptList?.find(f => f.ID === value); 
  return (
    <Layout data-testid="test-for-ScriptSelect">
      <IconTextField 
        startIcon={<Pill>Script</Pill>}
        helperText={label}
        select 
        fullWidth
        endIcon={<ScriptModal title={script?.name}>{script?.code}</ScriptModal>}
        size="small"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        >
        {scriptList.map(item => !!item && <MenuItem value={item.ID}>
          {getOptionLabel(item)}
        </MenuItem>)}
      </IconTextField>
     {/* <pre>
     {JSON.stringify(scriptList,0,2)}
     </pre> */}
   </Layout>
 );
}
ScriptSelect.defaultProps = {};
export default ScriptSelect;
