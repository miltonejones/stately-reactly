import React from 'react';
import { styled, Stack, IconButton, Box } from '@mui/material';
import { AppStateContext } from "../../../../context";
import { TabList, TabButton, Spacer, TinyButton, Columns, Nowrap, Flex, Json, Btn } from "../../../../styled";
import { objectPath } from "../../../../util/objectPath";
import { camelize } from '../../../../util/camelize';
import SectionHead from '../../../../styled/SectionHead';
import ConfirmPopover from '../../ConfirmPopover/ConfirmPopover';
import BacklessDrawer from '../../../../styled/BacklessDrawer';
import { DrawerMenu } from "../../.."; 
import { Close } from "@mui/icons-material";
import moment from "moment";
import Check from '../../../../styled/Check';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  minHeight: '40vh'
}));
 

const ObjectList = ({ object, onChange }) => {
  if (!object) return <i />
  return (
    <Box>
    {Object.keys(object).map(key => <Flex key={key}>
      <Check on={typeof object[key] === 'object'} />
      <Nowrap
      onClick={() => onChange({
        [key]: object[key]
      })}
      small bold={typeof object[key] === 'object'} hover={typeof object[key] === 'object'}>{key}</Nowrap>
      <Nowrap small>{JSON.stringify(object[key])}</Nowrap>
    </Flex>)}
    </Box>
  )
}

const LogItem = ({ plain, item, selectedOption, onChange }) => {
  const { stamp, ID, message: msg, label, param, options } = item;
  let message = msg;
  const stamp_formatted = !stamp
    ? "0:00"
    : moment.utc(stamp).format("mm:ss");

  
  if (message.indexOf('%s') > -1) {
    message = message.replace('%s', param || 'unknown param');
  }
  if (message.indexOf('%d') > -1) {
    message = message.replace('%d', param);
  }
  if (message.indexOf('%c') > -1 && typeof label === 'string') {
    const sx = label.split(';').reduce((out, sel) => {
      const [key,val] = sel.split(":");
      out[camelize(key)] = val;
      return out;
    }, {});
    const [left, right] = message.split('%c');
    message = <Flex spacing={1}><Box>{left}</Box>{" "}<Box sx={sx}>{right}</Box></Flex>
  }
  return  ( 
      <Box  onClick={() => onChange(ID, msg)}  
      sx={{
        color: "white", 
        fontFamily: 'Courier New',
        borderBottom: plain ? 0 : 1,  
        borderColor: '#505050', 
        backgroundColor: selectedOption === ID ? '#252' : '#222', 
        fontSize: '0.85rem',
        p: t => t.spacing(0.5, 1), 
        width: 'calc(100% - 12px)',
        display: 'flex',
        whiteSpace: 'nowrap'
      }}
    ><Box sx={{color: '#909090', mr: 2}}>{stamp_formatted}</Box>{" "}
    <Box  sx={{mr: 2}}>{message}</Box> 
 
    {!!options?.length && !plain && <>
      <TinyButton sx={{ml: 2}} color="inherit" icon={selectedOption === ID ? "KeyboardArrowDown" : "KeyboardArrowRight"} />
      <em>{"{"}Array({options.length}){"}"}</em>
    </>}
   </Box>   

   )
}
 
const MachineDrawer = () => {
  const reactly = React.useContext(AppStateContext); 
  const { state, appProps, registrar, stateProps } = reactly;
  const { selectedTab, send, maxitems, selectedProp, selectedOption } = registrar;
  const option = registrar.logitems.find(f => f.ID === selectedOption); 

  const columns = registrar.state.matches('opened.view_state')
    ? "30% 40% 1fr"
    : (registrar.state.matches('opened.view_log') 
        ? "30% 1fr 40%"
        : "50% 50%"
        );
  
 return (
  <BacklessDrawer open={registrar.open} anchor="bottom" onClose={() => send('CLOSE')}>
    <Layout data-testid="test-for-MachineDrawer">
      <SectionHead>

      Current state: "{objectPath(state.value)}"  - "{objectPath(registrar.state.value)}"  

      <ConfirmPopover 
        message={`Set max items`} 
        prompt={maxitems}    
        onChange={val => {
          !!val && send({
            type: 'RESTATE',
            key: 'maxitems',
            value: val
          }); 
        }}
        >
        <Btn endIcon={<TinyButton icon="Settings" /> }>Max items: {maxitems}</Btn> 
      </ConfirmPopover>


      <Spacer />
      <DrawerMenu wide onClose={() => send('CLOSE')}/>
      <IconButton onClick={() => send('CLOSE')} >
        <Close />
      </IconButton>



      </SectionHead>
      {/* {JSON.stringify(state.value)} */}


      <Columns columns={columns} sx={{alignItems: 'flex-start',maxHeight: 500, overflow: "hidden"}}>
        <Box >

        <Flex sx={{width: '100%'}} spacing={1}>State


          <TabList sx={{mb: 2}} value={selectedTab} onChange={(e,n) => {
            send({
              type: "RESTATE",
              key: 'selectedTab',
              value: n
            })
          }}>
            <TabButton label={`Application`} />
            <TabButton label="Page" /> 
          </TabList>
 

        </Flex>

          <Box sx={{maxHeight: 456, overflow: 'auto', p: 1}}>
            <ObjectList object={selectedTab === 0 ? appProps : stateProps} 
                onChange={(n) => {
                  send({
                    type: "STATE",
                    prop: n
                  })
                }}/> 
          </Box>
        </Box>

        {registrar.state.matches("opened.view_state") && <Box>
          <SectionHead>State value

            <Spacer />
            <TinyButton icon="Close" onClick={() => send('EXIT')} />
          </SectionHead>
          {!!selectedProp && <Box sx={{ border: 1, borderColor: 'divider', m: t => t.spacing(1,0), height: 456, overflow: 'auto', p: 1}}><Json>
            {JSON.stringify(selectedProp,0,2)}
          </Json></Box>}
          </Box>}

        <Box>
          <SectionHead>Log</SectionHead>
        <Stack sx={{ backgroundColor: '#222' , height: 480, overflow: 'auto', p: 1}}>
          
            {registrar.logitems.map((h, i) => (
              <LogItem 
                selectedOption={selectedOption}
                onChange={(n) => {
                  send({
                    type: "VIEW",
                    ID: n
                  })
                }}
              item={h} 
              key={i}
              />
              ))} 
          
        </Stack>

        </Box>
     {registrar.state.matches("opened.view_log") &&   <Box>
          <SectionHead>Log entry "{selectedOption}"
          <Spacer />
          <TinyButton icon="Close" 
                onClick={(n) => {
                send('EXIT')
              }}/>
          </SectionHead>
        <Flex sx={{mt: 1}}>
          <Box  sx={{  backgroundColor: '#222' , p: 1, width: '99%', mr: 2, borderRadius: 2}}>
            <LogItem plain item={option} />
          </Box>
      
        </Flex>
         <Box sx={{  height: 400, overflow: 'auto', width: '100%' }}>
         {!!option.options?.length && <Json>
          {JSON.stringify(option.options,0,2)}
          </Json>} 
         </Box>
        </Box>}
      </Columns>
 
    </Layout>
  </BacklessDrawer>
 );
}
MachineDrawer.defaultProps = {};
export default MachineDrawer;
