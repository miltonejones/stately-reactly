import React from 'react'; 
import { Stack, Switch, MenuItem } from '@mui/material';
import { Flex, ChipTextField, IconTextField, Nowrap, PillMenu, TextIcon, IconSelect } from "../../../../../styled";
import BindMenu from '../BindMenu/BindMenu';
import StateInput from '../StateInput/StateInput'; 
import ListTableInput from '../ListTableInput/ListTableInput';
import RepeaterInput from '../RepeaterInput/RepeaterInput';
import ListBuilderInput from '../ListBuilderInput/ListBuilderInput';
  
 
function SettingsInput ({ component, setting, pageID, handleBind, handleAdd, handleChange, configType, ...props }) { 

  const configParent = configType.toLowerCase(); 
  const handleInputChange = (key, value) => handleChange(key, value, configParent)

  if (!component[configParent]) {
    return <>TBD</>
  } 

  // find the setting this element should display
  const option = component.settings?.find(s  => s.SettingName === setting.label)
  const style = component.styles?.find(s  => s.Key === setting.label)

  // set types for option inputs
  const types = setting.type === 'boolean' 
    ? ["true","false"]
    : setting.types;

  // look for any bindings attached to this value
  const binding = component.boundProps?.find(b => b.attribute === setting.label); 
  const inputProp = configType === "Styles" ? style?.Value : option?.SettingValue; 

  const TextInput = setting.type === 'chip' ? ChipTextField : IconTextField;

  // display BOUND values when bindings are present
  if (binding) {
    return <> 
      <StateInput 
        component={component} 
        {...props} 
        handleBind={handleBind}
        title={setting.title} 
        label={setting.label} 
        value={binding.boundTo} 
      />
    </>
  }

  if ('listbuilder' === setting.type) {
    return <ListBuilderInput 
              onChange={e => handleInputChange(setting.label, e)}
              component={component} 
              setting={setting} 
              {...props} 
              value={inputProp} />
  }
  
  if ('repeatertable' === setting.type) {
    return <RepeaterInput 
              onChange={e => handleInputChange(setting.label, e)}
              component={component} 
              setting={setting} 
              {...props} 
              value={inputProp} />
  }
  
  if ('listtable' === setting.type) {
    return <ListTableInput 
              onChange={e => handleInputChange(setting.label, e)}
              component={component} 
              setting={setting} 
              {...props} 
              value={inputProp} />
  }
  
  // PILL input type
  if (setting.type === 'pill') {
    return <Flex>  
      <Nowrap variant="caption">{setting.title}</Nowrap>
      <PillMenu 
        image={setting.image}
        onChange={e => handleInputChange(setting.label, e)}
        options={types} 
        value={inputProp} 
      />
      <BindMenu label={setting.label}/>
    </Flex>
  }

  // BOOLEAN input type
  if (setting.type === 'boolean') {
    return <Flex between sx={{p: t => t.spacing(0.5, 0)}}>
      <Flex sx={{ width: '100%' }} between onClick={e => handleInputChange(setting.label, !Boolean(inputProp))}>
        <Nowrap variant="caption">{setting.title}</Nowrap>
        <Switch size="small" checked={Boolean(inputProp)}  />
      </Flex> 
        <BindMenu label={setting.label}/>
    </Flex>
  }

  // special treatment for ICON_TYPES inpputs
  if (setting.types === 'ICON_TYPES') {
    return <>
    <Nowrap 
    variant="caption">{setting.title}</Nowrap> 
    <Flex spacing={1}>
    <IconSelect   
        onChange={e => handleInputChange(setting.label, e.name)}
      value={{
        name: inputProp?.toString(),
        ID: inputProp?.toString()
      }}
    />
    {!!inputProp && <TextIcon icon={inputProp} />}
    <BindMenu label={setting.label}/>
    </Flex>
    </>
  }

  // all  other elements get a TextField/Select
  return (
    <Stack sx={{p: t => t.spacing(0.5, 0)}}>
      
      <Nowrap variant="caption">{setting.title}[{setting.type}]</Nowrap>
      <TextInput 
        size="small"
        onChange={e => handleInputChange(setting.label, e.target.value)}
        autoComplete="off" 
        endIcon={<BindMenu label={setting.label} offset={!!types?.length}/>}
        select={!!types?.length}  
        value={inputProp}
      >
        {Array.isArray(types) && types?.map(type => <MenuItem value={type}>{type}</MenuItem>)}

      </TextInput>
 
    </Stack>
  )

}
SettingsInput.defaultProps = {};
export default SettingsInput;
