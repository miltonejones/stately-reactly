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
        openPath: path => {
          const page = application.pages.find(f => f.PagePath === path);
          navigate (`/apps/page/${application.ID}/${page.ID}`)
        },
        ...api
      } 
    }); 
  }

  return { runScript }
}