import React from 'react';
import { styled, Stack, Box, Collapse } from '@mui/material';
import { SectionHead, Flex, IconSelect, Spacer, Btn, IconTextField, TinyButton } from "../../../../../styled";
import { ConfirmPopover } from "../../../..";
import { useListBuilder } from '../../../../../machines/listBuilderMachine';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));

const ListBuilderField = ({ field, builder }) => {

  const fieldIsSelected = builder.ID === field.ID
  return <Collapse in={!builder.ID || builder.ID === field.ID}>
    <Flex>

      <IconTextField 
        fullWidth
        disabled={!fieldIsSelected}
        size="small"
        label="text"
        onChange={e => {
          builder.send({
            type: 'UPDATE',
            key: 'text',
            value: e.target.value
          })
        }}
        value={field.text}
        endIcon={<TinyButton onClick={() => {
          builder.send({
            type: fieldIsSelected ? 'CLOSE' : 'EDIT',
            ID: field.ID
          })
        }} icon={fieldIsSelected ? "Close" : "Settings"} />}
      />
      <ConfirmPopover message={`Are you sure you want to delete this item?`} 
        onChange={ok => {
          !!ok && builder.send({
            type: 'DROP',
            ID: field.ID
          })
        }}   >
          <TinyButton icon="Delete" />
      </ConfirmPopover>
    </Flex>
      <Collapse in={fieldIsSelected}>
        <Stack sx={{mt: 1}} spacing={1}>
          
        <IconTextField 
        fullWidth
        label="subtext"
        size="small"
        onChange={e => {
          builder.send({
            type: 'UPDATE',
            key: 'subtext',
            value: e.target.value
          })
        }}
        value={field.subtext} 
      />

        <IconTextField 
        onChange={e => {
          builder.send({
            type: 'UPDATE',
            key: 'value',
            value: e.target.value
          })
        }}
        fullWidth
        label="value"
        size="small"
        value={field.value} 
      />

      {!!fieldIsSelected && <>
        <Flex spacing={1}>
          <IconSelect 
            
            onChange={e => {
              builder.send({
                type: 'UPDATE',
                key: 'startIcon',
                value: e.name
              })
            }} 
            value={{
              name: field.startIcon,
              ID: field.startIcon
            }}
          />

          {!!field.startIcon && <TinyButton icon={field.startIcon} />}
        </Flex>

        <Flex spacing={1}>
      <IconSelect 
      
          onChange={e => {
            builder.send({
              type: 'UPDATE',
              key: 'endIcon',
              value: e.name
            })
          }}  

          value={{
            name: field.endIcon,
            ID: field.endIcon
          }}
        />
          {!!field.endIcon && <TinyButton icon={field.endIcon} />}
        </Flex>
      </>}

        </Stack>
      <Flex spacing={1} sx={{mt: 1}}>
      <Btn disabled={!builder.dirty} variant="contained" onClick={() => builder.send('SAVE')}>save</Btn>
        <Spacer />
      <Btn variant="outlined" onClick={() => builder.send('CLOSE')}>close</Btn>
      <Btn disabled={!builder.dirty} variant="contained" onClick={() => builder.send({
        type: 'SAVE',
        close: true
      })}>save &amp; close</Btn>
      </Flex>
      </Collapse>
      </Collapse>
}
 
const ListBuilderInput = ({ onChange, setting, value }) => {
  const builder = useListBuilder({
    value,
    onChange 
  });

 
 return (
   <Layout> 
    <SectionHead sx={{ mb: 2 }}>{setting.title}
    <Spacer />

    <ConfirmPopover message={`Add list item`} 
        onChange={text => {
          !!text && builder.send({
            type: "CREATE",
            text
          }); 
        }}
        prompt="Item text" >
      <TinyButton icon="Add" />
      </ConfirmPopover>

    </SectionHead>

  <Stack spacing={1}>
   {!!builder.bindingProp && builder.bindingProp.map(prop => <ListBuilderField builder={builder} key={prop.ID}  field={prop} />)}

  </Stack>
{/* 
  {JSON.stringify(builder.state.value,0,2)}
    <Json>
      {JSON.stringify(builder.item,0,2)}
      </Json>
    <Json>
      {JSON.stringify(builder.bindingProp,0,2)}
      </Json> */}
   </Layout>
 );
}
ListBuilderInput.defaultProps = {};
export default ListBuilderInput;
