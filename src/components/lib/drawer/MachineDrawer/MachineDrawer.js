import React from 'react';
import { styled, Stack, Drawer, Box } from '@mui/material';
import { AppStateContext } from "../../../../context";
import { Columns, Nowrap, Btn } from "../../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  minHeight: '40vh'
}));
 
const MachineDrawer = () => {
  const context = React.useContext(AppStateContext);
  if (!context.registrar.machines) return <>Loading...</>
  const { state, send } = context.registrar;
  
 return (
  <Drawer open={context.registrar.open} anchor="bottom" onClose={() => send('CLOSE')}>
    <Layout data-testid="test-for-MachineDrawer">
      {JSON.stringify(state.value)}
      <Columns>
      <Box>

      {Object.keys(context.registrar.machines).map(key => <Stack key={key}>
          <Nowrap bold hover onClick={() =>{
            send({
              type: 'VIEW',
              machine: context.registrar.machines[key]
            })
          }}>{key}</Nowrap>
          <Nowrap variant="caption">{JSON.stringify(context.registrar.machines[key].args.state.value)}</Nowrap>
        </Stack>)}


      </Box>
        <Box>
         {!!context.registrar.machine && <pre>
          {JSON.stringify(context.registrar.machine.args.state.value,0,2)}

          </pre>}
          <Btn onClick={() => send('CLOSE')}>close</Btn>
        </Box>
      </Columns>
      {/* <pre>
        {JSON.stringify(Object.keys(context.registrar.machines),0,2)}
      </pre> */}
    </Layout>
  </Drawer>
 );
}
MachineDrawer.defaultProps = {};
export default MachineDrawer;
