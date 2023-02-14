import React from 'react';
import { styled, Box, Divider, MenuItem, Stack, Collapse, Typography } from '@mui/material';
import { Btn, Flex, SectionHead, ButtonCard, Spacer, Pill, IconTextField } from "../../../styled";
import { AppStateContext } from "../../../context";
import { useEventHandler } from '../../../machines/eventHandlerMachine';
import ModalOpen from './handlers/ModalOpen/ModalOpen';
import ScriptRun from './handlers/ScriptRun/ScriptRun';
import SetState from './handlers/SetState/SetState';
import CloseConfirm from '../CloseConfirm/CloseConfirm';
import OpenLink from './handlers/OpenLink/OpenLink';
import { Add } from "@mui/icons-material";
import DataExec from './handlers/DataExec/DataExec';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));


const EventHandlerCard =  ({ event, action, onClick, modals, pageList, scriptList, resourceList, supportedEvents }) => {
  const supportedEvent = supportedEvents.find(e => e.name === event);
  const actions = {
    openLink: () => {
      const targetPage = pageList?.find(e => e.ID === action.target);
      const href = targetPage?.PageName || <>Deleted page</>
      return <>Open a link to "{href}"</>
    },
    scriptRun: () => {
      const script = scriptList?.find(f => f.ID === action.target);
      if (script) {
        if (script.PageName) {
          return <>Run script "<b>{script.PageName}.</b>{script.name}"</>
        }
        return <>Run script "<b>application.</b>{script.name}"</>
      }
      return 'Unknown script ' + action.target + ' was not found.'
    },
    dataExec: () => {
      const obj = resourceList.find(e => e.ID === action.target);
      if (obj) {
        return <>Execute <b>{obj.method}</b> request "{obj.name}"</>
      } 
      return <>Unknown data resource {action.target}</>
    },
    setState: () => {
      const label = action.value?.toString().split('|').join(' or ');
      return <Box>Set the value of "{action.target}" to <b>{label}</b></Box>
    },
    modalOpen: () => {
      const modal = modals?.find(f => f.ID === action.target);
      if (modal) {
        return <><b>{action.open ? "open" : "close"}</b> modal component "{modal.PageName||"application"}.{modal.ComponentName}"</>
      }
    },
  }

  const describe = actions[action.type];
  const description = !describe ? `Unknown action ${action.type}` : describe();

  return (
    <ButtonCard sx={{m: 1, p: 1, cursor: 'pointer'}} onClick={onClick}>
      <Stack> 
       <Typography variant="subtitle2">
        WHEN: {supportedEvent.description}
       </Typography>
       <Typography variant="caption">
        {description}
       </Typography>
      </Stack>
    </ButtonCard>
  );
}


const Actions = ({ value, onChange }) => {
  const context = React.useContext(AppStateContext);
  const scriptList = context.getApplicationScripts();
  const resources = context.application?.resources;
  const options = [
    {
      name: 'Set state value',
      value: 'setState', 
    },
    {
      name: 'Execute client script',
      value: 'scriptRun',
      when: () => !!scriptList?.length  
    } ,
    {
      name: 'Call a component method',
      value: 'methodCall', 
    } ,
    {
      name: 'Open or close a modal component',
      value: 'modalOpen'
    } ,
    {
      name: 'Link to page',
      value: 'openLink'
    } ,
    {
      name: 'Execute data resource',
      value: 'dataExec',
      when: () => !!resources?.length  
    },
    {
      name: 'Reset data resource',
      value: 'dataReset',
      when: () => !!resources?.length  
    },
    // {
    //   name: 'Refresh data resource',
    //   value: 'dataRefresh',
    //   when: () => !!resources?.length  
    // } 
  ] 

  return <IconTextField 
            fullWidth
            select
            label="Event action"
            startIcon={<Pill>Action</Pill>}
            value={value}
            onChange={e => {
              onChange(e.target.value)
            }}
            size="small" >

              {options.map(opt => <MenuItem value={opt.value}>{opt.name}</MenuItem>)}
            </IconTextField>
}

const EventEditCard = ({supportedEvents, handleChange, ...props}) => {
  const { action, event } = props;

  if (!action) return <i />

  const handlers = {
    modalOpen: ModalOpen,
    scriptRun: ScriptRun,
    setState: SetState,
    openLink: OpenLink,
    dataExec: DataExec
  };

  const Handler = handlers[action.type];

  const actionChange = (args) => {
    const updated = {
      ...action,
      ...args
    } 
    handleChange(props.ID, 'action', updated)
  }

  const supportedEvent = supportedEvents?.find(e => e.name === event);
  return (
    <Stack spacing={1}> 
      <IconTextField size="small" select value={event} 
      label="Event trigger"
      startIcon={<Pill>When</Pill>}
      onChange={e => {
        handleChange(props.ID, 'event', e.target.value)
      }}>
          {supportedEvents.map(e => <MenuItem value={e.name}>{e.description}</MenuItem>)}
      </IconTextField>

      {!!event && <Actions value={action.type} onChange={type => {
        actionChange({ type })
      }}/>} 
      {!!Handler && <Handler supportedEvent={supportedEvent} actionChange={actionChange} {...props}/>}
    </Stack>
  )
}
 
const EventHandlerList = ({ events, eventChanged, supportedEvents }) => {
  const handler = useEventHandler({
    eventsChanged: eventChanged
  });
  const context = React.useContext(AppStateContext);
  const modals = context.getApplicationModals();
  const scriptList = context.getApplicationScripts();
  const pageList = context.application?.pages;
  const resourceList = context.application?.resources;
  const handleChange = (ID, Key, Value) => {
    handler.send({
      type: 'CHANGE',
      ID,
      Key,
      Value
    })
  }


  if (!supportedEvents?.length) {
    return <i />
  }
  
  return (
    <Layout>

      <Collapse in={handler.state.matches("confirm")}>
        <CloseConfirm allowSave send={handler.send} />
      </Collapse>
  
      <Collapse in={handler.state.matches("editing")}>
        <>
          <EventEditCard {...handler.eventProp} handleChange={handleChange} supportedEvents={supportedEvents}/>

          <Divider sx={{ pt: 1 }} />

          <Flex sx={{ pt: 1 }} spacing={1}>
            <Spacer />
            <Btn size="small" variant="outlined" onClick={() => {
              handler.send('CLOSE')
            }}>
              back 
            </Btn>
            <Btn size="small" variant="contained" 
              disabled={!handler.dirty}
              onClick={() => {
              handler.send('SAVE')
            }}>
              save 
            </Btn>
          </Flex> 
        </>
      </Collapse>
    
      {!!events && (
        <Collapse in={handler.state.matches("ready")}> 
          <SectionHead> 
            <Spacer />
            <Btn 
            endIcon={<Add />}
            onClick={() => {
              handler.send({
                type: 'EDIT',
                eventProp: {action:{}}
              })
            }}>add event mapping</Btn>
          </SectionHead>

            {events.map(e => (
              <EventHandlerCard 
                {...e} 
                key={e.ID} 
                onClick={() => {
                  handler.send({
                    type: 'EDIT',
                    eventProp: e
                  })
                }}
                supportedEvents={supportedEvents} 
                resourceList={resourceList}
                scriptList={scriptList}
                pageList={pageList}
                modals={modals}
              />))}   
        </Collapse>
      )} 
    </Layout>
 );
}
EventHandlerList.defaultProps = {};
export default EventHandlerList;
 