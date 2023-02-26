import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { useClientState } from ".";
// import { report } from '../util/report';
import { assignProblem } from "../util/assignProblem";
import { getApplicationNames, getPageByPath, setApplication,  getApplicationByID } from '../connector';

import useDynamoStorage from "../storage";

import { 
  useParams, 
} from "react-router-dom";
import { useClientscript } from './clientscriptMachine';
import { useConnection } from './connectionMachine';
import { useEventDelegate } from './eventDelegateMachine';
import { createScriptOptions } from '../util/createScriptOptions';
import { useRegistrar } from './registrarMachine'; 
import { getRouteParams } from '../util/getRouteParams';
// import { useEventHandler } from './eventHandlerMachine'; 

const reactlyMachine = createMachine(
  {
    id: 'reactly_machine',
    initial: 'start',
    states: {
      start: {
        initial: 'loading',
        states: {
          error: {},
          loading: {
            invoke: {
              src: 'getApplicationList',
              onDone: [
                {
                  target: 'loaded',
                  actions: 'assignApplications',
                },
              ],
              onError: [
                {
                  target: 'error',
                  actions: 'assignProblem',
                },
              ],
            },
          },
          loaded: {
            on: {
              DETAIL: {
                target: '#reactly_machine.configure',
                actions: 'assignApplicationID',
              },
              EDIT: {
                target: '#reactly_machine.edit',
                actions: 'assignApplicationID',
              },
              LOOKUP: [
                {
                  target: '#reactly_machine.edit',
                  actions: 'assignApplicationIDByName', 
                  cond: (_, event) => !event.pagename,
                }
              ],
              RESTATE: {
                actions: "assignContextProp"
              },
            },
          },
        },
      },
      configure: {
        initial: 'loading',
        states: {
          loading: {
            invoke: {
              src: 'loadApplication',
              onDone: [
                {
                  target: 'loaded',
                  actions: 'assignApplication',
                },
              ],
              onError: [
                {
                  target: 'config_error',
                  actions: 'assignProblem',
                },
              ],
            },
          },
          loaded: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  EDIT: {
                    target: "#reactly_machine.edit",
                    actions: "assignApplicationID"
                  },
                  RESTATE: {
                    actions: "assignContextProp"
                  },
                  APPCHANGE: {
                    actions: 'assignProp',
                  },
                  SAVE: {
                    target: 'save',
                  },
                },
              },
              save: {
                initial: 'saving',
                states: {
                  saving: {
                    invoke: {
                      src: 'commitApplicationProps',
                      onDone: [
                        {
                          target: '#reactly_machine.configure.loaded.idle',
                          actions: assign({
                            application: context => ({
                              ...context.application,
                              dirty: false
                            })
                          })
                        },
                      ],
                      onError: [
                        {
                          target: 'save_error',
                          actions: 'assignProblem',
                        },
                      ],
                    },
                  },
                  save_error: {
                    on: {
                      RETRY: {
                        target: 'saving',
                      },
                      CANCEL: {
                        target: '#reactly_machine.configure.loaded.idle',
                      },
                    },
                  },
                },
              },
            },
            on: {
              CLOSE: {
                target: '#reactly_machine.start',
                actions: assign({
                  application: null
                })
              },
            },
          },
          config_error: {
            on: {
              RETRY: {
                target: 'loading',
              },
              CANCEL: {
                target: '#reactly_machine.start.loaded',
              },
            },
          },
        },
      },
      
      edit: {
        initial: "routing",
        on: {
          APPCHANGE: {
            actions: 'assignProp',
          },
          RESOURCE: {  
            actions: "resetResourceState",
          },
        },
        states: {
          routing: {
            after: {
              "500": [
                {
                  target: "#reactly_machine.edit.library",
                  cond: "appLoaded",
                  actions: [],
                  internal: false,
                },
                {
                  target: "#reactly_machine.edit.loading",
                  actions: [],
                  internal: false,
                },
              ],
            },
          },
          loading: {
            invoke: {
              src: "loadApplication",
              onDone: [
                {
                  target: "loaded",
                  actions: "assignApplication",
                },
              ],
              onError: [
                {
                  target: "edit_error",
                  actions: "assignProblem",
                },
              ],
            },
          },

          onload: {
            invoke: {
              src: 'invokeApplicationLoad',
              onDone: [
                {
                  target: 'loaded'
                }
              ]
            }
          },

          loaded: {
            initial: "idle",
            states: {
              idle: {
                initial: 'static',
                states: {
                  static: { 
                    // entry: () => console.log('Entering state %cstatic', 'color:yellow;font-weight:600'),
                    on: {
                      JSSTATE: {  
                        target: "reset",
                        actions: "resetContextStateJS",
                      },
                      SETSTATE: { 
                        target: "reset",
                        actions: "resetContextState",
                      },
                      REFER: { 
                        target: "reset",
                        actions: "resetReferenceState",
                      },
                      MODAL: { 
                        target: "reset",
                        actions: "resetModalState",
                      },
                      RESOURCE: { 
                        target: "reset",
                        actions: "resetResourceState",
                      },
                      PAGECHANGE: {
                        actions: "assignPageChange",
                      },
                    }
                  },
                  reset: {
                    // entry: () => console.log('Entering state %creset', 'color:yellow;font-weight:600'),
                    on: {
                      JSSTATE: {  
                        target: "static",
                        actions: "resetContextStateJS",
                      },
                      SETSTATE: {  
                        target: "static",
                        actions: "resetContextState",
                      },
                    },
                    after: {
                      5: {
                        target: "static"
                      }
                    }
                  }
                },
                on: {
                  
                  LOOKUP: [
                    {
                      target: "get_page",
                      actions: 'assignPageIDByName', 
                      cond: (_, event) => !!event.pagename,
                    },
                    { 
                      actions: "clearPageID",
                      internal: false,
                    },
                  ],
                  PAGE: [
                    {
                      target: "get_page",
                      cond: "containsPageID",
                      actions: "assignPageID",
                    },
                    { 
                      actions: "clearPageID",
                      internal: false,
                    },
                  ],
                  CHANGE: {
                    actions: "assignChange",
                  },
                  RESTATE: { 
                    actions: "assignContextProp",
                  },
                  // UNDO: '#reactly_machine.edit'
                  // SETSTATE: { 
                  //   target: "idle.reset",
                  //   actions: "resetContextState", 
                  // },
                },
              }, 
              page_load: {
                invoke: {
                  src: "invokePageLoad",
                  onDone: [
                    {
                      target: "idle", 
                    },
                  ],
                  onError: [
                    {
                      target: "load_page_error",
                      actions: "assignProblem",
                    },
                  ],
                },
              },
              get_page: {
                invoke: {
                  src: "loadApplicationPage",
                  onDone: [
                    {
                      target: "page_load",
                      actions: "assignApplicationPage",
                    },
                  ],
                  onError: [
                    {
                      target: "load_page_error",
                      actions: "assignProblem",
                    },
                  ],
                },
              },
              load_page_error: {
                on: {
                  RETRY: {
                    target: "get_page",
                  },
                  CANCEL: {
                    target: "idle",
                  },
                },
              },
            },
            on: {
              CLOSE: {
                target: "#reactly_machine.configure.loaded",
              },
            },
          },
          edit_error: {
            on: {
              RETRY: {
                target: "loading",
              },
              CANCEL: {
                target: "#reactly_machine.configure",
              },
            },
          },
          library: {
            initial: "loading",
            states: {
              loading: {
                invoke: {
                  src: "loadLibrary",
                  onDone: [
                    {
                      target: "#reactly_machine.edit.onload",
                      actions: "assignLibrary",
                    },
                  ],
                  onError: [
                    {
                      target: "library_error",
                      actions: "assignProblem",
                    },
                  ],
                },
              },
              library_error: {
                on: {
                  CANCEL: {
                    target: "#reactly_machine.configure.loaded",
                  },
                  RETRY: {
                    target: "loading",
                  },
                },
              },
            },
          },
        },
      },
    },
    context: {
      openFolders: {},
      applicationList: [],
      workspace_state: 7,
      // active_machine: 'reactly_machine',
      logo: 'data:image/png;base64,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',
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    guards: {
      containsPageID: (context, event) => !!event.subid,
      appLoaded: context => !!context.application && context.application.ID === context.applicationID
    },
    actions: {
      
      resetContextState: assign((context, event) => { 
        const { appProps = {}, stateProps = {} } = context;
        const { scope, props } = event;
   
        if (scope === 'application') {
          const appstate = {
            appProps: {
              ...appProps,
              ...props
            }
          } 
          //  console.log ('%cresetContextState', 'color: lime', appstate, props );
          return appstate;
        }
 

        const newstate = {
          stateProps: {
            ...stateProps,
            ...props
          }
        };
        //  console.log ('%cresetContextState', 'color: cyan', newstate );
        return newstate;
 
      }),


      resetContextStateJS: assign((context, event) => { 
        // console.log('%cresetContextStateJS', 'color:red;font-weight:900', { context,  event });
        const { appProps = {}, stateProps = {} } = context;
        const { updated, scope } = event;
        const existingProps = scope === 'application' ? appProps : stateProps;

        // console.log('%cresetContextStateJS', 'color:pink;font-style:italic', { scope, existingProps });
        
        const newstate = typeof updated === 'function' 
            ? updated(existingProps)
            : updated
  
        // console.log('%cresetContextStateJS', 'color:yellow;font-style:italic', { newstate });
        
        // report(existingProps, 'existing state: ' + scope)
        // report(newstate, 'proposed state: ' + scope)

        if (scope === 'application') {
          const appstate = {
            appProps: {
              ...appProps,
              ...newstate
            }
          } 
          // console.log ('%cresetContextStateJS', 'color: lime', appstate );
          return appstate;
        }
 

        const pagestate = {
          stateProps: {
            ...stateProps,
            ...newstate
          }
        };
        // console.log ('%cresetContextStateJS', 'color: cyan', newstate );
        return pagestate;
 
      }),


      resetResourceState: assign((context, event) => { 
        const { ID, dataset } = event;
        const { datasets = {} } = context;

        return {
          datasets: {
            ...datasets,
            [ID]: dataset
          }
        }
      }),
      resetReferenceState: assign((context, event) => { 
        const { references = {} } = context;
        const { ID, ComponentName, controller } = event;

        return {
          references: {
            ...references,
            [ID]: {
              ComponentName, 
              controller
            }
          }
        }
      }),
      resetModalState: assign((context, event) => { 
        const { references = {} } = context;
        const { ID, open } = event;

        return {
          references: {
            ...references,
            [ID]: open
          }
        }
      }),
      assignApplicationPage: assign((context, event) => { 
        const selectedPage = event.data;

        const { state = []} = selectedPage;
        const stateProps = state.reduce((out, item) => {
          out[item.Key] = item.Value;
          return out;
        }, {});

        // alert (JSON.stringify(stateProps))

        return {
           application: {
            ...context.application,
            pages: context.application.pages.map(p => p.ID === selectedPage.ID ? selectedPage : p)
           }, 
           stateProps,
           selectedPage 
        };
      }),
      clearPageID: assign((context, event) => { 
        return {
          // applicationID: event.value,
          pageID: null,
          selectedPage: null,
          selectedComponent: null, 
          selectedComponentID: null
        };
      }),
      assignPageIDByName: assign((context, event) => { 
        const { applicationList, application } = context;
        console.log ({ applicationList, event });
        if (applicationList) {  
          const app = applicationList.find(f => f.path === event.appname);
          if (app) {
            const page = application.pages.find(f => f.PagePath === event.pagename);
    
            return {
              applicationID: app.ID,
              pageID: page.ID,
              selectedComponent: null,
              openFolders: {
                ...context.openFolders,
                [page.ID]: !context.openFolders[page.ID]
              }
            };
          }
        }
      }),
      assignPageID: assign((context, event) => { 
        return {
          applicationID: event.value,
          pageID: event.subid,
          selectedComponent: null,
          openFolders: {
            ...context.openFolders,
            [event.subid]: !context.openFolders[event.subid]
          }
        };
      }),
      assignLibrary: assign((context, event) => {
        const library = event.data;
        const supportedEvents = getSupportedEventList(library)
        return {
          library,
          supportedEvents
        };
      }),
      assignContextProp: assign((context, event) => {
        return {
          [event.key]: event.value,
        };
      }),
      assignChange: assign((context, event) => {
        const { group, pageID, object } = event;
        const { application } = context;
        const owner = !pageID ? application : application.pages.find(p => p.ID === pageID);
        if (!owner) return;

        const deleted = owner[group].filter(f => f.ID !== object.ID) ;
        const appended = owner[group].find(f => f.ID === object.ID) 
          ? owner[group].map(f => f.ID === object.ID ? object : f)
          : owner[group].concat(object);

        const updated = {
          ...owner,
          dirty: 1,
          [group]: object.unlink ? deleted : appended
        } 

        if (pageID) {
          return {
            application: {
              ...application,
              dirty: 1,
              pages: application.pages.map(p => p.ID === pageID ? updated : p)
            }
          }
        }
        
        return {
          application: updated
        };
      }),
      assignProp: assign((context, event) => {
        return {
          application: {
            ...context.application,
            [event.key]: event.value,
            dirty: 1
          },
        };
      }),
      assignPageChange: assign((context, event) => {
        const { pageID, key, value } = event;
        return {
          application: {
            ...context.application,
            pages: (context.application.pages||[])
              .map(page => page.ID !== pageID ? page : {
                ...page,
                [key]: value
              }) ,
            dirty: 1
          },
        };
      }),
      assignApplications: assign((context, event) => {
        return {
          applicationList: event.data,
          selectedPage: null
        };
      }),
      assignApplication: assign((context, event) => {
        const { state = []} = event.data;
        const appProps = state.reduce((out, item) => {
          out[item.Key] = item.Value;
          return out;
        }, {});

        return {
          application: event.data,
          selectedPage: null,
          appProps
        };
      }),
      assignApplicationIDByName: assign((context, event) => {
        const { applicationList } = context;
        const app = applicationList.find(f => f.path === event.appname);
        return {
          applicationID: app.ID,
        };
      }),
      assignApplicationID: assign((context, event) => {
        return {
          applicationID: event.value,
        };
      }),
      assignProblem,
    },
  }
);

