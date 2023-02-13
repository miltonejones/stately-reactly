import React from 'react';
import { Box, Typography, Stack, Divider, TextField, Button,  Popover } from '@mui/material';
// import { useMachine } from '@xstate/react'; 
import { useMenu } from '../../../machines';
  
 
const ConfirmPopover = ( { onChange, message, prompt, caption, children }) => { 
  const menu = useMenu(onChange);
  const value = menu.state.context.prompt || prompt;
 return (
   <>
   <Box onClick={menu.handleClick}>{children}</Box>
   <Popover anchorEl={menu.anchorEl} open={!!menu.anchorEl} onClose={() => menu.send('close')}>
      <Stack sx={{p: 2,  maxWidth: 600,  minWidth: 400}}>
        <Typography>{message}</Typography>
        {!!caption && <Typography variant="caption" color="error" sx={{fontWeight: 600}}>{caption}</Typography>}
        {!!prompt && <TextField size="small" value={value} onChange={e => menu.send({
          type: 'CHANGE',
          value: e.target.value
        })}/>}
        {/* [{JSON.stringify(menu.state.context.prompt)}] */}
        <Divider sx={{width: '100%', m: t => t.spacing(1,0)}} />
        <Stack direction="row" sx={{ justifyContent: 'flex-end'}}>
          <Button onClick={() => menu.send('close')}>cancel</Button>
          <Button variant="contained" onClick={menu.handleClose(value || true)}>okay</Button>
        </Stack>
      </Stack>
   </Popover>
   </>
 );
}
ConfirmPopover.defaultProps = {};
export default ConfirmPopover;
