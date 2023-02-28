
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { assignProblem } from "../util/assignProblem";
import { clearProblems } from "../util/clearProblems";
import { useRunScript } from './handlers/runScript';
import { useSetState } from './handlers/setState';
import { useModalOpen } from './handlers/modalOpen';
// import { uniqueId } from '../util/uniqueId';

// add machine code
const dataEventMachine = createMachine({
  id: "data_event",
  initial: "reg",
  states: {
    reg: {
      invoke: {
        src: "register",
        onDone: [
          {
            target: "ready",
            actions: assign((_, event) => ({
              registrar: event.data
            }))
          }
        ]
      }
    },
    ready: {
      on: {
        EXEC: {
          target: "load_props",
          actions: ["assignEventProps", assign({ event_index: 0 })],
        },
      },
    },
    load_props: {
      entry: "assignNextEvent",
      invoke: {
        src: "loadApplicationProps",
        onDone: [
          {
            target: "set_state",
            cond: "isSetState",
          },
          {
            target: "modal_open",
            cond: "isModalOpen",
          },
          {
            target: "run_script",
            cond: "isRunScript",
          },
        ],
      },
    },
    set_state: {
      invoke: {
        src: "setState",
        onDone: [
          {
            target: "next",
            actions: "incrementIndex",
          },
        ],
      },
    },
    modal_open: {
      invoke: {
        src: "modalOpen",
        onDone: [
          {
            target: "next",
            actions: "incrementIndex",
          },
        ],
        onError: [
          {
            target: "exec_error",
            actions: "assignProblem",
          },
        ],
      },
    },
    run_script: {
      invoke: {
        src: "runScript",
        onDone: [
          {
            target: "next",
            actions: "incrementIndex",
          },
        ],
        onError: [
          {
            target: "exec_error",
            actions: "assignProblem",
          },
        ],
      },
    },
    next: {
      on: {
        EXEC: {
          target: "load_props",
          actions: ["assignEventProps", assign({ event_index: 0 })],
        },
      },
      after: {
        "5": [
          {
            target: "#data_event.load_props",
            cond: "hasMoreEvents",
            actions: [],
            internal: false,
          },
          {
            target: "#data_event.ready",
            actions: [assign({ event_index: 0, events: [] })],
            internal: false,
          },
        ],
      },
    },
    exec_error: {
      on: {
        EXEC: {
          target: "load_props",
          actions: ["assignEventProps", assign({ event_index: 0 })],
        },
        RECOVER: {
          target: "next",
          actions: "clearProblems",
        },
      },
    },
  },
  context: { event_index: 0, event: null, events: [] },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isModalOpen: (context) => context.action.type === 'modalOpen', 
    isSetState: (context) => context.action.type === 'setState',
    isRunScript: (context) => context.action.type === 'scriptRun', 
    hasMoreEvents: (context) => context.event_index < context.events.length,
  },

  actions: {
    assignNextEvent: assign((context) => {
      const { action } = context.events[context.event_index];
      !!context.registrar && context.registrar.log ("data event %c'%s' action", 'color:red', action.type, { action } )
      return {
        action
      }
    }),
    assignEventProps: assign((context, event) => {
      const { application, events, scripts, selectedPage, data } = event;
     !!context.registrar && context.registrar.log ('Assigning %c%s', 'font-weight:bold', 'event props', { events })
      return {
        application, events, scripts, selectedPage, data
      }
    }),
    incrementIndex: assign((context) => {
      !!context.registrar && context.registrar.log ("Index %d", 'color: cyan', context.event_index, context.action)
      return {
        event_index: context.event_index + 1,
      }
    }),
    clearProblems,
    assignProblem,
  }

});
 
export const useDataEvent = (props) => {

  const { runScript } = useRunScript(props.scriptOptions);
  const { setState } = useSetState(props.setState, props.registrar);
  const { modalOpen } = useModalOpen(props.modalOpen);

  const [state, send] = useMachine(dataEventMachine, {
    services: {
      register: async () => { 
        return props.registrar
      },
      runScript,
      setState,
      modalOpen, 

      loadApplicationProps: async() => ({
        ...props
      })
     },
  }); 

 
  return {
    state,
    send, 
    ...state.context
  };
}
