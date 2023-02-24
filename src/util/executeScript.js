export const executeScript = (scriptID, { scripts, application, selectedPage, data, api = {}, options = {} }) => {
  const script = scripts.find(e => e.ID === scriptID);
  if (script) {
    //  console.log ("Executing %c%s", 'color: yellow', script.name, { api });
    const codeBlock = `function runscript() { return ${script.code} }`;
    const { data: optionData, ...rest } = options;

    // eslint-disable-next-line
    const action = eval(`(${codeBlock})()`);  
    const result = action(selectedPage, {
      pagename: selectedPage?.PagePath,
      application,
      data: data || optionData,
      ...rest,
      api: {
        Alert: msg => alert (msg),
        shout: console.log,
        ...api
      }
    });
    // console.log (script.name, { result })
    return result;
  }

  console.log ("Could not find script %s", scriptID);
  return ""
} 