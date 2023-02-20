import React from "react";
import { styled, Box, Typography, IconButton, Stack } from "@mui/material";
import {
  PageTreeView,
  RightPanel,
  ComponentTree,
  ComponentTreeView,
  ComponentInfoChip,
  DrawerMenu,
  SimpleMenu,
} from "../..";
import { typeIcons, Nowrap, Spacer, Json, Flex } from "../../../styled";
import { LibraryComponents } from "../../reactly";
import { Home } from "@mui/icons-material";

const Layout = styled(Box)(({ theme, state }) => {
  const first = state & 1 ? "330px" : "48px";
  const after = state & 2 ? "400px" : "48px";
  return {
    display: "grid",
    gap: theme.spacing(0.5),
    margin: theme.spacing(0.5),
    height: `calc(100vh - 64px)`,
    gridTemplateColumns: `40px ${first} 1fr ${after}`,
    transition: "all 0.2s linear",
  };
});

const Area = styled(Box)(({ theme, dark }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  backgroundColor: dark
    ? theme.palette.primary.dark
    : theme.palette.common.white,
  height: "100%",
  overflow: "auto",
}));

const Pane = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.divider}`,
  overflow: "auto",
}));

const AppEditor = (props) => {
  const {
    workspace_state,
    showJSON,
    application,
    navigate,
    pageID,
    selectedComponentID,
  } = props;
  const handleCollapse = (bit) => {
    props.send({
      type: "RESTATE",
      key: "workspace_state",
      value:
        workspace_state & bit
          ? workspace_state - bit
          : Number(workspace_state) + bit,
    });
  };

  const selectedPage = application.pages?.find((f) => f.ID === pageID);
  const selectedComponents = selectedPage?.components || application.components;
  const selectedComponent = selectedComponents?.find(
    (f) => f.ID === selectedComponentID
  );
  const tbd = Object.keys(props.library).filter(
    (key) => !Object.keys(LibraryComponents).some((lib) => lib === key)
  );
  return (
    <Layout state={workspace_state}>
      <Area dark>
        <Stack
          sx={{
            alignItems: "space-between",
            pt: 3,
            pb: 4,
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <IconButton href="/" color="inherit">
            <Home />
          </IconButton>

          <DrawerMenu {...props} />
        </Stack>
      </Area>
      <Area>
        <Flex sx={{ p: (t) => t.spacing(1, 1, 0, 1) }} spacing={1}>
          {!!(workspace_state & 1) && (
            <>
              <Nowrap bold width="fit-content" variant="caption">
                Pages
              </Nowrap>
              <SimpleMenu
                caret
                value={selectedPage?.ID}
                options={application.pages.map((p) => ({
                  id: p.ID,
                  label: p.PageName,
                }))}
                onChange={(id) =>
                  navigate(`/apps/page/${application.ID}/${id}`)
                }
              >
                <Typography variant="body2">
                  {selectedPage?.PageName || "select page"}
                </Typography>
              </SimpleMenu>
              <Spacer />
            </>
          )}
          <Box onClick={() => handleCollapse(1)}>{typeIcons.close}</Box>
        </Flex>

        {!!(workspace_state & 1) && (
          <>
            <Pane
              sx={{
                height: "35vh",
              }}
            >
              <PageTreeView {...props} />
            </Pane>

            <Pane
              sx={{
                height: "45vh",
              }}
            >
              <ComponentTreeView {...props} components={selectedComponents} />
            </Pane>
          </>
        )}
      </Area>

      <Area>
      {/* {JSON.stringify(props.delegate.state.value)}/{props.delegate.event_index}/{props.delegate.action?.type} */}

      <Nowrap>{props.delegate.error}</Nowrap>
      <Nowrap variant="caption">{props.delegate.stack}</Nowrap> 
        {!showJSON && (
          <>
            {!!application && (
              <ComponentTree
                library={props.library}
                components={application.components}
              />
            )}
            {!!selectedPage && (
              <ComponentTree
                library={props.library}
                components={selectedPage.components}
              />
            )}
            <pre>{JSON.stringify(tbd, 0, 2)}</pre>
          </>
        )}

        {!!showJSON && <Json>{JSON.stringify(application, 0, 2)}</Json>}
      </Area>

      <Area>
        <Flex sx={{ p: 1 }}>
          {!!(workspace_state & 2) && (
            <ComponentInfoChip
              {...props}
              component={selectedComponent}
              library={props.library}
            />
          )}
          <Spacer />
          <Box onClick={() => handleCollapse(2)}>{typeIcons.close}</Box>
        </Flex>
        {!!(workspace_state & 2) && (
          <Box>
            <RightPanel {...props} selectedComponent={selectedComponent} selectedPage={selectedPage} application={application}/>
          </Box>
        )}
      </Area>
    </Layout>
  );
};
AppEditor.defaultProps = {};
export default AppEditor;
