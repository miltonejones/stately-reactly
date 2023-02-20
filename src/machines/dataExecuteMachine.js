import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { AppStateContext } from '../context';
import { executeScript } from '../util/executeScript';
import { assignProblem } from "../util/assignProblem";
import { clearProblems } from "../util/clearProblems";
import { useDataEvent } from './dataEventMachine';
import { uniqueId } from '../util/uniqueId';

// add machine code
const dataExecuteMachine = createMachine({
  id: "data_exec",
  initial: "reg",
  states: {
    reg: {
      invoke: {
        src: "registerMe",
        onDone: [
          {
            target: "start"
          }
        ],
        onError: [
          {
            target: "start",
            actions: assign((_, event) => console.log (event.message))
          }
        ]
      }
    },
    start: {
      description: "Initial state waits for requests",
      entry: "assignEntryMessage",
      on: {
        EXEC: {
          target: "execute",
          actions: ["assignResource", "assignEventParams"],
        },
        CLEAR: { 
          actions: assign({
            response: null
          })
        },
        TEST: {
          target: "#data_exec.execute.send_request",
          actions: ["assignResource", "assignTestTerms"],
          description: "Preset params passed in with request",
        },
      },
    },
    execute: {
      initial: "parse_params",
      states: {
        parse_params: {
          description: "Start by loading the current app params",
          invoke: {
            src: "loadPageParams",
            onDone: [
              {
                target: "send_request",
                actions: "assignTerms",
                description:
                  "Parsing the request terms using current app params",
              },
            ],
          },
        },
 
        send_request: {
          description: "Execute event request",
          entry: "configureRequestParams",
          initial: "before_send",
          states: {
            before_send: {
              description: "Check for and apply any transforms before sending",
              after: {
                "5": [
                  {
                    target: "#data_exec.execute.send_request.parse_request",
                    cond: "outboundTransformRequired",
                    actions: [],
                    internal: false,
                  },
                  {
                    target: "#data_exec.execute.send_request.send",
                    actions: [],
                    internal: false,
                  },
                ],
              },
            },
            parse_request: {
              description: "Resolve request using script before sending",
              invoke: {
                src: "transformRequest",
                onDone: [
                  {
                    target: "send",
                    actions: "assignRequest",
                  },
                ],
                onError: [
                  {
                    target: "#data_exec.execute.exec_error",
                    actions: ["assignProblem", assign({
                      source: "parse_request"
                    })],
                  },
                ],
              },
            },
            send: {
              initial: 'pre',
              states: {

                pre: {
                  entry: assign({
                    eventType: 'loadStarted'
                  }),
                  invoke: {
                    src: 'execRequestEvents',
                    onDone: [
                      {
                        target: 'go'
                      }
                    ]
                  }
                },
                
                go: {
                  description: "Perform request using configured parameters",
                  invoke: {
                    src: "executeRequest",
                    onDone: [
                      {
                        target: "#data_exec.execute.parse_response",
                        cond: "inboundTransformRequired",
                        actions: "assignResponse",
                      },
                      {
                        target: "#data_exec.respond",
                        actions: "assignResponse",
                      },
                    ],
                    onError: [
                      {
                        target: "#data_exec.execute.exec_error",
                        actions: ["assignProblem", assign({
                          source: "send"
                        })],
                      },
                    ],
                  },
                }, 
              },

  
            },
          },
        },
        exec_error: {
          description:
            "When  an error occurs, display a screen to allow request retries.",
          entry: "assignErrorMessage",
          on: {
            RETRY: {
              target: "send_request",
              actions: "assignTestTerms",
            },
            CANCEL: {
              target: "#data_exec.start",
              actions: "clearProblems",
            },
          },
        },
        parse_response: {
          description: "Resolve response into configured columns",
          invoke: {
            src: "transformResponse",
            onDone: [
              {

                target: "#data_exec.respond",
                actions: ["assignResponse"],
                description: "send parsed JSON response",
                internal: false,
              }
            ],
            onError: [
              {
                target: "parse_error",
                actions: "assignProblem",
              },
            ],
          }, 
        },
        parse_error: {
          description: "Show a message when a parsing error occurs",
          entry: "assignErrorMessage",
          on: {
            RECOVER: {
              target: "#data_exec.start",
              actions: "clearProblems",
            },
          },
        },
      },
    },
    respond: {
      initial: 'post',
      states: {

        post: {
          entry: assign({
            eventType: 'dataLoaded'
          }),
          invoke: {
            src: 'execRequestEvents',
            onDone: [
              {
                target: 'answer'
              }
            ]
          }
        },

        answer: {
          description: "Send response to caller",
          invoke: {
            src: "responseReceived",
            onDone: [
              {
                target: "#data_exec.start",
              },
            ],
          },
        }
        
      }


    },
  },
  context: { message: "" },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    // transform response
    inboundTransformRequired: context => context.resource.method === 'GET' && !!context.resource.transform,

    // transform request
    outboundTransformRequired: context => context.resource.method !== 'GET' && !!context.resource.transform, 
  },
  actions: {
    clearProblems,
    assignProblem,
    assignEntryMessage: assign(() => ({
      message: "Ready for requests"
    })),
    assignErrorMessage: assign(() => ({
      message: "There was a problem with the request"
    })),
    assignSuccessMessage: assign(() => ({
      message: "The request was successful"
    })), 
    assignResource: assign((_, event) => { 
      return event
    }),
    assignEventParams:  assign((_, event) => ({
      eventProps: event.eventProps
    })),
    assignTestTerms:  assign((_, event) => ({
      terms: event.terms
    })),
    assignResponse:  assign((_, event) => ({
      ...event,
      response: event.data
    })),
    assignRequest:  assign((context, event) => ({ 
      requestOptions: {
        method: context.resource.method,
        body: JSON.stringify(event.data),
        headers: { "Content-Type": "application/json" },
      }
    })),
    configureRequestParams: assign((context) => {
      const { connection, resource, terms } = context;

      // URL param delimiter
      const delimiter = resource.format === "rest" ? "/" : "&";

      // character demarking URL from params
      const demarker = resource.format === "rest" ? "/" : "?";
      const isGetRequest = resource.method === "GET";
      
      // build root URL
      const root = new URL(resource.path, connection.root);

      // create query string from request terms
      const querystring = terms.reduce((out, term) => {
        out.push(resource.format === "rest" ? term.value : `${term.key}=${term.value}`);
        return out;
      }, []).join(delimiter);


      const suffix = typeof querystring === 'string' && !!querystring?.length
        ? `${demarker}${querystring}`
        : '';
        
      const endpoint = isGetRequest ? `${root}${suffix}` : root;

      return {
        endpoint,
        requestOptions: null
      }



    }),
    assignTerms: () => {

    }
  }
});

