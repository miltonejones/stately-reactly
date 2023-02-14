export const executeScript = (scriptID, { scripts, selectedPage, api = {} }) => {
  const script = scripts.find(e => e.ID === scriptID);
  if (script) {
    console.log ("Executing %s", script.code);
    const codeBlock = `function runscript() { return ${script.code} }`;

    // eslint-disable-next-line
    const action = eval(`(${codeBlock})()`);  
    const result = action(selectedPage, {
      pagename: selectedPage?.PagePath,
      api: {
        Alert: msg => alert (msg),
        ...api
      }
    });
    console.log ({ result })
    return result;
  }

  console.log ("Could not find script %s", scriptID);
  return ""
}