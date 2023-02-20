import React from 'react';
import { styled, MenuItem, Collapse, Grid, Stack, Box } from '@mui/material';
import { IconTextField, TinyButton, Btn, Nowrap, SectionHead, Columns } from "../../../../../styled";
import { useListBinder } from "../../../../../machines";
import { inputTypes } from './inputTypes';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

const ListTableField = ({ bindingProp, column, field }) => {

  const binder = useListBinder({
    bindingProp
  });

  const value = !binder.column?.bindings ? "" : binder.column.bindings[field];
  const type = !binder.column?.typeMap ? "" : binder.column.typeMap[field];
  const editing = binder.state.matches('editing');

  const displayTypes = Object.keys(inputTypes);
  const selectedProp = inputTypes[type?.type]

  return <>
  <Columns columns="33% 1fr">
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
          onClick={() => binder.send({
          type: editing ? "CANCEL" : 'EDIT', 
          column: bindingProp
        })} />}
        label={`Label for "${field}"`}
        size="small"
        value={value}
        /> 
  </Columns>
  <Collapse in={ editing}>
   <>
 {/* (  [{type?.type}]) */}
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
   <Box>
    <Btn 
      variant="contained"
      disabled={!binder.column?.dirty}
      >save</Btn>
   </Box>
   {/* <pre> 
    {JSON.stringify(type, 0, 2)}
  </pre> */}
   <pre> 
    {JSON.stringify(binder.column, 0, 2)}
  </pre>
   </>
  </Collapse>
  </>
}
 
const ListTableInput = ({ application, value, setting }) => {
  const bindingProp = !value 
    ? {}
    : JSON.parse(value);

  const resource = application?.resources?.find(res => res.ID === bindingProp?.resourceID); 

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
  {!!bindingProp && (<>
  <SectionHead>Table bindings</SectionHead>
  <Stack spacing={0.5} sx={{ m: 1}}>
    {bindingProp.columnMap.map(col =>  <ListTableField 
      key={col} 
      field={col} 
      bindingProp={bindingProp}
      column={bindingProp.typeMap[col]}
      value={bindingProp.bindings[col]}
      />)} 
  </Stack></>)}

 
  <pre>
    {JSON.stringify(bindingProp, 0, 2)}
  </pre>
  <pre>
    {JSON.stringify(resource, 0, 2)}
  </pre>
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
