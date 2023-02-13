
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
// import { assignProps } from '../util/assignProps';
import { uniqueId } from '../util/uniqueId';

// add machine code
const eventHandlerMachine = createMachine({
  id: "event_handler_machine",
  initial: "ready",
  states: {
 
    ready: {
      description: "List handled  events  and  wait for requests",
      on: {
        EDIT: {
          target: "editing",
          actions: assign((context, event) => ({
            eventProp: event.eventProp
          })),
        }, 
      },
    },
    editing: {
      description: "Edit new or existing event handler",
      on: {
        CHANGE: {
          actions: ["applyChangeProps", assign({ dirty: true })],
          description: "apply changes to event",
        },
        SAVE: {
          target: "commit",
        },
        CLOSE: [
          {
            target: "ready",
            cond: "changesCommitted",
            actions: assign({ eventProp: null }),
            description: "Close if all changes have been committed",
          },
          {
            target: "confirm",
          },
        ],
      },
    },
    commit: {
      description: "Save and refresh event.",
      invoke: {
        src: "eventChanged",
        onDone: [
          {
            target: "ready",
            actions: [assign({ dirty: false })],
          },
        ],
      },
    },
    confirm: {
      description: "User must confirm closing when there are pending changes",
      on: {
        CONFIRM: {
          target: "ready",
          actions: [assign({ dirty: false }), assign({ eventProp: null })],
        },
        CANCEL: {
          target: "editing",
        },
        SAVE: {
          target: "commit"
        }
      },
    },
  },
  context: {
    dirty: false,
    eventProp: null, 
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    changesCommitted: context => !context.dirty
  },
  actions: {  
    applyChangeProps:  assign((context, event) => {
      const {ID, Key, Value, unlink } = event;  
      return {
        eventProp : {
          ...context.eventProp,
          ID: ID || uniqueId(),
          [Key]: Value,
          unlink
        } 
      }
    }) 
  }
});

export const useEventHandler = ({ 
  eventsChanged, 
}) => {
  const [state, send] = useMachine(eventHandlerMachine, {
    services: {  
      eventChanged: async(context) => {
        eventsChanged && eventsChanged(context.eventProp)
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