export const useDataExecute = ({
  appProps,
  pageProps, 
  handleResponse,
  messageParent,
  ...props
}) => {
  const reactly = React.useContext(AppStateContext);

  const [state, send] = useMachine(dataExecuteMachine, {
    services: { 
      registerMe: async () => {
        const instance = uniqueId();
        // console.log ({ registering: dataExecuteMachine.id, instance })
        props.registrar && props.registrar.register({
          instance,
          machine: dataExecuteMachine.id,
          args: {state, send}
        });
        return true;
      },
      loadPageParams: async () => ({
        appProps,
        pageProps,
      }),
      responseReceived: async (context) => { 
        handleResponse && handleResponse(context.resource.ID, context.response); 
      },
      transformRequest: async (context) => {
        return executeScript(context.resource.transform, {
          scripts: context.scripts || reactly.getApplicationScripts(), 
          application: {
            getState: async () => reactly.appProps
          }, 
          selectedPage: reactly.selectedPage,  
        });  
      },
      transformResponse: async (context) => {
        const { api, application, ...options } = props.scriptOptions;
        const { resource, response, scripts/**,, appProps  pageProps  */} = context;
        const { transform } = resource;
        const transformed = executeScript(transform, {
          scripts: scripts || reactly.getApplicationScripts(), 
          application ,
          selectedPage: reactly.selectedPage, 
          data: response,
          options,
          api
        }); 
        return transformed; 
      },

      execRequestEvents: async (context) => { 
        const { resource, eventType } = context;  
        const { events = [] } = resource;
        const requestEvents = events.filter(f => f.event === eventType);
        if (requestEvents?.length) {
          console.log ({ 
            [resource.name]: requestEvents, 
            context, 
            state: dataHandler.state.value, 
            index: dataHandler.event_index 
          });
  
          dataHandler.send({
            type: 'EXEC',
            ...props,
            data: context.response,
            events: requestEvents,
          });
        }

        return true;
      },

      executeRequest: async (context) => {
        const { endpoint, requestOptions } = context;  
        const response = await fetch(endpoint, requestOptions);
        return await response.json(); 
      }
    },
  }); 


  const dataHandler = useDataEvent(props)

  const diagnosticProps = {
    ...dataExecuteMachine,
    state, 
    send, 
  };

  return {
    state,
    send, 
    diagnosticProps,
    ...state.context
  };
}
