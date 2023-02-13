import React from 'react';
import { styled, Box, Stack, Typography, MenuItem } from '@mui/material';
import { StateSelect } from '../../../..';
import { AppStateContext } from '../../../../../context';
import { IconTextField, Pill } from '../../../../../styled';
import Columns from '../../../../../styled/Columns';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const OpenLink = ({ action, actionChange }) => {
  const { target, params = {} } = action;
  const context = React.useContext(AppStateContext);
  if (!context.application) return <i />
  const { pages } = context.application;
  if (!pages?.length) return <i />
  const chosenPage = pages.find(f => f.ID === target);

  return (
    <Layout data-testid="test-for-OpenLink">
      <IconTextField 
        label="Navigate to"
        startIcon={<Pill>Page</Pill>}
        fullWidth
        select
        size="small"
        onChange={e => {
          actionChange({
            target: e.target.value, 
            params
          })
        }}
        value={target}
        >
          {pages.map(page => <MenuItem value={page.ID}>{page.PageName}</MenuItem>)}
        </IconTextField>

        {!!chosenPage?.parameters && 
            !!Object.keys(chosenPage?.parameters).length && <Stack sx={{mt: 1}} spacing={1}>
          <Typography variant="body2">Set page parameters</Typography>
          <Columns columns="30% 1fr">
          {Object.keys(chosenPage?.parameters).map(param => (
            <>
            <Box>{param}</Box>
              <Box>
                <StateSelect value={params[param]} params 
                  onChange={e => {

                      actionChange({
                        target,
                        params: {
                          ...params,
                          [param]: e
                        }
                      })
                  }}/>
              </Box>
            </>
          ))}


        </Columns>

          </Stack>}

        {/* {JSON.stringify(chosenPage?.parameters)} */}
    </Layout>
  );
}
OpenLink.defaultProps = {};
export default OpenLink;

/**
 *   {
          "ID": "lc8yu4ih0t5x0zoo6i3",
          "event": "onEnterPress",
          "componentID": "lc8xoozd8u0bxwkzaeh",
          "action": {
            "type": "openLink",
            "target": "lc69kakjvgs2o76onih",
            "open": false,
            "eventID": "lc8yu4ih0t5x0zoo6i3",
            "params": {
              "search_param": "application.app_wide_param"
            }
          }
        }

 */