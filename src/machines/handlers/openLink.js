import { useNavigate } from "react-router-dom";

export const useOpenLink = () => {
  const navigate = useNavigate();
  const openLink = async (context, event) => {
    const { application, action } = context; 
    const page = application.pages.find(f => f.ID === action.target);
    navigate (`/edit/${application.path}/${page.PagePath}`);
    return true 
  }
  return { openLink }
}