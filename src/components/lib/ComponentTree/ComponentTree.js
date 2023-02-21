import React from "react";
import { Stack, Card, Popover, Box } from "@mui/material";
import { Nowrap, SectionHead, Btn, Columns } from "../../../styled";
import { useMenu } from "../../../machines";
import { sortByOrder } from "../../../util/sortByOrder";
import { AppStateContext } from "../../../context";
import { LibraryComponents } from "../../reactly";
import { getBindings } from "../../../util/getBindings";
import { useComponentRender } from "../../../machines";
import { useEventDelegate } from "../../../machines/eventDelegateMachine";

const Specimen = ({ tag: Tag, children, supportedEvents = [], allowChildren, component, ...props }) => {
  const renderer = useComponentRender({
    component,
    pageProps: props.stateProps,
    appProps: props.appProps,
    datasets: props.datasets,
    selectedPage: props.selectedPage || props.application,
  }); 
  
  const delegate = useEventDelegate( {
    application: props.application,
    scripts: renderer.scripts,
    selectedPage: props.selectedPage,
    setState: renderer.setState,
    modalOpen: renderer.modalOpen,
    handleResponse: props.handleResponse,
    ...props.delegateProps
    }
    );

  const { properties, styles } = renderer;

  if (delegate.state.matches('exec_error')) {
    return <Stack>
        <Nowrap>{delegate.error}</Nowrap>
        <Nowrap variant="caption">{delegate.stack}</Nowrap>
        <Box>
          <Btn variant="contained" color="warning" onClick={() => delegate.send('RECOVER')}>recover</Btn>
        </Box>
    </Stack>
  }

  if (!renderer.state.matches("render") && !!renderer.component) {
    return (
      <Card sx={{p: 1}} >
        <Nowrap color={renderer.color}>Loading {renderer.component.ComponentName}...</Nowrap>
      </Card>
    );
  }

  const { events = []} = component;
  const handlers = supportedEvents.reduce((out, ev) => {   
    const handledEvents = events.filter(e => e.event === ev.name);
    if (handledEvents.length) {
      out[ev.name] = (e, attributes) => { 
        console.clear();
        console.log({
          delegateProps: props.delegateProps,
          attributes
        })
        delegate.send({
          type: 'EXEC',
          events: handledEvents,
          eventProps: attributes, 
          data: attributes, 
          pageProps: props.stateProps,
          appProps: props.appProps,
        }) 
      }
    }
    return out;
  }, {});
 
  if (!!properties.invisible) {
    return <i />
  }

  if (!allowChildren && !properties.Label && !properties.children) {
    return <Tag sx={styles} style={styles} {...properties} {...handlers} ID={component.ID}/>
  }

  return (
    <Tag sx={styles} {...properties}  {...handlers}  ID={component.ID}>
      {properties.children || properties.Label || children}
    </Tag>
  );
};

const ComponentData = (props) => {
  const {
    component,
    library,
    components,
    stateProps,
    appProps,
    selectedPage,
  } = props;
  const menu = useMenu();
  const isBound = !!component.boundProps?.length;
  const tag = LibraryComponents[component.ComponentType];
  const { allowedChildren, allowChildren, Events } = library[component.ComponentType];
  const componentChildren = components
    .filter((c) => c.componentID === component.ID)
    .sort(sortByOrder);

  if (tag) {
    return (
      <Specimen
        tag={tag}
        delegateProps={props.delegateProps}
        datasets={props.datasets} 
        application={props.application}
        component={component}
        allowChildren={allowChildren}
        supportedEvents={Events}
        stateProps={stateProps}
        selectedPage={selectedPage}
        appProps={appProps}
      >
        {/* components with allowed children have to be rendered without fragments */}
        {!!allowedChildren &&
          componentChildren.map((child) => (
            <ComponentData {...props} component={child} key={child.ID} />
          ))}

        {/* otherwise recurse normally */}
        {!allowedChildren && (
          <ComponentTree components={components} componentID={component.ID} />
        )}
      </Specimen>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          p: 1,
          m: 1,
          border: isBound ? 2 : 1,
          borderColor: isBound ? "red" : "divider",
        }}
      >
        <Stack>
          <Nowrap hover onClick={menu.handleClick} sx={{ lineHeight: 1 }}>
            {component.ComponentName}
          </Nowrap>
          <Nowrap sx={{ lineHeight: 1 }} variant="caption">
            {component.ComponentType}
          </Nowrap>
        </Stack>

        <ComponentTree components={components} componentID={component.ID} />
      </Box>
      <Popover
        anchorEl={menu.anchorEl}
        open={!!menu.anchorEl}
        onClose={() => menu.send("close")}
      >
        {/* <pre>
      {JSON.stringify(component,0,2)}
      </pre> */}
        <Box sx={{ p: 2 }}>
          <Nowrap variant="subtitle2">Settings</Nowrap>
          <Columns columns="40% 1fr" sx={{ maxWidth: 600, minWidth: 400 }}>
            {!component.settings?.length && <>No settings</>}
            {component.settings?.map((s) => (
              <>
                <SectionHead nopadding>{s.SettingName}</SectionHead>
                <SectionHead nopadding>{s.SettingValue}</SectionHead>
              </>
            ))}
          </Columns>
          <Nowrap sx={{ mt: 2 }} variant="subtitle2">
            Styles
          </Nowrap>
          <Columns columns="40% 1fr" sx={{ maxWidth: 600, minWidth: 400 }}>
            {!component.styles?.length && <>No styles</>}
            {component.styles?.map((s) => (
              <>
                <SectionHead nopadding>{s.Key}</SectionHead>
                <SectionHead nopadding>{s.Value}</SectionHead>
              </>
            ))}
          </Columns>
          <Nowrap sx={{ mt: 2 }} variant="subtitle2">
            Bindings
          </Nowrap>
          <Columns columns="30% 30% 1fr" sx={{ maxWidth: 600, minWidth: 400 }}>
            {!component.boundProps?.length && <>No bindings</>}
            {component.boundProps?.map((s) => (
              <>
                <SectionHead nopadding>{s.attribute}</SectionHead>
                <SectionHead sx={{ overflow: "hidden" }} nopadding>
                  {s.boundTo}
                </SectionHead>
                <SectionHead nopadding>
                  {JSON.stringify(getBindings(s.boundTo, {
                    appProps, 
                    pageProps: stateProps
                  }))}
                </SectionHead>
              </>
            ))}
          </Columns>
        </Box>
      </Popover>
    </>
  );
};

const ComponentTree = ({ components, componentID }) => {
  const context = React.useContext(AppStateContext);
 
  if (!components?.length) return;
  // console.log ({ data: context.datasets })
  const componentList = components
    .filter((c) => c.componentID === componentID)
    .sort(sortByOrder);
  return componentList.map((c) => (
    <ComponentData
      stateProps={context.stateProps}
      datasets={context.datasets}
      appProps={context.appProps}
      components={components}
      application={context.application}
      library={context.library}
      selectedPage={context.selectedPage} 
      delegateProps={context.delegateProps}
      component={c}
    />
  ));
};
ComponentTree.defaultProps = {};
export default ComponentTree;
