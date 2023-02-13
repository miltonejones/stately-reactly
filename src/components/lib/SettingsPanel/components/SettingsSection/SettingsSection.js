import React from 'react'; 
import { Collapse, Stack,  Box } from '@mui/material';
import { Flex, Spacer, SectionHead, Nowrap, typeIcons } from "../../../../../styled";
import { getSettings } from "../../../../../util/getSettings";
import SettingsInput from '../SettingsInput/SettingsInput';
  
 
const SettingsSection = ({ name, always, settings, openSections = {}, component, styles, ...props }) => {
  const componentProps = getSettings(component.settings);

  const sectionKey = `${component.ID}_${name}`;
  const items = settings || styles;

  const active = items.find(setting => {
    return (!!componentProps[setting.label] && componentProps[setting.label] !== 'null')  || 
       component.boundProps?.find(prop => prop.attribute === setting.label);
  })


  const open = active || !!openSections[sectionKey];
  if (!items) return;
  return (
  <Stack spacing={1} sx={{m: 1}}>

    <SectionHead  
      nopadding
      active={open}
      onClick={() => {
        props.send({
          type: 'RESTATE',
          key: 'openSections',
          value: {
            ...openSections,
            [sectionKey]: !openSections[sectionKey]
          }
        })
      }}
    > 
      <Nowrap bold={open} variant="caption">{name}</Nowrap>
      <Spacer />
      {!always && <Box>{typeIcons[!open?"down":"up"]}</Box>}
    </SectionHead> 

    <Collapse in={always || open}>
      <Flex wrap="wrap" sx={{mb: 2}} spacing={1}>
        {items
          .sort((a, b) => Number(a.order) > Number(b.order) ? 1 : -1)
          .map(setting => (
          <Stack sx={{width: `calc(${(setting.xs || 12) / .12}% - 8px)`}}>  
            <SettingsInput component={component} setting={setting} {...props} /> 
          </Stack>
        ))}
      </Flex>
    </Collapse> 
  </Stack>)

}
SettingsSection.defaultProps = {};
export default SettingsSection;
