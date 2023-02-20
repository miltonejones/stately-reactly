export const executeScript = (scriptID, { scripts, application, selectedPage, data, api = {}, options = {} }) => {
  const script = scripts.find(e => e.ID === scriptID);
  if (script) {
    // console.log ("Executing %s", script.code);
    const codeBlock = `function runscript() { return ${script.code} }`;

    // eslint-disable-next-line
    const action = eval(`(${codeBlock})()`);  
    const result = action(selectedPage, {
      pagename: selectedPage?.PagePath,
      application,
      data,
      ...options,
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

/**
 * async function transformMusicRows (page, options) {
  const { api, data, application, setState } = options;


  if (!data && (data.records || data.related.records)) return data;


  const { playlist_db } = await application.getState();
  
  const addMenu =  (object) => {
    if (!(object && object.records)) return object;
    Object.assign(object, {
       records: object.records.map(record => ({
         ...record,


           // set favorite icon based on presense in the db
           favorite: !!playlist_db && playlist_db.indexOf(record.FileKey) > -1 
             ? 'Favorite' 
             : 'FavoriteBorder',


           // add a menu icon column to the row
           menu: 'MoreVert'
       }))
    });
  }
  

   addMenu(data.related ||  data);


 api.shout(data, 'transformMusicRows')

  return data;
}

 */