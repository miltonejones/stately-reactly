
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const listBinderMachine = createMachine({
  id: "list_bind_config",
  initial: "load",
  states: {
    load: {
      invoke: {
        src: 'loadBinding',
        onDone: [
          {
            target: 'idle',
            actions: assign((_, event) => ({
              column: event.data
            }))
          }
        ]
      }
    },
    idle: {
      on: {
        EDIT: {
          target: "editing", 
          actions: assign((_, event) => ({
            key: event.key
          }))
        },
        DELETE: {
          actions: "removeColumn",
          target: "saving",
        },
        ADD: {
          actions: "appendColumn",
          target: "saving",
        },
      },
    },
    editing: {
      on: {
        EDIT: { 
          actions: assign((_, event) => ({
            key: event.key
          }))
        },
        SAVE: {
          target: "saving",
        },
        CANCEL: {
          target: "idle", 
          actions: assign(() => ({
            key: null
          }))
        },
        DELETE: {
          actions: "removeColumn",
          target: "saving",
        },
        ADD: {
          actions: "appendColumn",
          target: "saving",
        },
        CHANGE: {
          actions: "assignLabel",
        },
        TYPE: {
          actions: "assignType",
        },
        SETTING: {
          actions: "applySetting",
        },
      },
    },
    saving: {
      initial: 'save',
      states: {
        save: {
          invoke: {
            src: "bindingSaved",
            onDone: [
              {
                target: "load",
              },
            ],
          },
        },
        // pause: {
        //   after: {
        //     1999: {
        //       target: 'load'
        //     }
        //   } 
        // },
        load: { 
          invoke: {
            src: 'loadBinding',
            onDone: [
              {
                target: '#list_bind_config.editing',
                actions: assign((_, event) => ({
                  column: event.data
                }))
              }
            ]
          }
        }
      } 
    },
  },
  context: { column: {} },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignLabel: assign((context, event) => ({ 
      column: {
        ...context.column,
        dirty: true,
        bindings: {
          ...context.column.bindings,
          [event.key]: event.value
        }
      }
    })),
    appendColumn: assign((context, event) => ({ 
      key: event.key,
      column: {
        ...context.column,
        dirty: true,
        bindings: {
          ...context.column.bindings,
          [event.key]: event.key
        },
        columnMap: context.column.columnMap.concat(event.key),
        typeMap: {
          ...context.column.typeMap,
          [event.key]: { 
            type: 'Text',
            settings: {}
          }
        }
      }
    })),
    removeColumn: assign((context, event) => {
      const { bindings, typeMap, columnMap } = context.column;
      delete bindings[event.key];
      delete typeMap[event.key];

      return { 
        key: null,
        column: {
          ...context.column,
          dirty: true,
          bindings,
          typeMap ,
          columnMap: columnMap.filter(f => f !== event.key)
        }
      }
    }),
    assignType: assign((context, event) => ({
      column: {
        ...context.column,
        dirty: true,
        typeMap: {
          ...context.column.typeMap,
          [event.key]: {
            ...context.column.typeMap[event.key],
            type: event.value
          }
        }
      }
    })), 
    applySetting: assign((context, event) => ({ 
      column: {
        ...context.column,
        dirty: true,
        typeMap: {
          ...context.column.typeMap,
          [event.setting]: {
            ...context.column.typeMap[event.setting],
            settings: { 
              ...context.column.typeMap[event.setting].settings,
              [event.key]: event.value 
            } 
          }
        }
      }
    })), 
  }
});

export const useListBinder = ({
    bindingProp,
    onChange
  }) => {
  const [state, send] = useMachine(listBinderMachine, {
    services: { 
      loadBinding: async () => ({...bindingProp, dirty: false}),
      bindingSaved: async (context) => {
        onChange && onChange(context.column);
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
