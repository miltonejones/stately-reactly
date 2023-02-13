import React from 'react';
import { styled, Box, Drawer, IconButton, TextField, Pagination, MenuItem } from '@mui/material';
import { AppStateContext } from "../../../../context";
import { Json, Flex, TinyButton, Btn, Spacer } from "../../../../styled"; 
import { Close } from "@mui/icons-material";
import { usePagination } from '../../../../hooks/usePagination';
import { objectReduce } from '../../../../util/objectReduce';
import ConfirmPopover from '../../ConfirmPopover/ConfirmPopover';
import { DrawerMenu } from "../../.."; 
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  minHeight: '40vh'
 }));
 
const SplitBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: '1fr 1fr'
 }));

 const StateBox = styled(Box)(({ theme }) => ({
  height: 'min-content',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 32px',
  gap: theme.spacing(0.5)
 }));

 const StateValue = ({ handleChange, Key, Value, Type, ID })  => {
  const types = ['string', 'object', 'array', 'boolean', 'number'];

  return (<>
    <TextField placeholder="Key" value={Key} size="small" onChange={e => handleChange(ID, 'Key', e.target.value)} />
    <TextField select value={Type} size="small"  onChange={e => handleChange(ID, 'Type', e.target.value)} >
      {types.map(type  =>  <MenuItem key={type} value={type}>{type}</MenuItem>)}
    </TextField>
    <TextField placeholder="Initial value"  value={Value} size="small"  onChange={e => handleChange(ID, 'Value', e.target.value)} />
    <ConfirmPopover message={`Are you sure?`} onChange={val => !!val &&  handleChange(ID, null, null, true)} >
    <TinyButton icon="Delete" />
    </ConfirmPopover>
  </>)
 }
 
const StateDrawer = () => {

  const context = React.useContext(AppStateContext);
  const stateParent = context.selectedPage || context.application; 

  const pages =  usePagination(context.clientStatePane.stateProps, { page: 1, pageSize: 10 });
  const stateObj = objectReduce(context.clientStatePane.stateProps);
  const handleChange = (ID, key, val, unlink) => {
    context.clientStatePane.send({
      type: 'CHANGE',
      ID,
      Value: val,
      Key: key,
      unlink
    })
  }
  
  const handleClose = () => {
    pages.setCurrentPage(1);
    context.clientStatePane.send('CLOSE')
  }
  return (
    <Drawer onClose={handleClose}  open={context.clientStatePane.open} anchor="bottom">
      <Layout>

        <Flex>

          <Box>
            {!!context.selectedPage ? "Client" : "Application"} state [{JSON.stringify(context.clientStatePane.state.value)}]!
          </Box>

          <ConfirmPopover message={`Add variable`} prompt="Newstate" onChange={val => !!val && handleChange(null, 'Key', val)} >
            <Btn endIcon={<TinyButton icon="Add" /> }>add</Btn> 
          </ConfirmPopover>

          <Spacer />

          <DrawerMenu wide onClose={handleClose}/>
          <IconButton onClick={handleClose} >
            <Close />
          </IconButton>

        </Flex>


      <Box>

        {/* <Button onClick={() => {
         const name = window.prompt('Enter name!!?')
         if (!name) return;
         handleChange(null, 'Key', name)
        }}>
          close
        </Button> */}
      </Box>
      <SplitBox>
        <Box>
        {pages.pageCount > 1 && <Pagination count={pages.pageCount} page={pages.currentPage} onChange={(e, n) => pages.setCurrentPage(n)}   />}
        <StateBox>

          {pages.visible?.map(s => <StateValue handleChange={handleChange} key={s.ID} {...s} />)}
        </StateBox>
        </Box>
        <Box sx={{p: 1, height: 500,  border:  1,  borderColor: 'divider',  overflow: 'auto'}}> 
          {!!stateParent && <Json>
            {JSON.stringify(stateObj,0,2)}
          </Json>}
        </Box>
      </SplitBox>
      </Layout>
    </Drawer>
  );
}
StateDrawer.defaultProps = {};
export default StateDrawer;
