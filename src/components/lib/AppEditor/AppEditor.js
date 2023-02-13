import React from 'react';
import { styled, Box, Typography, IconButton, Stack } from '@mui/material';
import { PageTreeView, SettingsPanel, ComponentTree, ComponentTreeView, ComponentInfoChip, DrawerMenu, SimpleMenu } from '../..';
import { typeIcons,  Nowrap, Spacer, Json, Flex } from "../../../styled";
import { Home } from "@mui/icons-material";
 
const Layout = styled(Box)(({ theme, state }) => {
  const first = state & 1 ? '330px' : '48px'
  const after = state & 2 ? '400px' : '48px'
  return {
    display: 'grid',
    gap: theme.spacing(0.5),
    margin: theme.spacing(0.5),
    height: `calc(100vh - 64px)` ,
    gridTemplateColumns: `40px ${first} 1fr ${after}`, 
    transition: 'all 0.2s linear',
  }
});

const Area = styled(Box)(({ theme, dark }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  backgroundColor: dark ? theme.palette.primary.dark : theme.palette.common.white,
  height: '100%',
  overflow: 'auto'
}))
 
const Pane = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.divider}`, 
  overflow: 'auto'
}))
 
const AppEditor = (props) => {
 
  const { workspace_state, showJSON, application, navigate, pageID, selectedComponentID } = props;
  const handleCollapse = bit => {
    props.send({
      type: 'RESTATE',
      key: 'workspace_state',
      value: workspace_state & bit ? (workspace_state - bit) : (Number(workspace_state) + bit)
    })
  }
 
  const selectedPage = application.pages?.find(f => f.ID === pageID);
  const selectedComponents = selectedPage?.components || application.components;
  const selectedComponent = selectedComponents?.find(f => f.ID === selectedComponentID);
 return (
   <Layout state={workspace_state}>
    <Area dark>
      <Stack sx={{ alignItems: 'space-between', pt: 3, pb: 4, height:  '100%', justifyContent: 'space-between' }}>
        <IconButton href="/" color="inherit">
          <Home  />
        </IconButton>

        <DrawerMenu {...props} />

        {/* <Stack>
          {Object.keys(drawerMenuItems).map((ico) => (
            <BorderButton onClick={() => drawerMenuItems[ico].action &&  drawerMenuItems[ico].action()} key={ico} color="inherit">
              {drawerMenuItems[ico].icon}
            </BorderButton>
          ))}
        </Stack> */}

      
        {/* <Box>bot2tom</Box> */}
      </Stack>
    </Area>
      <Area>
      
        <Flex sx={{p: t => t.spacing(1, 1, 0, 1)}} spacing={1}>
          {!!(workspace_state & 1) && (
          <>
            <Nowrap bold width="fit-content" variant="caption">Pages</Nowrap>
            <SimpleMenu 
              caret 
              value={selectedPage?.ID} 
              options={application.pages.map(p => ({
                id: p.ID,
                label: p.PageName
              }))}
              onChange={(id) => navigate(`/apps/page/${application.ID}/${id}`)}  
              >
              <Typography variant="body2">{selectedPage?.PageName || "select page"}</Typography>
            </SimpleMenu>
            <Spacer />
          </>)}
          <Box onClick={() => handleCollapse(1)}> 
            {typeIcons.close}
          </Box>
        </Flex>


        {!!(workspace_state & 1) && <>
          <Pane sx={{ 
            height: '35vh', 
          }}>
            <PageTreeView {...props} />
          </Pane>
        
          <Pane sx={{ 
              height: '45vh', 
            }}>
            <ComponentTreeView {...props} components={selectedComponents}/>
          </Pane>
        </>}
 
      </Area>

     <Area>
     {!showJSON && <>
      <ComponentTree library={props.library} components={selectedComponents}/>
      {/* import {"{ "}
        {Object.keys(props.library).join(", ")}
      {" }"} from "@mui/material";

      export const LibraryComponents = {"{ "}
        {Object.keys(props.library).join(", ")}
        {" }"};
      <pre>
      {JSON.stringify(Object.keys(props.library),0,2)}
      </pre> */}
     </>}
      {/* workspace!!{workspace_state} */}
      {!!showJSON && <Json>
        {JSON.stringify(selectedComponents,0,2)}
      </Json>}
     </Area>

     <Area>
      <Flex sx={{ p: 1 }}>
        {!!(workspace_state & 2) && <ComponentInfoChip component={selectedComponent} library={props.library} />}
        <Spacer />
        <Box onClick={() => handleCollapse(2)}> 
          {typeIcons.close}
        </Box>
      </Flex>
       {!!(workspace_state & 2) && !!selectedComponent && <Box>
        
        <SettingsPanel {...props} component={selectedComponent} />
       
        </Box>}
      
     </Area>
   </Layout>
 );
}
AppEditor.defaultProps = {};
export default AppEditor;
