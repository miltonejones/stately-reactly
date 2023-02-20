
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const registrarMachine = createMachine({
  id: "registrar",
  initial: "working",
  states: {
    opened: {
      on: {
        VIEW: {
          target: "view_machine",
          actions: ["assignMachine", assign({ open: true })],
        },
        CLOSE: {
          target: "working",
          actions: assign({ open: false })
        }
      }
    },

    view_machine: {
      on: {
        CLOSE: {
          target: "#registrar.opened",
          actions: ["clearMachine"],
        },
      },
    },

    working: {
      initial: "idle",
      states: {
        idle: {
          on: {
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
  context: { machines: {}, open: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    clearMachine: assign(() => ({
      machine: null
    })),
    assignMachine: assign((_, event) => ({
      machine: event.machine
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

  return {
    state,
    send, 
    register,
    ...state.context
  };
}
