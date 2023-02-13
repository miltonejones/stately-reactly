import React from 'react';
import { styled, Drawer, IconButton,  Pagination, Stack,  Box } from '@mui/material';
import { AppStateContext } from "../../../../context";
import { Flex, Spacer, TinyButton, Nowrap } from "../../../../styled";
import { usePagination } from '../../../../hooks/usePagination';
import CodePane from '../../CodePane/CodePane';
import { DrawerMenu } from "../../.."; 
import { Close } from "@mui/icons-material";
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  minHeight: '60vh'
}));
 
const SplitBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: '50% 50%'
 }));

const ScriptDrawer = () => {
  const context = React.useContext(AppStateContext);
  // const stateParent = context.selectedPage || context.application;
  const { state } = context.clientScriptPane;
  const { scriptProp } = state.context;
  const handleClose = () => { 
    context.clientScriptPane.send('EXIT')
  }
  const scripts = context.clientScriptPane.scriptProps
    .filter(f => !!f.code);
  const pages =  usePagination(scripts, { page: 1, pageSize: 15 });
 return (
  <Drawer onClose={handleClose}  open={context.clientScriptPane.open} anchor="bottom">
     
   <Layout data-testid="test-for-ScriptDrawer">
    <Flex> 
      <Box>
        {!!context.selectedPage ? "Client" : "Application"} scripts 
      </Box> 
      {JSON.stringify(context.clientScriptPane.state.value)}!!
      <Spacer />

      <DrawerMenu wide onClose={handleClose}/>
      <IconButton onClick={handleClose} >
        <Close />
      </IconButton>

    </Flex>
    <SplitBox>
    <Stack>


    <Pagination count={pages.pageCount} page={pages.currentPage} onChange={(e, n) => pages.setCurrentPage(n)}   />

      <Box sx={{ height: 400, p: 1, overflow: 'auto', m: 2 }}>
        {pages.visible?.map(s => <Flex spacing={1} onClick={() => {
          context.clientScriptPane.send({
            type: 'EDIT',
            ID: s.ID
          })
        }}>
          <TinyButton icon="Code" />
          <Nowrap hover bold={s.ID === scriptProp?.ID}>{s.name}</Nowrap></Flex>)}
      </Box>
    </Stack>


   {state.matches('opened.editcode') && (
      <Stack>
        <CodePane 
          multiline 
          onChange={(e) => {
            context.clientScriptPane.send({
            type: 'CHANGE',
            value: e
            })
          }} 
          value={context.clientScriptPane.scriptProp.code}
          />

          {/* <Button onClick={() => {
            context.clientScriptPane.send('CLOSE')
        }}>
    close
      </Button> */}
      </Stack>
   )}

    </SplitBox>


   {/* <pre>
   {JSON.stringify(context.clientScriptPane.scriptProp?.code)}
   </pre> */}
  
   </Layout>
   </Drawer>
 );
}
ScriptDrawer.defaultProps = {};
export default ScriptDrawer;
