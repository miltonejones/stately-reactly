import * as React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getBindings } from '../util/getBindings';
import { getSettings } from '../util/getSettings';
import { objectReduce } from '../util/objectReduce';
import { AppStateContext } from '../context';

// add machine code
const componentRenderMachine = createMachine({
  id: "render_machine",
  initial: "start",
  states: {
    start: {
      invoke: {
        src: "getDefinitions",
        onDone: [
          {
            target: "configure",
            actions: "assignDefinitions",
          },
        ],
      },
    },
    render: {
      description: "Render component",
      initial: "idle",
      states: {
        idle: {
          on: {
            UPDATE: {
              target: "updating",
            },
          },
        },
        updating: {
          initial: "refreshing",
          states: {
            refreshing: {
              invoke: {
                src: "getDefinitions",
                onDone: [
                  {
                    target: "update_settings",
                    actions: "assignDefinitions",
                  },
                ],
              },
            },
            update_settings: {
              entry: "assignComponentSettings",
              after: {
                5: {
                  target: "#render_machine.render.idle",
                  actions: [],
                  internal: false,
                },
              },
            },
          },
        },
      },
    },
    configure: {
      description: "load styles, settings and events",
      initial: "get_settings",
      states: {
        get_settings: {
          entry: "assignComponentSettings",
          after: {
            5: {
              target: "#render_machine.configure.get_styles",
              actions: [],
              internal: false,
            },
          },
        },
        get_styles: {
          entry: "assignComponentStyles",
          after: {
            5: {
              target: "#render_machine.configure.get_events",
              actions: [],
              internal: false,
            },
          },
        },
        get_events: {
          entry: "assignComponentEvents",
          after: {
            5: {
              target: "#render_machine.render",
              actions: [],
              internal: false,
            },
          },
        },
      },
    },
  },
  context: { properties: {}, styles: {}, events: {} },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignDefinitions: assign ((context, event) => {
      const {
        component,
        pageProps,
        appProps,
        selectedPage
      } = event.data; 
      return {
        component,
        pageProps,
        appProps,
        selectedPage,
        color: "error"
      };
    }),
    assignComponentSettings: assign ((context, event) => {
      const { component, selectedPage, appProps, pageProps } = context;
      const { scripts, boundProps = [] } = component;
      const properties = getSettings(component.settings);
    

      boundProps.map(boundProp => Object.assign(properties, {
        [boundProp.attribute]: getBindings(boundProp.boundTo, appProps, pageProps, { scripts, selectedPage })
      }))

      return {
        properties,
        color: "warning"
      };
    }),
    assignComponentEvents: assign ((context, event) => {
      const { component } = context; 
      const { events } = component;
      const handlers = events.reduce((out, ev) => {
        out[ev.event] = e => {
          alert (ev.action.type)
        }
        return out;
      }, {});

      return {
        events: handlers
      }

    }),
    assignComponentStyles: assign ((context, event) => {
      const { component } = context; 
      return {
        styles: objectReduce(component.styles),
        color: "success"
      };
    }),
  }
});

export const useComponentRender = ({
  component,
  pageProps,
  appProps, 
  selectedPage
}) => {
  const [state, send] = useMachine(componentRenderMachine, {
    services: {
      getDefinitions: async () => ({
        component,
        pageProps,
        appProps, 
        selectedPage
      })
     },
  }); 

  const reactly = React.useContext(AppStateContext);

  const setState = (props, scope) => {
    reactly.send({
      type: 'SETSTATE',
      props,
      scope
    })
  }

  React.useEffect(() => {
    if (reactly.state.matches('edit.loaded.idle.static')) {
      send('UPDATE')
    }
  }, [reactly.state, send])

  return {
    state,
    send, 
    setState,
    scripts: reactly.getApplicationScripts(),
    ...state.context
  };
}
