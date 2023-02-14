
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { executeScript } from '../util/executeScript';
import { assignProblem } from "../util/assignProblem";
import { clearProblems } from "../util/clearProblems";

// add machine code
const eventDelegateMachine = createMachine({
  id: "event_delegate",
  initial: "ready",
  states: {
    ready: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadApplicationProps",
            onDone: [
              {
                target: "waiting",
                actions: "assignApplicationProps",
              },
            ],
          },
        },
        waiting: {},
      },
      on: {
        openLink: {
          target: "open_link",
          actions: "assignEventProps",
        },
        scriptRun: {
          target: "run_script",
          actions: "assignEventProps",
        },
        setState: {
          target: "set_state",
          actions: "assignEventProps",
        },
        dataExec: {
          target: "data_exec",
          actions: "assignEventProps",
        },
        modalOpen: {
          target: "modal_open",
          actions: "assignEventProps",
        },
      },
    },
    open_link: {
      invoke: {
        src: "openLink",
        onDone: [
          {
            target: "ready",
          },
        ],
      },
    },
    run_script: {
      invoke: {
        src: "runScript",
        onDone: [
          {
            target: "ready",
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
    set_state: {
      invoke: {
        src: "setState",
        onDone: [
          {
            target: "ready",
          },
        ],
      },
    },
    data_exec: {
      invoke: {
        src: "dataExec",
        onDone: [
          {
            target: "ready",
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
    modal_open: {
      invoke: {
        src: "modalOpen",
        onDone: [
          {
            target: "ready",
          },
        ],
      },
    },  
    exec_error: {
      description: "Display any errors returned by the event",
      on: {
        RECOVER: {
          target: "#event_delegate.ready.waiting",
          actions: "clearProblems",
        },
      },
    }, 
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignApplicationProps: assign((context, event) => ({ 
      application: event.data
    })),
    assignProblem,
    clearProblems,
    assignEventProps: assign((context, event) => ({
      action: event.action
    })),
  }
});

export const useEventDelegate = ({
    application,
    selectedPage,
    scripts,
    setState
  }) => {
  const navigate = useNavigate();
  const [state, send] = useMachine(eventDelegateMachine, {
    services: { 
      loadApplicationProps: async () => application,
      openLink: async(context, event) => {
        const { application, action } = context; 
        navigate (`/apps/page/${application.ID}/${action.target}`);
        return true
      },
      runScript: async(context, event) => {
        const { action } = context;  
        return executeScript(action.target, { scripts, selectedPage, api: {
          openPath: path => {
            const page = application.pages.find(f => f.PagePath === path);
            navigate (`/apps/page/${application.ID}/${page.ID}`)
          }
        } }); 
      },
      setState: async(context, event) => { 
        const { action } = context;
        alert (action.target);
      },
      dataExec: async(context, event) => { 
      },
      modalOpen: async(context, event) => { 
      },
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
