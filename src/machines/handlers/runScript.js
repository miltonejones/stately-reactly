import { useNavigate } from "react-router-dom";
import { executeScript } from "../../util/executeScript";

export const useRunScript = (scriptOptions = {}) => {
  const navigate = useNavigate();

  const runScript = async (context, event) => {
    const { data, scripts, selectedPage, action } = context;  
    const { api, application, registrar, ...options } = scriptOptions;
    const script = scripts.find(s => s.ID === action.target);

    !!registrar && registrar.log ('runscript %c%s', 'color: orange;font-weight:700', script.name, {
      scriptOptions,
      data
    });

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