

import { styled, Tab } from '@mui/material';

export const TabButton = styled(Tab)(({ theme, uppercase }) => ({
  textTransform: uppercase ? "uppercase" : "none",
  margin: 0,
  padding: theme.spacing(1),
  height: 24,
  minHeight: 24,
  fontSize: "0.85rem",
}));

export default TabButton;
