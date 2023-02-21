import { useNavigate } from "react-router-dom";
import { executeScript } from "../../util/executeScript";

export const useRunScript = (scriptOptions = {}) => {
  const navigate = useNavigate();

  const runScript = async (context, event) => {
    const { data, scripts, selectedPage, action } = context;  
    const { api, application, ...options } = scriptOptions;
    console.log ({
      api: scriptOptions
    })
    return executeScript(action.target, { 
      scripts, 
      selectedPage, 
      data,  
      application,
      options,
      api: {
        openPath: (path, params) => {
          const suffix = !params ? '' : `/${Object.values(params).join('/')}`
          // const page = application.pages.find(f => f.PagePath === path);
          navigate (`/edit/${context.application?.path}/${path}${suffix}`)
        },
        ...api
      } 
    }); 
  }

  return { runScript }
}