import React from "react";
import { styled, Box } from "@mui/material";
import { Flex, Nowrap, TinyButton } from "../../../styled";
import { sortByOrder } from "../../../util/sortByOrder";

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const ComponentTreeView = ({
  components,
  application,
  navigate,
  send,
  componentID,
  openComponents = {},
  library,
  indent = 0,
  parentID,
  selectedComponentID,
}) => {
  const nodes = components?.filter((f) => f.componentID === parentID);

  const childProps = {
    components,
    library,
    application,
    navigate,
    send,
    componentID,
    openComponents,
    selectedComponentID,
  };

  const handleChange = (key) => {
    send({
      type: "RESTATE",
      key: "openComponents",
      value: {
        ...openComponents,
        [key]: !openComponents[key],
      },
    });
  };

  const handleSelect = (value) => {
    send({
      type: "RESTATE",
      key: "selectedComponentID",
      value,
    });
  };

  return (
    <Layout data-testid="test-for-ComponentTreeView">
      {nodes?.map((node) => {
        const childComponents = components
          ?.filter((f) => f.componentID === node.ID)
          .sort(sortByOrder);
        const ico = !!openComponents[node.ID] ? "Remove" : "Add";
        return (
          <Box key={node.ID}>
            <Flex sx={{ ml: indent, pb: 0.5 }}>
              <TinyButton
                onClick={() => handleChange(node.ID)}
                icon={!!childComponents.length ? ico : "RadioButtonUnchecked"}
              />
              <TinyButton icon={library[node.ComponentType].Icon} />
              <Nowrap
                onClick={() => {
                  handleChange(node.ID);
                  handleSelect(node.ID);
                }}
                bold={selectedComponentID === node.ID}
                hover
                variant="body2"
              >
                {node.ComponentName}
              </Nowrap>
            </Flex>

            {!!openComponents[node.ID] && (
              <ComponentTreeView
                {...childProps}
                parentID={node.ID}
                indent={indent + 2}
              />
            )}
          </Box>
        );
      })}
    </Layout>
  );
};
ComponentTreeView.defaultProps = {};
export default ComponentTreeView;
