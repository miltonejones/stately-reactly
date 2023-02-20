import { useNavigate } from "react-router-dom";

export const useOpenLink = () => {
  const navigate = useNavigate();
  const openLink = async (context, event) => {
    const { application, action } = context; 
    navigate (`/apps/page/${application.ID}/${action.target}`);
    return true 
  }
  return { openLink }
}