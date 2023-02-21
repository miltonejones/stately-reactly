import React from 'react';
import { styled, MenuItem, Collapse, Grid, Stack, Box } from '@mui/material';
import { IconTextField, TinyButton, Btn, Nowrap, Spacer, Flex, SectionHead, Columns } from "../../../../../styled";
import { useListBinder } from "../../../../../machines";
import { inputTypes } from './inputTypes';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

const ListTableField = ({ onChange, binder, field }) => {

  // const binder = useListBinder({
  //   bindingProp,
  //   onChange: e => onChange(JSON.stringify(e))
  // });

  const value = !binder.column?.bindings ? "" : binder.column.bindings[field];
  const type = !binder.column?.typeMap ? "" : binder.column.typeMap[field];
  const editing = binder.key === field;//.state.matches('editing');

  const displayTypes = Object.keys(inputTypes);
  const selectedProp = inputTypes[type?.type]

  return <>
      {/* {JSON.stringify(binder.state.value)} */}
  <Columns columns="28% 1fr 24px">
      <Nowrap variant="body2">{field}</Nowrap>
      <IconTextField 
        onChange={e => {
          binder.send({
            type: 'CHANGE',
            key: field,
            value: e.target.value
          })
        }}
        disabled={!editing}
        endIcon={<TinyButton 
          icon={ editing ? "Close" : "Settings" }
          onClick={() => {
            binder.send({
              type: editing ? "CANCEL" : 'EDIT',  
              key: field,
            })
          }} />}
        label={`Label for "${field}"`}
        size="small"
        value={value}
        /> 
      <TinyButton icon="Delete" 
      onClick={() => binder.send({
        type: 'DELETE',
        key: field
      })} />
  </Columns>
  <Collapse in={ editing}>
   <>
 {/* (  [{type?.type}]) */}
      <Nowrap bold small>Type</Nowrap>
   <IconTextField label={`Type (${type?.type})`} select value={type?.type}
    fullWidth 
    onChange={e => {
      binder.send({
        type: 'TYPE',
        key: field,
        value: e.target.value
      })
    }}
    >
        {displayTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}

   </IconTextField>


   {!!selectedProp && (
    <Grid xs={12} item sx={{pb: 1}}>
      <Grid container spacing={1}>
        {selectedProp.map(prop =>( 
          <Grid key={prop.label} item xs={prop.xs || 12}>
            <Nowrap bold small>{prop.title || prop.label} </Nowrap> 
            <TypeInput {...prop} value={type?.settings[prop.label]} 
                onChange={e => {
                  binder.send({
                    type: 'SETTING',
                    setting: field,
                    key: prop.label,
                    value: e
                  })
                }} />
          </Grid>
          ))} 
      </Grid>
    </Grid>)}
   <Flex>
    <Spacer />
    <Btn 
      onClick={() => binder.send('SAVE')}
      variant="contained"
      disabled={!binder.column?.dirty}
      >save</Btn>
   </Flex>
   {/* <pre> 
    {JSON.stringify(type, 0, 2)}
  </pre> */}
   {/* <pre> 
    {JSON.stringify(binder.column, 0, 2)}
  </pre> */}
   </>
  </Collapse>
  </>
}
 
const ListTableInput = ({ onChange, application, value, setting }) => {
  const bindingProp = !value 
    ? {}
    : JSON.parse(value);

  const resource = application?.resources?.find(res => res.ID === bindingProp?.resourceID); 
  const available = resource?.columns?.filter(col => !bindingProp?.columnMap?.find(f => f === col))

  const binder = useListBinder({
    bindingProp,
    onChange: e => onChange(JSON.stringify(e))
  });
 

  return (
    <Layout>
    {/* [[{value}]] */}

    <Nowrap variant="caption">{setting.title}</Nowrap>
  <IconTextField
    sx={{ width: '100%'}}
    value={bindingProp?.resourceID}
    size="small" 
    select 
    >  
    {application?.resources?.map(s => <MenuItem value={`${s.ID}`}>{s.name}</MenuItem>)}
  </IconTextField>  
  {!!bindingProp?.columnMap && (<>
  <SectionHead sx={{ mt: 2 }}>Table bindings</SectionHead>
  <Stack spacing={0.5} sx={{ m: 1}}>
    {bindingProp.columnMap.map(col =>  <ListTableField 
      key={col} 
      field={col} 
      onChange={onChange} 
      binder={binder}
      bindingProp={bindingProp} 
      />)} 
  </Stack></>)}

  <SectionHead sx={{ mt: 2 }}>Available columns</SectionHead>
  {available?.map(col => <Flex key={col} onClick={() => {
    binder.send({
      type: 'ADD',
      key: col
    })
  }} spacing={1}>
    <TinyButton icon="AddCircle" />
    <Nowrap hover variant="body2">{col}</Nowrap>
  </Flex>)}
 
  {/* <pre>
    {JSON.stringify(bindingProp.columnMap, 0, 2)}
  </pre>
  <pre>
    {JSON.stringify(available, 0, 2)}
  </pre> */}
      </Layout>
  );
}


const TypeInput = ({ label, types, value, type, onChange }) => {

  // if (types) {
  //   return <IconTextField size="small" small caret options={types} value={value} label={value || label} onChange={w => !!w && onChange(w)}/>
  // }

  return <IconTextField size="small" value={value} fullWidth label={`Set value for ${label}`} onChange={e => onChange(e.target.value)}
    select={!!types}
    >

      {types?.map(t => <MenuItem value={t}>{t}</MenuItem>)}
    </IconTextField>
}



ListTableInput.defaultProps = {};
export default ListTableInput;
