import React from 'react';
import { styled,  Box } from '@mui/material';
import { TabButton, TabList, Json } from "../../../styled"; 
import { EditorStateContext } from "../../../context";  
import { useComponent } from "../../../machines";  
import EventHandlerList from '../EventHandlerList/EventHandlerList';  
import SettingsSection from './components/SettingsSection/SettingsSection';
 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
  
 
const SettingsPanel = (props) => {
  const { library, component, send, pageID, selectedType = 0 } = props;


  const handler =  useComponent({
    component,
    onChange: (object) => {
      send({
        type: 'CHANGE',
        group: 'components',
        object,
        pageID
      }) 
    }
  })

  const handleChange = (key, val, node) => {
    handler.send({
      type: 'CHANGE',
      Key: key,
      Value: val,
      node
    })
  }

  const handleAdd = (attribute) => {
    handler.send({
      type: 'ADDSCRIPT',
      attribute
    })
  }

  const handleScript = (ID, name, code) => {
    handler.send({
      type: 'SCRIPT',
      ID, name, code
    })
  }

  const handleBind = (key, val, unbind) => {
    handler.send({
      type: 'BIND',
      Key: key,
      Value: val,
      unbind
    })
  }


  if (!component) {
    return <i />
  }

  const componentConfig = library[component.ComponentType];
  const configTypes = ['Settings','Styles','Events'];
  const configType = configTypes[selectedType]

  const visibility = {
    name: 'Visibility',
    settings: [
      {
        label: 'invisible',
        title: 'Hide component',
        type: 'boolean',
        order: -5
      },
      {
        label: 'visible',
        title: 'Show component',
        type: 'boolean',
        order: -4
      }
    ]
  }

  const support = {
    name: 'Debugging',
    settings: [
      {
        label: 'debug',
        title: 'debug mode',
        type: 'boolean',
        order: -105
      }
    ]
  }
 
 return (
  <EditorStateContext.Provider
    value={{
      handleChange,
      handleAdd,
      handleScript,
      handleBind
    }}
    >
   <Layout>
{/* {JSON.stringify(handler.state.value)} */}
      <TabList sx={{mb: 2}} value={selectedType} onChange={(e,n) => {
        send({
          type: "RESTATE",
          key: 'selectedType',
          value: n
        })
      }}> 
        <TabButton label={`Settings`} />
        <TabButton label={`Styles`} />
        <TabButton label={`Events`} />
        <TabButton label={`JSON`} />
      </TabList>


    {!!componentConfig[configType] && (<> 
      {componentConfig[configType].categories && 
        componentConfig[configType].categories
        .concat(configType === 'Settings' ? [visibility, support] : [])
        .map(cat => (
        <SettingsSection 
          handleBind={handleBind} 
          handleScript={handleScript} 
          handleChange={handleChange} 
          handleAdd={handleAdd}
          key={cat.name} 
          configType={configType}
          {...cat} 
          {...props} 
        />))}
    </>)}

    {selectedType  === 2 && (<Box sx={{p:1}}>
      <EventHandlerList 
        supportedEvents={componentConfig.Events}  
        events={component.events}/> 
      </Box>)}

    {selectedType  === 3 && <Json>
        {JSON.stringify(component,0,2)}
      </Json>} 

   </Layout>
   </EditorStateContext.Provider>
 );
}
SettingsPanel.defaultProps = {};
export default SettingsPanel;
