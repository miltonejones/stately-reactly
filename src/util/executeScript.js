export const executeScript = (scriptID, { scripts, selectedPage }) => {
  const script = scripts.find(e => e.ID === scriptID);
  if (script) {
    console.log ("Executing %s", script.code);
    const codeBlock = `function runscript() { return ${script.code} }`;

    // eslint-disable-next-line
    const action = eval(`(${codeBlock})()`);  
    const result = action(selectedPage, {
      pagename: selectedPage?.PagePath
    });
    console.log ({ result })
    return result;
  }

  console.log ("Could not find script %s", scriptID);
  return ""
}