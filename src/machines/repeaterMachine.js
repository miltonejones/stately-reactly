import React from 'react'; 
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { EditorStateContext } from '../context';

// add machine code
const repeaterMachine = createMachine({
  id: "repeater_bind",
  initial: "start",
  states: {
    start: {
      initial: "load",
      states: {
        load: {
          invoke: {
            src: "loadComponent",
            onDone: [
              {
                target: "idle",
                actions: "assignComponentBindings",
              },
            ],
          },
        },
        idle: {
          on: {
            SAVE: {
              target: "#repeater_bind.saving",
            },
            LOAD: {
              target: "#repeater_bind.start",
            },
            ADD: {
              actions: "appendProp",
            },
            CHANGE: {
              actions: "assignChange",
            },
            DROP: {
              actions: "dropBinding",
            },
          },
        },
      },
    },
    saving: {
      invoke: {
        src: "commitChanges",
        onDone: [
          {
            target: "start",
          },
        ],
      },
    },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    appendProp: assign((context, event) => {
      return {
        bindingProp: {
          ...context.bindingProp,
          dirty: true,
          bindings: {
            ...context.bindingProp.bindings, 
            [event.key]: {
            
            }
          }
        }
      }

    }),
    assignChange: assign((context, event) => {
      const { bindableProps } = context;
      const bindableProp = bindableProps.find(f => f.title === event.value);


      return {
        bindingProp: {
          ...context.bindingProp,
          dirty: true,
          bindings: {
            ...context.bindingProp.bindings, 
            [event.key]: bindableProp
          }
        }
      }


    }),
    dropBinding: assign((context, event) => {
      const { bindingProp } = context;
      delete bindingProp.bindings[event.key];
      return {
        bindingProp: {
          ...bindingProp,
          dirty: true,
        }
      }
    }),
    assignComponentBindings: assign((_, event) => {
      const { component, library, components, bindingProp } = event.data
      const { bindings } = bindingProp;
      const childComponent = components?.find(f => f.componentID === component?.ID);
      const libraryRef = !childComponent ? null : library[childComponent.ComponentType];
      const bindableProps = !libraryRef ? [] : libraryRef.Settings?.categories.reduce((array, category) => {
        const settings = category.settings.filter(f => f.bindable);
        settings.map(f => array = array.concat({
          title: `${childComponent.ComponentName}.${f.label}`,
          componentID: childComponent.ID,
          SettingName: f.label
        }))
        return array
      }, []);

      const fixed = Object.keys(bindings).reduce((out, key) => {
        const { componentID, SettingName } = bindings[key];
        const target = components?.find(f => f.ID === componentID);

        out[key] = {
          componentID,
          SettingName,
          title: `${target?.ComponentName}.${SettingName}`
        };
        return out;

      }, {})

 
      return {
        bindingProp: {
          ...bindingProp,
          bindings: fixed
        },
        bindableProps 
      }
    })
  }
}
);

export const useRepeater = ({
  component,
  bindingProp,
  onChange
}) => {
  const [state, send] = useMachine(repeaterMachine, {
    services: { 
      commitChanges: async (context) => onChange && onChange(context.bindingProp),
      loadComponent: async () => ({
        component,
        bindingProp: {
          ...bindingProp,
          dirty: false
        },
        library: editor.library,
        components: editor.components
      })

  },
  }); 
  const editor = React.useContext(EditorStateContext);

  // React.useEffect(() => {
  //   send('LOAD')
  // }, [bindingProp, send])
    
  return {
    state,
    send, 
    ...state.context
  };
}
