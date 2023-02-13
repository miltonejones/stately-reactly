import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ButtonCard from '../../../styled/ButtonCard';

export default function AppList({ logo, send, applicationList, navigate }) {
  const handleCardClick = id => {
    navigate(`/apps/detail/${id}`);
  }
  return (
    <div>
      {!!applicationList && (
        <Stack direction="row" sx={{p: 2}} spacing={1}>
          {applicationList.map((app) => (
            <Box sx={{ width: 200 }} key={app.ID}>
              <ButtonCard
                onClick={() => handleCardClick(app.ID)}
              >
                <Stack>
                  <img alt={app.Name} src={app.Photo || logo} style={{ width: 200 }} />
                  <Box sx={{ p: 1 }}>
                    <Typography>{app.Name}</Typography>
                  </Box>
                </Stack>
              </ButtonCard>
            </Box>
          ))}
        </Stack>
      )}
    </div>
  );
}
