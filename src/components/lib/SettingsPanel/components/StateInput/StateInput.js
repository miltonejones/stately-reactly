import React from 'react';
import { MenuItem } from '@mui/material';
import { LinkOff } from "@mui/icons-material"; 
import { IconTextField, Flex, TinyButton, Nowrap } from "../../../../../styled";
import { ScriptModal, ConfirmPopover } from "../../../..";
 
 
const StateInput = ({ application, component, send, selectedPage, value, handleScript, handleBind, label, title }) => {

  let boundCode = {};
  if (typeof value === 'string') {
    const [scope, id] = value?.split('.');
    if (scope === 'scripts') {
      const script = component.scripts?.find(f => f.ID === id);
      if (script) {
        Object.assign(boundCode, {
          code: script.code,
          id
        }) 
      }
    }
  }

  const endIcon = !!boundCode.code 
    ? <ScriptModal 
        offset={0}
        onChange={(js) => {
         !!js && handleScript(boundCode.id, `${label}_transformer`,  js)
        }} 
        title={`${label} transformer`}>{boundCode.code}</ScriptModal>
    : <LinkOff sx={{cursor: 'pointer', mr: 3 }} onClick={() => handleBind(label, null, true)} />;
  return (  
    <>
  <Flex>
  <Nowrap variant="caption">Bind <b>{title}</b> to client {!boundCode.code ? "variable" : "script"}:</Nowrap>
  <ConfirmPopover message={`Remove "${title}" binding?`}
     onChange={ok => {
      !!ok && handleBind(label, null, true);
    }} 
    ><TinyButton icon="Delete" /></ConfirmPopover>
  </Flex>
  <IconTextField
    size="small"
    onChange={e => handleBind(label, e.target.value)}
    value={boundCode.code || value}
    endIcon={endIcon}
    disabled={!!boundCode.code}
    select={!boundCode.code}
    > 
    {selectedPage?.state?.map(s => <MenuItem value={s.Key}>{s.Key}</MenuItem>)}
    {application.state?.map(s => <MenuItem value={`application.${s.Key}`}>application.{s.Key}</MenuItem>)}
  </IconTextField> </>
)
}
StateInput.defaultProps = {};
export default StateInput;
