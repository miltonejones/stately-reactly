import React from 'react';
import { styled, Stack, Box, MenuItem  } from '@mui/material'; 
import { Nowrap, SectionHead, Spacer, Btn, Columns, TinyButton, Flex, IconTextField } from "../../../../../styled";
import { useRepeater } from '../../../../../machines/repeaterMachine';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

const RepeaterField = ({ resource, repeater, field }) => {
  const { bindings } = repeater.bindingProp;
  const boundProp = bindings[field];
  return (
    <Columns columns="40% 1fr 20px">

      <IconTextField
      label="Bind"
        sx={{ width: '100%'}}
        value={field}
        size="small" 
        select 
        >  
        {resource?.columns?.map(s => <MenuItem value={`${s}`}>{s}</MenuItem>)}
      </IconTextField>  


    {/* <Nowrap small >Bind <b>{field}</b> to </Nowrap> */}
 

      <IconTextField
      label="to"
        sx={{ width: '100%'}}
        value={boundProp?.title}
        size="small" 
        onChange={e => {
          repeater.send({
            type: 'CHANGE',
            key: field,
            value: e.target.value
          })
        }}
        select 
        >  
        {repeater?.bindableProps?.map(s => <MenuItem value={`${s.title}`}>{s.title}</MenuItem>)}
      </IconTextField>  
 
      <TinyButton icon="Delete"   
      onClick={() => repeater.send({
        type: 'DROP',
        key: field
      })}  />

    </Columns>
  )
}
 
const RepeaterInput = ({ onChange, value, setting, application, component}) => {
  const bindingProp = !value 
    ? {}
    : JSON.parse(value);
  const repeater = useRepeater({
    component,
    bindingProp,
    onChange: e => onChange(JSON.stringify(e))
  });

  const resource = application?.resources?.find(res => res.ID === bindingProp?.resourceID); 
  const boundProps = !repeater.bindingProp?.bindings ? [] : Object.keys(repeater.bindingProp.bindings);
  const openProps = !resource.columns  ? [] : resource.columns.filter(prop => !boundProps.find(f => f === prop))

 return (
   <Layout>

   <Nowrap variant="caption">{setting.title}</Nowrap>

   <IconTextField
    sx={{ width: '100%'}}
    value={bindingProp?.resourceID}
    size="small" 
    select 
    >  
    {application?.resources?.map(s => <MenuItem value={`${s.ID}`}>{s.name}</MenuItem>)}
  </IconTextField>  

  {!!boundProps && (<>

    <SectionHead sx={{ mt: 2 }}>Table bindings</SectionHead>
      <Stack sx={{pt: 2}} spacing={1}>
    {boundProps.map(field => <RepeaterField 
      repeater={repeater}
      resource={resource}
      key={field}
      field={field}
      />)}
      </Stack>
  </>)}
  
  <SectionHead sx={{ mt: 2 }}>Available columns</SectionHead>
        
  {openProps?.map(col => <Flex key={col} onClick={() => {
    repeater.send({
      type: 'ADD',
      key: col
    })
  }} spacing={1}>
    <TinyButton icon="AddCircle" />
    <Nowrap hover variant="body2">{col}</Nowrap>
  </Flex>)}

  <Flex sx={{ mt: 2 }}>
    <Spacer /> 
    <Btn 
      onClick={() => repeater.send('SAVE')}
      variant="contained"
     
      disabled={!repeater.bindingProp?.dirty}
    >
      save
    </Btn>
  </Flex>
   

   <pre>
     {JSON.stringify(repeater.bindingProp,0,2)}
     {JSON.stringify(boundProps,0,2)}
   </pre>
  {/*  <pre>
     {JSON.stringify(repeater.bindableProps,0,2)}
   </pre>
    <pre>
      {JSON.stringify(openProps,0,2)}
    </pre>
     RepeaterInput Component
      */}
   </Layout>
 );
}
RepeaterInput.defaultProps = {};
export default RepeaterInput;
