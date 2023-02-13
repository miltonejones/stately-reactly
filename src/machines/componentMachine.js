import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { uniqueId } from '../util/uniqueId';

// add machine code
const componentMachine = createMachine(
  {
    id: "component_machine",
    initial: "init",
    states: {
      init: {
        invoke: {
          src: "loadComponentSettings",
          onDone: [
            {
              target: "idle",
              actions: "assignComponentSettings",
            },
          ],
        },
      },
      idle: {
        on: {
          ADDSCRIPT: {
            target: "changing",
            actions: "createBoundScript"
          },
          SCRIPT: {
            target: "changing",
            actions: "assignScriptProps"
          },
          CHANGE: {
            target: "changing",
            actions: "assignChangeProps",
          },
          BIND: {
            target: "changing",
            actions: "assignBindProps"
          }
        },
      },
      changing: {
        invoke: {
          src: "componentChanged",
          onDone: [
            {
              target: "init",
            },
          ],
          onError: [
            {
              target: "change_error",
              actions: "assignProblem",
            },
          ],
        },
      },
      change_error: {
        on: {
          RETRY: {
            target: "changing",
          },
          CANCEL: {
            target: "idle",
          },
        },
      }, 
    },
    context: { component: {} },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      assignComponentSettings: assign((context, event) => {
        console.log({ event });
        return {
          component: event.data,
        };
      }),
      createBoundScript: assign((context, event) => {
        const { attribute } = event;
        const { component } = context;
        const script = {
          ID: uniqueId(),
          name: 'new_script_for_now',
          code: "// add your code",
          componentID: context.component.ID,
          appID: context.component.appID,
        };
        if (!component.scripts) {
          Object.assign(component, { scripts: []})
        }
        if (!component.boundProps) {
          Object.assign(component, { boundProps: []})
        }

 

        return {
          scriptID: script.ID,
          component: {
            ...component,
            scripts: [
              ...component.scripts,
              script
            ],
            boundProps: [
              ...component.boundProps,
              {
                attribute,
                boundTo: `scripts.${script.ID}`
              }
            ]
          }
        }
      }),
      assignBindProps: assign((context, event) => {
        const { Key, Value, unbind } = event;
        const { component } = context;
        const { boundProps: old = [], ...rest } = component;
        const boundProps = old
          .filter((prop) => prop.attribute !== Key);
      
        return {
          component: {
            ...rest,
            boundProps: unbind 
              ? boundProps 
              : boundProps.concat({
                  boundTo: Value,
                  attribute: Key,
                })
          },
        };
      }),
      assignScriptProps: assign((context, event) => {
        const { ID, name, code } = event;
        const { component } = context;
        if (!component.scripts) {
          Object.assign(component, { scripts: []})
        }
        const script = component.scripts.find((s) => s.ID === ID);

        const scripts = component.scripts
          .filter((script) => script.ID !== ID)
          .concat({
            ...script,
            ID: ID || uniqueId(), 
            name, 
            code,
          });
           
          return {
            component: {
              ...component,
              scripts,
            },
          }; 
      }),
      assignChangeProps: assign((context, event) => {
        const { Key, Value, node } = event;
        const { component } = context; 


        if (node === 'styles') { 
          const styles = component.styles
            .filter((style) => style.Key !== Key)
            .concat({
              Key, Value,
            });
  
          return {
            component: {
              ...component,
              styles,
            },
          };
        }
          
        const settings = component.settings
          .filter((setting) => setting.SettingName !== Key)
          .concat({
            SettingName: Key,
            SettingValue: Value,
          });
          

        return {
          component: {
            ...component,
            settings,
          },
        };
      }),
      assignProblem: assign((context, event) => {
        return {
          error: event.message,
          stack: event.stack,
        };
      }),
    },
  }
);

export const useComponent = ({ component, onChange }) => {
  const [state, send] = useMachine(componentMachine, {
    services: {
      loadComponentSettings: async () => component,
      componentChanged: async (context) => {
        onChange && onChange(context.component);
      },
    },
  });

  return {
    state,
    send,
    ...state.context,
  };
};
