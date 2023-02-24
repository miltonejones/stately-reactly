
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
            description: 'Wait for component events',
            on: {
              EXEC: {
                target: 'reload',
                actions: ['assignEventProps', assign({ event_index: 0 })],
              },
            },
          },
          reload: {
            invoke: {
              src: 'loadApplicationProps',
              onDone: [
                {
                  target: 'loop',
                  actions: 'assignApplicationProps',
                },
              ],
            },
          },
          loop: {
            initial: 'next',
            states: {
              next: {
                after: {
                  5: [
                    {
                      target: '#event_delegate.ready.loop.exec',
                      cond: 'moreEvents',
                      actions: ['assignNextEvent', 'incrementIndex'],
                    },
                    {
                      target: '#event_delegate.ready.waiting',
                    },
                  ],
                },
              },
              exec: {
                after: {
                  5: [
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
        invoke: {
          src: 'modalOpen',
          onDone: [
            {
              target: '#event_delegate.ready.loop', 
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
        // console.log(' :: assignNextEvent :: Executing %o', action)
        return { action };
      }),
      assignEventProps: assign((_, event) => {
        // console.log({ event })
        return { 
          ...event,
          // eventProps: event.event
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
    // registrar
  } = props;
  
  const routeParams = useParams();
  const { openLink } = useOpenLink()
  const { runScript } = useRunScript(scriptOptions);
  const { setState } = useSetState(setter);
  const { modalOpen } = useModalOpen(opener);
 
  const [state, send] = useMachine(eventDelegateMachine, {
    services: { 
      loadApplicationProps: async () => {
        // console.log ({
        //   routeParams
        // })
        // registrar && registrar.register({
        //   instance: uniqueId(),
        //   machine: eventDelegateMachine.id,
        //   args: { state, send }
        // })
        return {
          application,
          selectedPage,
          scripts
        }
      },

      openLink,
      runScript,
      setState,
      modalOpen, 

      dataExec: async(context) => { 
        const { action, appProps, pageProps, eventProps } = context;
        const resource = application.resources.find(f => f.ID === action.target);
        const connection = application.connections.find(f => f.ID === resource.connectionID); 

        const terms = !action.terms ? [] : Object.keys(action.terms).reduce((out, term) => {
          const key = action.terms[term]; 

          const routeProps = getRouteParams(routeParams["*"], selectedPage?.parameters);
          !!routeParams["*"] && console.log ({
            routeProps,
            routeParams
          })
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

        console.log ({
          appProps,
          pageProps,
          eventProps,
          resource,
          connection,
          terms,
          state: exec.state.value
        });
     
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


  // console.log ({ routeProps })

  // !!routeParams && Object.keys(routeParams).length && 
  //   console.log ({ routeParams })

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
