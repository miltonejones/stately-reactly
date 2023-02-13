
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { uniqueId } from '../util/uniqueId';

// add machine code
const clientscriptMachine = createMachine( {
  id: "client_script_machine",
  initial: "idle",
  states: {
    idle: {
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
            src: "refreshScriptProps",
            onDone: [
              {
                target: "script_data_loaded",
                actions: [
                  "assignScriptProps",
                  assign({ open: true }),
                  assign({ dirty: false }),
                ],
              },
            ],
          },
        },
        script_data_loaded: {
          on: {
            CHANGE: {
              target: "propchange",
              actions: "assignChanges",
            },
          },
        },
        codechange: {
          initial: "validate",
          states: {
            validate: {
              invoke: {
                src: "evaluateCode",
                onDone: [
                  {
                    target: "success",
                    actions: assign({
                      error: null,
                      stack: null
                    }),
                  },
                ],
                onError: [
                  {
                    target: "#client_script_machine.opened.editcode",
                    actions: assign((context, event) => ({
                      error: event.message,
                      stack: event.stack
                    })),
                  },
                ],
              },
            },
            success: {
              invoke: {
                src: "scriptPropsChanged",
                onDone: [
                  {
                    target: "#client_script_machine.opened.editcode",
                    actions: assign({ dirty: true }),
                  },
                ],
              },
            },
          },
        },
        editcode: {
          on: {
            // COMMIT: { 
            //   target: "codechange",
            // },
            CHANGE: { 
              actions: "applyCodeChange",
              target: "codechange",
            },
            CLOSE: [
              {
                target: "refresh",
                cond: "codeChanged",
              },
              {
                target: "script_data_loaded",
              },
            ],
          },
        },
        propchange: {
          invoke: {
            src: "scriptPropsChanged",
            onDone: [
              {
                target: "refresh",
              },
            ],
          },
        },
      },
      on: {
        EDIT: {
          target: "#client_script_machine.opened.editcode",
          actions: "assignScriptProp",
        },
        EXIT: {
          target: "idle",
          actions: assign({ open: false }),
        },
      },
    },
  },
  context: {
    error: null,
    stack: null,
    scriptProps: [],
    open: false,
    dirty: false,
    scriptProp: null,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  guards: {
    codeChanged: (context) => !!context.dirty
  },
  actions: {
    
    applyCodeChange: assign((context, event) => {
      return {
        scriptProp:  {
          ...context.scriptProp,
          code: event.value
        }
      }
    }),

    assignChanges: assign((context, event) => {
      return {
        scriptProp:  {
          ...context.scriptProp,
          [event.key]: event.value
        }
      }
    }),

    assignScriptProp: assign((context, event) => {
      return {
        scriptProp: context.scriptProps.find(s => s.ID === event.ID), 
      }
    }),

    assignScriptProps: assign((context, event) => {
      return {
        scriptProps: event.data,
        open: true
      }   
    }),

    assignChangeProps: assign((context, event) => {
      const {ID, Key, Value, unlink } = event;
      const prop = context.scriptProps.find(d => d.ID === ID);
      const scriptProp = {
        ...prop,
        ID: ID || uniqueId(),
        [Key]: Value,
        unlink
      } 
      return {
        scriptProp 
      }
    })
  }
});

export const useClientscript = ({ refreshScripts, scriptsChanged }) => {
  const [state, send] = useMachine(clientscriptMachine, {
    services: { 
      evaluateCode: async(context) => {
         // eslint-disable-next-line
        return eval(context.scriptProp.code);
      },
      scriptPropsChanged: async (context) => {
        scriptsChanged && scriptsChanged(context.scriptProp)
      } ,

      refreshScriptProps: async () => {
        return refreshScripts()
      } 
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
