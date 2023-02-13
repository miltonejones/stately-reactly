

import { styled, Tabs } from '@mui/material';

export const TabList = styled(Tabs)(({ theme }) => ({
  minHeight: 24,
  borderBottom: 'solid 1px ' + theme.palette.divider
}));

export default TabList;
