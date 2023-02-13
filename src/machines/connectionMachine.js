
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react"; 
import { assignProps } from '../util/assignProps';
// import { useEventHandler } from './eventHandlerMachine';

// add machine code
const connectionMachine = createMachine({
  id: "connection_machine",
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
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadConnections",
            onDone: [
              {
                target: "ready",
                actions: ["assignConnections", assign({ open: true })],
              },
            ],
          },
        },
        ready: {},
        connection_edit: {
          initial: "idle",
          states: {
            idle: {
              on: {
                CHANGE: { 
                  actions: ["assignConnectionProps", assign({ dirty: true })],
                },
                SAVE: {
                  target: "changing_connection", 
                },
              },
            },
            changing_connection: {
              initial: "changing",
              states: {
                changing: {
                  description: "Fire change event",
                  invoke: {
                    src: "connectionChanged",
                    onDone: [
                      {
                        target: "refresh",
                        description: "Change event response",
                      },
                    ],
                  },
                },
                refresh: {
                  description: "Refresh resources list",
                  invoke: {
                    src: "loadConnections",
                    onDone: [
                      {
                        target:
                          "#connection_machine.opened.connection_edit.idle",
                        actions: [
                          "assignConnections",
                          assign({ dirty: false }),
                        ],
                      },
                    ],
                  },
                },
              },
            }, 
            resource_edit: {
              on: {
                CLOSE: [
                  {
                    target: "idle",
                    cond: "changesCommitted",
                    actions: "clearResource",
                  },
                  {
                    target: "confirm",
                  },
                ],
                TEST: {
                  target: "testing",
                },
                CHANGE: { 
                  actions: ["assignResourceProps", assign({ dirty: true })], 
                },
                SAVE: {
                  target: "changing_resource", 
                },
              },
            },
            testing: {
              invoke: {
                src: "testResource",
                onDone: [
                  {
                    target: "resource_edit",
                    actions: "assignAvailableFields",
                  },
                ],
                onError: [
                  {
                    target: "resource_edit",
                    actions: "assignProblem",
                  },
                ],
              },
            },
            changing_resource: {
              initial: "changing",
              states: {
                changing: {
                  description: "Fire change event",
                  invoke: {
                    src: "resourceChanged",
                    onDone: [
                      {
                        target: "refresh",
                        description: "Change event response",
                      },
                    ],
                  },
                },
                refresh: {
                  description: "Refresh resources list",
                  invoke: {
                    src: "loadConnections",
                    onDone: [
                      {
                        target:
                          "#connection_machine.opened.connection_edit.resource_edit",
                        actions: ["assignConnections", assign({ dirty: false })],
                      },
                    ],
                  },
                },
              },
            }, 
            confirm: {
              on: {
                CONFIRM: {
                  target: "idle",
                  actions: "clearResource",
                }, 
                CANCEL: {
                  target: "resource_edit",
                },
              },
            },
          },
          on: {
            EDITRESOURCE: {
              target: ".resource_edit",
              actions: [assign({ dirty: false }), "assignResource"],
            },
            CLOSE: [
              {
                target: "ready",
                cond: "changesCommitted",
                actions: [assign({ dirty: false }), "clearConnection"],
              },
              {
                target: "confirm",
              },
            ],
          },
        },
        confirm: {
          description: "Confirm closing with pending changes",
          on: {
            CONFIRM: {
              target: "ready",
              actions: ["clearConnection", assign({ dirty: false })],
            },
            CANCEL: {
              target: "#connection_machine.opened.connection_edit.idle",
            },
          },
        },
      },
      on: {
        EDITCONNECTION: {
          target: ".connection_edit",
          actions: ["assignConnection", "clearResource"],
        },
        EXIT: {
          target: "idle",
          actions: ["clearResource", "clearConnection", assign({ open: false })],
        },
      },
    },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    changesCommitted: context => !context.dirty
  },
  actions:  {
    
    clearConnection:  assign((context, event) => { 
      return {
        connection: null
      }
    }),
    assignResource:  assign((context, event) => { 
      return {
        source: event.source,
        resource: context.resourceProps
          .find(f => f.ID === event.ID)
      }
    }),
    assignConnection:  assign((context, event) => { 
      return {
        connection: context.connectionProps
          .find(f => f.ID === event.ID)
      }
    }),
    assignProblem: assign((context, event) => {
      return {
        error: event.data.message,
        stack: event.data.stack,
      };
    }),
    clearResource:  assign((context, event) => { 
      return {
        resource: null,
        dirty: false
      }
    }),
    assignConnections:  assign((context, event) => { 
      return {
        connectionProps: event.data.connections,
        resourceProps: event.data.resources
      }
    }),

    assignAvailableFields:  assign((context, event) => { 
      return event
    }),

    assignResourceProps:  assignProps('resourceProps', 'resource'),
    assignConnectionProps:  assignProps('connectionProps', 'connection'), 
  }
}); 

export const useConnection = (
  {
    refreshConnections,
    connectionsChanged,
    resourcesChanged
  }
) => {
  const [state, send] = useMachine(connectionMachine, {
    services: { 
      loadConnections: async() => refreshConnections(),
      testResource: async(context, event) => {},
      resourceChanged: async(context, event) => { 
        resourcesChanged && resourcesChanged(context.resource)
      },
      connectionChanged: async(context, event) => {
        connectionsChanged && connectionsChanged(context.connection)
      },
    },
  }); 

  
  // const eventHandlerPane = useEventHandler({
  //   refreshEvents: () => state.context.resource?.events, 
  //   eventsChanged: () => true,
  //   supportedEvents: []
  // })
 
  return {
    state,
    send, 
    // eventHandlerPane,
    ...state.context
  };
}
