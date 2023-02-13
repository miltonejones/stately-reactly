

import { styled, Button } from '@mui/material';

export const Btn = styled(Button)(({ theme }) => ({
  textTransform: 'capitalize',
  borderRadius: 20,
  padding: theme.spacing(0.5, 3)
}));

export default Btn;
