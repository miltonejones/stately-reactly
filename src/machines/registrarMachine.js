
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { uniqueId } from '../util/uniqueId';

// add machine code
const registrarMachine = createMachine({
  id: "registrar",
  initial: "working",
  states: {
    opened: {
      initial: 'idle',
      states: {
        idle: {},
        view_state: {
          on: {
            EXIT: {
              target: "idle",
              actions: assign({ selectedOption: null, selectedProp: null})
            }
          }
        },
        view_log: {
          on: {
            EXIT: {
              target: "idle",
              actions: assign({ selectedOption: null, selectedProp: null})
            }
          }
       }
      },
      on: {
        RESTATE: {
          actions: assign((_, event) => ({
            [event.key]: event.value
          }))
        },
        LOG: {
          actions: "assignLog"
        },
        VIEW: {
          target: "#registrar.opened.view_log",
          actions: [assign((_, event) => ({
            selectedOption: event.ID,
            selectedProp: null
          }))],
        },
        STATE: {
          target: "#registrar.opened.view_state",
          actions: [assign((_, event) => ({
            selectedProp: event.prop,
            selectedOption: null
          }))],
        },
        CLOSE: {
          target: "working",
          actions: assign({ open: false })
        }
      }
    },
 

    working: {
      initial: "idle",
      states: {
        idle: {
          on: {
            LOG: {
              actions: "assignLog"
            },
            OPEN: { 
              target: "#registrar.opened",
              actions: [assign({ open: true })],
            },
          },
        },
      },
      on: {
        REGISTER: {
          actions: "registerMachine",
        },
      },
    },
  },
  context: { 
    machines: {}, 
    open: false, 
    logitems: [], 
    maxitems: 50, 
    selectedTab: 0 
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    clearMachine: assign(() => ({
      machine: null
    })),
    assignLog: assign((context, event) => ({
      logitems: [event.entry].concat(context.logitems.slice(0, context.maxitems))
    })), 
    registerMachine: assign((context, event) => ({
      machines: {
        ...context.machines,
        [event.machine+event.instance]: { 
          id: event.machine,
          args: event.args
        }
      }
    }))
  }
});

export const useRegistrar = () => {
  const [state, send] = useMachine(registrarMachine, {
    services: { },
  }); 

  const register = (opts) => {
    send({
      type: 'REGISTER',
      ...opts
    })
  }

  const log = (message, label, param, ...options) => {
    console.log (message, label, param, { options })
    send({
      type: 'LOG',
      entry: {
        message, label, param, options, ID: uniqueId(),
        stamp: new Date().getTime()
      }
    })
  }

  return {
    state,
    send, 
    register,
    log,
    ...state.context
  };
}
