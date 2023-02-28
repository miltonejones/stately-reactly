import moment from 'moment';
import { drillPath } from './drillPath';
import { executeScript } from './executeScript';
import { getApplicationScripts } from './getApplicationScripts';
import { map } from './map';
// import { report } from './report';
import { shuffle } from './shuffle';

export const createScriptOptions = (machine, send, refresh, registrar) => {

  const { selectedPage, stateProps, appProps } = machine.context;


  const setState = (updated, scope) => {

    registrar.log ("Executing %c%s", "color:cyan", "setState", { setState: {
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
    });


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
      const args = {
        scripts: scriptList, 
        selectedPage, 
        data,
        application,
        options,
        api
      };
      registrar.log ("Executing %c%s", "color:orange", scriptName, { args })
      return executeScript(script.ID, args) 
    }
    registrar.log ("Could not find script '%s'", scriptName);
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

    registrar.log ('getResourceByName %c"%s"', 'color:lime;font-weight:600',  resourceName )

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

    Alert: (message, title, pre) => console.log({message,title,pre}),
    JSON: (json, title) => console.log(JSON.stringify(json, 0, 2)),

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
    registrar,
    api  
  }

  return scriptOptions;
}