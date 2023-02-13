
import { styled, Card } from '@mui/material';

const ButtonCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.2s linear',
  cursor: 'pointer',
  "&:hover": {
    outline: `solid 2px ${theme.palette.primary.main}`
  },
  "&:active": {
    outline: `solid 1px ${theme.palette.divider}`
  }
}))

export default ButtonCard;
