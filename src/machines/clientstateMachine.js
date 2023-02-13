
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { uniqueId } from '../util/uniqueId';

// add machine code
const clientstateMachine = createMachine({
  id: "client_state_machine",
  initial: "idle",
  states: {
    idle: {
      initial: 'load',
      states: {
        load: {
          invoke: {
            src: "refreshStateProps",
            onDone: [{ 
              actions: assign((context, event) => ({
                stateProps: event.data
              }))
            }]
          }
        }
      },
      on: {
        OPEN: {
          target: "opened", 
        },
      },
    },
    opened: {
      initial: "refresh",
      states: { 
        refresh: {
          invoke: {
            src: "refreshStateProps",
            onDone: [{
              target: "loaded",
              actions: "assignStateProps"
            }]
          }
        },
        loaded: {
          on: {
            CLOSE: {
              target: "#client_state_machine.idle",
              actions: assign({
                open: false, 
              })
            },
            CHANGE: {
              target: "changing",
              actions: "assignChangeProps",
            },
          },
        },
        changing: {
          invoke: {
            src: "statePropsChanged",
            onDone: [
              {
                target: "refresh",
              },
            ],
          },
        },
      },
    },
  },
  context: { open: false, stateProps: [] },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignStateProps: assign((context, event) => {
      return {
        stateProps: event.data,
        open: true
      }
    }),
    assignChangeProps: assign((context, event) => {
      const {ID, Key, Value, unlink } = event;
      const prop = context.stateProps.find(d => d.ID === ID);
      const stateProp = {
        ...prop,
        ID: ID || uniqueId(),
        [Key]: Value,
        unlink
      } 
      return {
        stateProp 
      }
    })
  }
});

export const useClientState = ({ refreshProps, propsChanged }) => {
  const [state, send] = useMachine(clientstateMachine, {
    services: {  
      statePropsChanged: async (context) => {
        propsChanged && propsChanged(context.stateProp)
      } ,

      refreshStateProps: async () => {
        return refreshProps()
      } 
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
