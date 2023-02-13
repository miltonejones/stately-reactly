
 
import { styled, IconButton } from '@mui/material';

const BorderButton = styled(IconButton)(({ active , theme}) => ({
  // borderWidth: active ? 1  : 0,
  outline: !active ? '' : ('solid 2px ' + theme.palette.primary.main)
}))

export default BorderButton;
