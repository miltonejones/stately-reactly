import React from 'react';
import { Dialog, Box, Typography } from '@mui/material';
import { Flex, Btn, TinyButton, Spacer } from "../../../styled";
import { Code } from "@mui/icons-material";
import { useMenu } from '../../../machines';
import CodePane from '../CodePane/CodePane'; 
 
const ScriptModal = ({ children, title, onChange, offset = 3 }) => {
  const menu = useMenu(onChange)
  return <>
  <Code onClick={() => {
    menu.send({
      type: 'open',
      prompt: children
    })
  }} sx={{mr: offset}} />
  <Dialog maxWidth="md" open={menu.open} onClose={menu.handleClose()}>
      <Box sx={{
        width: 720,
        height: 600,
        p: 1
      }}>
        <Flex >
          <Typography variant="subtitle2">{title}</Typography>
          {JSON.stringify(menu.state.value)}
          <Spacer />
          <TinyButton icon="Close" onClick={menu.handleClose()} />
        </Flex>
        <CodePane value={menu.state.context.prompt} onChange={js => {
          menu.send({
            type: 'CHANGE',
            value: js
          })
        }} maxwidth={700} minHeight={500} maxHeight={500}/>
        <Flex spacing={1}> 
          <Spacer />
          <Btn onClick={menu.handleClose()} >Close</Btn>
          <Btn onClick={menu.handleClose(menu.state.context.prompt)} variant="contained">Save</Btn>
        </Flex>
      </Box>
    </Dialog>
  </>
}
ScriptModal.defaultProps = {};
export default ScriptModal;
