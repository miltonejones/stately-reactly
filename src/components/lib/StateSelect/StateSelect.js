import React from 'react';
import { styled, Box, MenuItem } from '@mui/material';
import { AppStateContext } from "../../../context";
import { IconTextField, Pill, Flex } from "../../../styled";
import { Error } from "@mui/icons-material";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0),
 width: '100%'
}));
 
const StateSelect = ({ value, params, label, supportedEvent, pill, onChange }) => {
  const context = React.useContext(AppStateContext);
  const { state } = context.application
  const { selectedPage } = context;

  const appProps = state?.map(opt => ({
    id: `application.${opt.Key}`,
    label: `application.${opt.Key}`,
    type: opt.Type
  }));

  const pageProps = !selectedPage ? [] : selectedPage.state?.map(opt => ({
    id: opt.Key,
    label: opt.Key,
    type: opt.Type
  }));

  const paramProps = !(!!selectedPage?.parameters && !!params) ? [] : Object.keys(selectedPage.parameters).map(paramKey => {
    return {
      id: `parameters.${paramKey}`,
      label: `parameters.${paramKey}`
    };
  });

  const eventProps = !(supportedEvent && supportedEvent.emits) ? [] : supportedEvent.emits.map(emit => ({
    id: `event.${emit}`,
    label: `event.${emit}`
  }))

  const options = [...pageProps, ...appProps, ...paramProps, ...eventProps];
  const notfound = !!value && !options.find(e => e.id === value) ? [{
    id: value,
    label: <Flex><Error color="error"/>{JSON.stringify(value)}</Flex>
  }] : [];

   
  return (
    <Layout data-testid="test-for-StateSelect">
      {/* [{value}] */}
          <IconTextField 
            error={!!notfound?.length}
            helperText={!!notfound?.length?"Selected value not found on this page":""}
            startIcon={!pill ? null : <Pill>{pill}</Pill>}
            size="small" fullWidth select label={label}
            onChange={e => onChange && onChange(e.target.value)}
            value={value}>
        {notfound.concat(options).map(opt => <MenuItem value={opt.id}>{opt.label}</MenuItem>)}
      </IconTextField>
    </Layout>
  );
}
StateSelect.defaultProps = {};
export default StateSelect;
