import * as React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getBindings } from '../util/getBindings';
import { getSettings } from '../util/getSettings';
import { objectReduce } from '../util/objectReduce';
import { AppStateContext } from '../context';
import { findMatches } from '../util/findMatches';
import { report } from '../util/report';

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
              actions: assign((_, event) => {
                if (event.datasets) {
                  return {
                    datasets: event.datasets
                  }
                }
              })
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
              entry: ["assignComponentSettings", "assignComponentBindings"],
              after: {
                1: {
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
          entry: ["assignComponentSettings", "assignComponentBindings"],
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
      
      // console.log ({
      //   pageProps,
      //   appProps
      // })
      return {
        component,
        pageProps,
        appProps,
        selectedPage,
        color: "error"
      };
    }),
    assignComponentBindings: assign ((context, event) => {
      const { component, properties, datasets } = context;
      // !!datasets && report(datasets, `context datasets`);
      const args = getSettings(component.settings);
      if (args.bindings && datasets) {
        // const bindings = JSON.parse(args.bindings);


        const bindingObject = JSON.parse(args.bindings); 
      report(bindingObject, `${component.ComponentName} bindings`);
      //  console.log({bindingObject}, 'usePageResourceState')
        const columnMap = bindingObject.columnMap || Object.keys(bindingObject.bindings) 
        const typeMap = bindingObject.typeMap || {}
        // const id = bindingObject.resourceID;
        const resource = datasets[bindingObject.resourceID]; //.find(f => f.resourceID === bindingObject.resourceID);

        const records = resource?.records  || resource;

        if (records?.map) {
          // console.log({ bindingObject })
          const dataRows = records.map(record => {
            return columnMap.reduce((items, res) => {

              // const { settings } = typeMap[res] ?? {};
              // console.log ({ settings })

              items[bindingObject.bindings[res]] = record[ res ]
              return items;
            }, {})
          });

          return {
            properties: {
              ...properties,
              dataRows,
              columnMap,
              resource,
              columnNames: bindingObject.bindings,
              typeMap
            }
          }
        } 

      }

    }),
    assignComponentSettings: assign ((context, event) => {
      const { component, selectedPage, appProps, pageProps } = context;
      const { scripts, boundProps = [] } = component;
      const args = getSettings(component.settings);
    

      boundProps.map(boundProp => Object.assign(args, {
        [boundProp.attribute]: getBindings(boundProp.boundTo, { 
          appProps, 
          pageProps, 
          scripts, 
          selectedPage 
        })
      }));

      const properties = !args ? {} 
        : Object.keys(args).reduce((out, arg) => {

          const bracketTest = /\{([^}]+)\}/g

          let deterpolatedText = args[arg];

          if (typeof deterpolatedText === 'string') {

            // loop through all matches and replace value
            findMatches(bracketTest, deterpolatedText).map(match => {
              const [ wholeText, foundText ] = match; 

              const innerText = getBindings(foundText, { 
                appProps, 
                pageProps, 
                scripts, 
                selectedPage 
              })

              return deterpolatedText = deterpolatedText.replace(wholeText, innerText)
        
            }) 

            // out[arg] = deterpolatedText;
            // return out;

          }
  
          out[arg] = deterpolatedText; 
          return out;

        }, {})

      // console.log ({
      //   name: component.ComponentName,
      //   appProps,
      //   pageProps,
      //   properties
      // })

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
  datasets,
  selectedPage
}) => {
  const [state, send] = useMachine(componentRenderMachine, {
    services: {
      getDefinitions: async () => ({
        component,
        pageProps,
        appProps, 
        datasets,
        selectedPage
      })
     },
  }); 

  const reactly = React.useContext(AppStateContext);

  const setState = (scope, fn) => {
    const props = fn(appProps, pageProps)
    reactly.send({
      type: 'SETSTATE',
      props,
      scope
    })
  }

  const modalOpen = (ID, open) => {
    reactly.send({
      type: 'MODAL',
      ID,
      open
    })
  }

  // const setState = (props, scope) => {
  //   reactly.send({
  //     type: 'SETSTATE',
  //     props,
  //     scope
  //   })
  // }

  React.useEffect(() => {
    if (reactly.state.matches('edit.loaded.idle.static')) { 
      send({
        type: 'UPDATE',
        datasets: reactly.state.context.datasets
      });
      // console.log ({update: reactly.state.context.datasets})
    }
  }, [reactly.state, send])

  return {
    state,
    send, 
    setState,
    modalOpen,
    scripts: reactly.getApplicationScripts(),
    ...state.context
  };
}
