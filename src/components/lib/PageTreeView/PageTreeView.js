import React from 'react';
import { styled, Box } from '@mui/material';
import { Flex, Nowrap, typeIcons } from "../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const PageTreeView = ({ application, pageID, openFolders={}, send, parentID, navigate, indent = 0 }) => {

  const nodes = application.pages.filter(f => f.pageID === parentID);
  const childProps = {
    application,
    navigate,
    send,
    pageID,
    openFolders
  }
 return (
   <Layout data-testid="test-for-PageTreeView">
 
    {nodes.map(node => {
      const childPages = application.pages.filter(f => f.pageID === node.ID);
      return (
      <Box key={node.ID}>
        <Flex  
          onClick={() => navigate(`/apps/page/${application.ID}/${node.ID}`)} 
          spacing={1} 
          sx={{ml: indent}}
          >{typeIcons.folder[pageID  === node.ID ? 'open' : 'closed']} 
          <Nowrap hover variant="body2" bold={pageID  === node.ID}>{node.PageName}</Nowrap>
        </Flex>

        {!!openFolders[node.ID] && childPages.map(off => (
        <PageTreeView 
          {...childProps}
          key={off.ID}
          parentID={node.ID} 
          indent={indent + 2} 
        />))}
      </Box>)
    })}
 
   </Layout>
 );
}
PageTreeView.defaultProps = {};
export default PageTreeView;
