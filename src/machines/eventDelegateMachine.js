
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react"; 
import { useParams } from "react-router-dom";

// import { executeScript } from '../util/executeScript';
import { assignProblem } from "../util/assignProblem";
import { clearProblems } from "../util/clearProblems";
import { getBindings } from '../util/getBindings';
import { useDataExecute } from './dataExecuteMachine';
import { useOpenLink } from './handlers/openLink';
import { useRunScript } from './handlers/runScript';
import { useSetState } from './handlers/setState';
import { useModalOpen } from './handlers/modalOpen';
// import { uniqueId } from '../util/uniqueId';
import { getRouteParams } from '../util/getRouteParams';

// add machine code
const eventDelegateMachine = createMachine(
  {
    id: 'event_delegate',
    initial: 'ready',
    states: {
      ready: {
        initial: 'loading',
        states: {
          loading: {
            invoke: {
              src: 'loadApplicationProps',
              onDone: [
                {
                  target: 'waiting',
                  actions: 'assignApplicationProps',
                },
              ],
            },
          },
          waiting: { 
            entry: assign({ events: [] }),
            description: 'Wait for component events',
            on: {
              EXEC: {
                target: 'reload',
                actions: ['assignEventProps', assign({ event_index: 0 })],
              },
            },
          },
          reload: {
            entry: (context) => context.registrar.log ('%creloading props','font-weight:600'),
            invoke: {
              src: 'loadApplicationProps',
              onDone: [
                {
                  target: 'loop',
                  actions: 'assignApplicationProps',
                },
              ],
            },
            on: {
              EXEC: { 
                actions: [(context) => context.registrar.log("%cEXEC called in RELOAD state", 
                  'color:red;font-style:italic', context.events.length), "assignEventProps"]
              },
            },
          },
          loop: {
            initial: 'next',
            states: {
              next: {

                // invoke: {
                //   src: 'setIndex',
                //   onDone: [
                //     {
                //       target: '#event_delegate.ready.loop.exec',
                //       cond: 'moreEvents',
                //       actions: ['assignNextEvent', assign((_, event) => ({
                //         event_index: event.data
                //       }))],
                //     },
                //     {
                //       target: '#event_delegate.ready.waiting',
                //       actions: assign({ events: [] })
                //     },
                //   ]
                // },

                after: {
                  1: [
                    {
                      target: '#event_delegate.ready.loop.exec',
                      cond: 'moreEvents',
                      actions: ['assignNextEvent', 'incrementIndex'],
                    },
                    {
                      target: '#event_delegate.ready.waiting',
                      actions: assign({ events: [] })
                    },
                  ],
                },


                on: {
                  EXEC: { 
                    actions: [(context) => context.registrar.log("%cEXEC called in NEXT state", 
                      'color:red;font-style:italic', context.events.length), "assignEventProps"]
                  },
                },
              },
              exec: {
                entry: (context) => context.registrar.log (
                  'exec %c%s', 
                  'color:yellow;text-transform: uppercase', 
                  context.action?.type, 
                  { action: context.action }, 
                  context.event_index,
                  context.events?.length
                  ),
                after: {
                  1: [
                    {
                      target: '#event_delegate.modal_open',
                      cond: 'isModalOpen',
                    },
                    {
                      target: '#event_delegate.data_exec',
                      cond: 'isDataExec',
                    },
                    {
                      target: '#event_delegate.set_state',
                      cond: 'isSetState',
                    },
                    {
                      target: '#event_delegate.run_script',
                      cond: 'isRunScript',
                    },
                    {
                      target: '#event_delegate.open_link',
                      cond: 'isOpenLink',
                    },
                    {
                      target: 'next', 
                    }
                  ],
                },

                on: {
                  EXEC: { 
                    actions: [(context) => context.registrar.log("%cEXEC called in LOOP state", 
                      'color:red;font-style:italic', context.events.length), "assignEventProps"]
                  },
                },

              },
            },
          },
        },
      },
      open_link: {
        invoke: {
          src: 'openLink',
          onDone: [
            {
              target: '#event_delegate.ready.loop', 
            },
          ],
        },
      },
      run_script: {
        entry: (context) => context.registrar.log ('%cScript event', 'color: #ebebeb', context.action),
        on: {
          EXEC: { 
            actions:  (context) => context.registrar.log("%cEXEC called in RUN_SCRIPT state", 'color:red;font-style:italic')
          },
        },
        invoke: {
          src: 'runScript',
          onDone: [
            {
              target: '#event_delegate.ready.loop', 
            },
          ],
          onError: [
            {
              target: 'exec_error',
              actions: 'assignProblem',
            },
          ],
        },
      },
      exec_error: {
        description: 'Display any errors returned by the event',
        on: {
          RECOVER: {
            target: '#event_delegate.ready.loop',
            actions: ['clearProblems'],
          },
        },
      },
      set_state: {
        on: {
          EXEC: { 
            actions:  (context) => context.registrar.log("%cEXEC called in SET_STATE state", 'color:red;font-style:italic')
          },
        },
        invoke: {
          src: 'setState',
          onDone: [
            {
              target: '#event_delegate.ready.loop', 
            },
          ],
          onError: [
            {
              target: 'exec_error',
              actions: 'assignProblem',
            },
          ],
        },
      },
      data_exec: {
        initial: 'run_query',
        states: {
          await_response: {        
            on: {
              COMPLETE: '#event_delegate.ready.loop', 
            }
          },
          run_query: { 
            invoke: {
              src: 'dataExec',
              onDone: [
                {
                  target: '#event_delegate.ready.loop', 
                },
              ],
            },
          }
        }
      },
      modal_open: {
        entry: (context) => context.registrar.log ('%cModal event', 'color: #bebebe', context.action),
        on: {
          EXEC: { 
            actions:  (context) => context.registrar.log("%cEXEC called in MODAL_OPEN state", 'color:red;font-style:italic')
          },
        },
        invoke: {
          src: 'modalOpen',
          onDone: [
            {
              target: '#event_delegate.ready.loop', 
            },
          ],
          onError: [
            {
              target: 'exec_error',
              actions: 'assignProblem',
            },
          ],
        },
      },
    },
    context: {},
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    guards: {
      isModalOpen: (context) => context.action.type === 'modalOpen',
      isDataExec: (context) => context.action.type === 'dataExec',
      isSetState: (context) => context.action.type === 'setState',
      isRunScript: (context) => context.action.type === 'scriptRun',
      isOpenLink: (context) => context.action.type === 'openLink',
      moreEvents: (context) => context.event_index < context.events.length,
    },
    actions: {
      assignApplicationProps: assign((_, event) => ({
        ...event.data,
      })),
      assignNextEvent: assign((context) => {
        const { action } = context.events[context.event_index]; 
        return { action };
      }),
      assignEventProps: assign((context, event) => {

        context.registrar.log (`Assigning %c%d events`, 'color:lime;font-style: italic', event.events.length); 
        return { 
          ...event,
          // eventProps: event.event 247
        }
      }),

      appendEventProps: assign((context, event) => {
        const { events, eventProps } = event;

        const freshEvents = events.filter(e => !context.events.find(f => f.ID === e.ID));


        const acts = context.events.reduce((out, ev) => {
          const existingEvent = events.find(e => e.ID === ev.ID);
          return out.concat(existingEvent || ev); 
        }, freshEvents);


        context.registrar.log (`Appending %c%d events`, 'color:lime', events.length, acts?.length);

        return { 
          ...context,
          eventProps: {
            ...context.eventProps,
            ...eventProps
          },
          events: acts
        }
      }),


      incrementIndex: assign((context) => ({
        event_index: context.event_index + 1,
      })),
      assignProblem,
      clearProblems,
    },
  }
);