export const useReactly = () => { 
  const { getItems } = useDynamoStorage();
  const { appname, pagename, event, id, subid, ...routes } = useParams();
 
  const [state, send] = useMachine(reactlyMachine, {
    services: {
      getApplicationList: async () => {
          // registrar.register({
          //   instance: uniqueId(),
          //   machine: reactlyMachine.id,
          //   args: {
          //     state, send
          //   }
            
          // })

        return await getApplicationNames();
      },
      commitApplicationProps: async (context) => {
        return await setApplication(context.application)
      },
      invokeApplicationLoad: async (context) => { 
        invokeLoad(context.application.events); 
        return true;
      },
      invokePageLoad: async (context) => { 
        // alert ("stateProps-->" + JSON.stringify(context.stateProps))
        !!context.selectedPage?.events &&
          invokeLoad(context.selectedPage.events, context.stateProps); 
        return true;
      },
      loadApplication: async (context) => {
        return await getApplicationByID(context.applicationID);
      },
      loadLibrary: async () => { 
        const items = await getItems();
        const converted = Object.keys(items).reduce((out, item) => {
          const datum = item.split('-');
          out[datum[1]] = JSON.parse(atob(items[item]))
          return out;
        }, {});
        return converted
      },
      loadApplicationPage: async (context) => { 
        const { application, pageID } = context;
        const { PagePath } = application.pages.find(p => p.ID  === pageID);
        return await getPageByPath(application.path, PagePath);
      },
    },
  });

  const { stateProps, appProps, application, selectedPage, library  } = state.context;
  const componentParent = selectedPage || application;
  const registrar = useRegistrar();
  const routeProps = getRouteParams(routes["*"], selectedPage?.parameters);


  const setState = (scope, fn) => { 
    const props = fn(appProps, stateProps)
    // console.log ('%cSTATE', 'color:cyan', state.value, { props })
    send({
      type: 'SETSTATE',
      props,
      scope
    })
  }

  const modalOpen = (ID, open) => {
    send({
      type: 'MODAL',
      ID,
      open
    })
  }

  const getApplicationScripts = () => {
    const pageCode = application?.pages?.reduce((out, page) => {
      const scripts = page.scripts?.filter(f => !!f.code)
      return !scripts ? out : out.concat(scripts?.map(f => ({...f, PageName: page.PageName})))
    }, []);
    const appCode = application?.scripts?.filter(f => !!f.code);
    if (!pageCode) return []
    return  [...pageCode, ...appCode]
  }


  const handleResponse = (ID, dataset) => { 
    // alert (JSON.stringify(state.value))
    send({
      type: 'RESOURCE',
      ID,
      dataset 
    })
  }

  const scriptOptions = createScriptOptions(state, send, () => state.value);

  const delegateProps =  {
    application,
    routeProps,
    scripts: getApplicationScripts(),
    selectedPage,
    setState,
    modalOpen,
    scriptOptions,
    registrar,
    handleResponse
  }


  const delegate = useEventDelegate(delegateProps);

  const invokeLoad = (events, props) => { 
    console.clear();
    console.log ('invokeLoad', { stateProps, appProps, state: delegate.state.value })

    delegate.send({
      type: 'EXEC',
      events, 
      appProps,
      pageProps: props || stateProps
    });

  }

  const getApplicationModals = () => {
    return Object.keys(library)
      .filter(f => !!library[f].modal)
      .reduce((items, key) => {
          let pageModals = [];
          const appModals = application.components?.filter(f => f.ComponentType === key);
          if (selectedPage) {
            pageModals = selectedPage.components?.filter(f => f.ComponentType === key);
            pageModals = pageModals?.map(p => ({...p, PageName: selectedPage.PageName}));
          }
          return [...items, ...appModals, ...pageModals];
        }, []);   
  }


 
  
  const createChangeMethod = (group) => (object) => { 
    send({
      type: 'CHANGE',
      group,
      object,
      pageID: selectedPage?.ID
    }) 
  }

  const connectionPane = useConnection({
    refreshConnections: () => ({
      connections: application.connections,
      resources: application.resources,
    }),
    connectionsChanged: createChangeMethod("connections"),
    resourcesChanged: createChangeMethod("resources"), 
  })

  // const eventHandlerPane = useEventHandler({
  //   refreshEvents: () => componentParent?.events, 
  //   eventsChanged: createChangeMethod("events"),
  //   supportedEvents: () => getSupportedEventList(library)
  // })

  const clientScriptPane = useClientscript({
    refreshScripts: () => componentParent.scripts, 
    scriptsChanged: createChangeMethod("scripts")
  })


  const clientStatePane = useClientState({
    refreshProps: () => componentParent?.state,
    propsChanged: createChangeMethod("state") 
  });


  const openStatePane = () => {
    clientStatePane.send({
      type: 'OPEN',
      props: componentParent.state
    })
  }

  React.useEffect(() => {
    if (appname) {
      // console.log ('LOOKUP', { appname, pagename })
       send({
        type: 'LOOKUP',
        appname, pagename
      });
      return
    }
    if (event) {
       send({
        type: event.toUpperCase(),
        subid,
        value: id
      });
      return
    }
    send('CLOSE'); 
  }, [event, id, appname, pagename, subid, send])

  const getAppState = async () => {
    return state.context.appProps;
  }


  const diagnosticProps = {
    ...reactlyMachine,
    state, 
    send, 
  };

  return {
    send,
    state,
    getApplicationScripts,
    getApplicationModals,
    diagnosticProps,
    openStatePane,
    clientStatePane,
    clientScriptPane,
    getAppState,
    handleResponse,
    delegateProps,
    // eventHandlerPane,
    routeProps,
    delegate,
    registrar,
    connectionPane,
    ...state.context,
  };
};


const getSupportedEventList = library => {

  const eventNames = Object.keys(library).reduce ((out, key) => {
    const events = library[key].Events;
    if (!events) return out;
    out = out.concat(events.filter(e => !out.find(f => f.name === e.name) ));
    return out;
  }, []);

  return eventNames.concat(eventTypes);
}

const eventTypes = [
  {
    name: "onPageLoad",
    description: "Page  finishes loading.",
  },
  {
    name: "dataLoaded",
    description: "Data finishes loading.",
  },
  {
    name: "loadStarted",
    description: "Data starts loading.",
  }, 
  {
    name: 'onApplicationLoad', 
    description: 'Application finishes loading.'
  },  
];
