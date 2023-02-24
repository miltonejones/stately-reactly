import moment from 'moment';
import { drillPath } from './drillPath';
import { executeScript } from './executeScript';
import { getApplicationScripts } from './getApplicationScripts';
import { map } from './map';
// import { report } from './report';
import { shuffle } from './shuffle';

export const createScriptOptions = (machine, send, refresh) => {

  const { selectedPage, stateProps, appProps } = machine.context;


  const setState = (updated, scope) => {


    // const existingProps = scope === 'application' ? machine.context.appProps : machine.context.stateProps;
    // const newstate = typeof updated === 'function' 
    //   ? updated(existingProps)
    //   : {
    //     ...existingProps,
    //     ...updated
    //   }

    console.log ("Executing %csetState", "color:cyan", { setState: {
      updated, 
      scope,
      state: refresh()
    }});

    // report(existingProps)
    // report(newstate)

    send({
      type: 'JSSTATE',
      scope,
      updated,
    })
  }

  const execResourceByName = async (resourceName, params) => {
    const { connections, resources } = machine.context.application;
    const resource = resources.find(res => res.name === resourceName);
    if (resource) {
      const { node, columns } = resource;
      const connection = connections.find(con => con.ID === resource.connectionID);
      if (connection) {
        const root = new URL(resource.path, connection.root); 
        const endpoint = `${root}/${params}`;
        const response = await fetch(endpoint);
        const json = await response.json();  
        const rows = !(!!node && !!columns?.length) ? json : drillPath(json, node);

        return rows; 
      }
    } 
    return false; 
  }

  const executeScriptByName = (scriptName, data) => {
    const scriptList = getApplicationScripts(machine.context);
    const script = scriptList.find(f => f.name === scriptName);
    if (script) {
      console.log ("Executing %c%s", "color:orange", scriptName, { ...script, data, state: refresh() })
      return executeScript(script.ID, {
        scripts: scriptList, 
        selectedPage, 
        data,
        application,
        options,
        api
      }) 
    }
    console.log ("Could not find script '%s'", scriptName);
  }

  const execRefByName = (name, fn) => {
    const { references } = machine.context;
    const referenceID = Object.keys(references).find(d => references[d].ComponentName === name);
    if (referenceID) {
      !!fn && fn(references[referenceID].controller);
      return;
    } 
    alert ("Could not find reference '" + name + "'")
  }

  const getResourceByName = (resourceName) => {

    console.log ({ resourceName })

  }

  const options = {
    state: stateProps ,
    setState: async (st) => setState(st),
    getState: async () => stateProps,
 
    pagename: selectedPage?.PagePath,
  };

  const application = {
    pages:  machine.context.application?.pages,
    setState: async (st) => setState(st, 'application'),
    getState: async () => appProps,
    state: appProps
  };

  const api = {  
    // pageResourceState,
    Confirm: window.confirm,

    Alert: (message, title, pre) => alert(message),
    JSON: (json, title) => alert(JSON.stringify(json, 0, 2)),

    executeScriptByName, 

    // openLink, 
    // openPath,

    // getRef, 
    // getRefByName, 
    execRefByName,
    shout: console.log,
    map,
    shuffle,
    getResourceByName ,
    // setResourceByName,
    execResourceByName,
    // copy,
    moment,
  };



  const scriptOptions = { 
    ...options, 
    application, 
    api  
  }

  return scriptOptions;
}