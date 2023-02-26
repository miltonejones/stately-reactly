
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { uniqueId } from '../util/uniqueId';

// add machine code
const listBuilderMachine = createMachine({
  id: "list_builder",
  initial: "start",
  states: {
    start: {
      description: "load component binding text",
      invoke: {
        src: "loadBinding",
        onDone: [
          {
            target: "ready",
            actions: "assignBindProps",
            description: "assign text and JSON parsed object to context",
          },
        ],
      },
    },
    ready: {
      description: "Form is in idle mode",
      on: {
        EDIT: {
          target: "editing",
          actions: "assignItem",
        },
        CREATE: {
          target: "saving",
          actions: ["appendItem", "assignJSON"],
        },
        DROP: {
          target: "saving",
          actions: ["dropItem", "clearItem", "assignJSON"],
        },
      },
    },
    editing: {
      description: "A list item has been selected for editing",
      on: {
        SAVE: [
          {
            target: "saving",
            cond: (_, event) => !event.close
          },
          {
            target: "saving",
            actions: "clearItem",
          }
        ],
        CLOSE: {
          target: "ready",
          actions: "clearItem",
        },
        UPDATE: {
          actions: ["applyChanges", "assignJSON"],
        },
        CREATE: {
          target: "saving",
          actions: ["appendItem", "assignJSON"],
        },
        DROP: {
          target: "saving",
          actions: ["dropItem", "clearItem", "assignJSON"],
        },
      },
    },
    saving: {
      initial: "save",
      states: {
        save: {
          invoke: {
            src: "itemSaved",
            onDone: [
              {
                target: "reload",
                cond: "itemIsEditing",
                actions: assign({ dirty: false })
              },
              {
                target: "#list_builder.ready",
                actions: "clearItem",
              }
            ],
          },
        },
        reload: {
          description: "reload binding data before re-rendering",
          invoke: {
            src: "loadBinding",
            onDone: [
              {
                target: "#list_builder.editing",
              },
            ],
          },
        },
      },
    },
  },
  context: { bindingProp: [], selectedID: 0 },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    itemIsEditing: context => !!context.ID
  },
  actions: {
    assignJSON: assign((context) => ({
      value: JSON.stringify(context.bindingProp)
    })),
    dropItem: assign((context, event) => {
      const { ID } = event;  
      return { 
        bindingProp: context.bindingProp.filter(f => f.ID !== ID)
      }
    }),
    appendItem: assign((context, event) => {
      const { text } = event;

      const item = {
        ID: uniqueId(),
        text,
        value: text
      }

      return {
        ID: item.ID,
        item, 
        bindingProp: context.bindingProp.concat(item)
      }
    }),
    applyChanges: assign((context, event) => {
      const item = { 
        ...context.item,
        [event.key]: event.value
      };
      const bindingProp = context.bindingProp.map(prop => prop.ID === item.ID 
          ? item 
          : prop);

      return {
        dirty: true,
        item,
        bindingProp, 
      }

    }),
    clearItem: assign(({
      dirty: false,
      ID: null,
      item: null
    })),
    assignItem: assign((context, event) => {
      const { ID } = event ;
      const item = context.bindingProp.find(f => f.ID === ID); 
      return { 
        ID,
        item
      }
    }),
    assignBindProps: assign((_, event) => {
      const value = event.data;
      const bindingProp = !value 
        ? {}
        : JSON.parse(value);
      return {
        value,
        bindingProp
      }
    })
  }
});

export const useListBuilder = ({
  value,
  onChange
}) => {
  const [state, send] = useMachine(listBuilderMachine, {
    services: { 
      loadBinding: async () => value,
      itemSaved: async (context) => onChange && onChange(context.value)
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
