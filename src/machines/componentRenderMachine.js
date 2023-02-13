
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getBindings } from '../util/getBindings';
import { getSettings } from '../util/getSettings';
import { objectReduce } from '../util/objectReduce';

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
      on: {
        REFRESH: {
          target: "start",
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
            "500": {
              target: "#render_machine.configure.get_styles",
              actions: [],
              internal: false,
            },
          },
        },
        get_styles: {
          entry: "assignComponentStyles",
          after: {
            "500": {
              target: "#render_machine.render",
              actions: [],
              internal: false,
            },
          },
        },
      },
    },
  },
  context: { properties: {}, styles: {} },
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
      console.log ({ event })
      return {
        component,
        pageProps,
        appProps,
        selectedPage,
        color: "error"
      };
    }),
    assignComponentSettings: assign ((context, event) => {
      const { component,  appProps, pageProps } = context;
      const { boundProps = [] } = component;
      const args = getSettings(component.settings);
      const properties = Object.keys(args).reduce((out, key) => {
        const boundProp = boundProps.find(prop => prop.attribute === key);
        if (boundProp) {
          out[key] = getBindings(boundProp.boundTo, appProps, pageProps); 
          return out;
        }
        out[key] = args[key];
        return out;
      }, {})

      return {
        properties,
        color: "warning"
      };
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

  return {
    state,
    send, 
    ...state.context
  };
}