export const useEventDelegate = (props) => {
  const { 
    application,
    selectedPage,
    scripts,
  
    setState: setter,
    modalOpen: opener,
      
    handleResponse,
    scriptOptions,
    registrar
  } = props;
  
  const routeParams = useParams();
  const { openLink } = useOpenLink()
  const { runScript } = useRunScript(scriptOptions);
  const { setState } = useSetState(setter, registrar);
  const { modalOpen } = useModalOpen(opener);
 
  const [state, send] = useMachine(eventDelegateMachine, {
    services: { 
      loadApplicationProps: async () => { 
        return {
          application,
          selectedPage,
          scripts,
          registrar
        }
      },

      openLink,
      runScript,
      setState,
      modalOpen, 

      setIndex: async (context) => context.event_index + 1,

      dataExec: async(context) => { 
        const { action, appProps, pageProps, eventProps } = context;
        const resource = application.resources.find(f => f.ID === action.target);
        const connection = application.connections.find(f => f.ID === resource.connectionID); 

        const terms = !action.terms ? [] : Object.keys(action.terms).reduce((out, term) => {
          const key = action.terms[term]; 

          const routeProps = getRouteParams(routeParams["*"], selectedPage?.parameters); 
          const value = getBindings(key, {
            appProps,
            pageProps,
            eventProps,
            routeProps,
            scripts 
          });   

          out[term] = value;
          return out.concat({
            key: term,
            value
          });

        }, []);

        // console.log ({
        //   appProps,
        //   pageProps,
        //   eventProps,
        //   resource,
        //   connection,
        //   terms,
        //   state: exec.state.value
        // });
     
        exec.send({
          type: 'TEST',
          resource,
          connection,
          scripts,
          terms,
          appProps, 
          pageProps
        });

      },
    },
  }); 

  const { appProps, pageProps, eventProps } = state.context;

  const onResponseHandled = (ID, data) =>{
    send('COMPLETE');
    handleResponse(ID, data);
  }
 

  const exec = useDataExecute({
    appProps,
    pageProps, 
    eventProps,
    messageParent: send,
    handleResponse: onResponseHandled,
    ...props
  })

  const diagnosticProps = {
    ...eventDelegateMachine,
    state, 
    send, 
  };

  return {
    state,
    send, 
    diagnosticProps,
    exec,
    ...state.context
  };
}
