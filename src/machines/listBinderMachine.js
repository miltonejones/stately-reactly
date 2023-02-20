
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
        },
      },
    },
    editing: {
      on: {
        SAVE: {
          target: "saving",
        },
        CANCEL: {
          target: "idle", 
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
      invoke: {
        src: "bindingSaved",
        onDone: [
          {
            target: "idle",
          },
        ],
      },
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
        onChange && onChange(context.column)
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
