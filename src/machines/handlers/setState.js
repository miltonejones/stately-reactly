import { getBindings } from "../../util/getBindings";

export const useSetState = (stateSetter) => {
 
  const setState = async (context) => {
    const { action, eventProps } = context;
    const [scope] = action.target.split(".")

    stateSetter(scope, (appProps, pageProps) => {
      const value = typeof action.value !== 'string' ? action.value : getBindings(action.value, {
        appProps,
        pageProps,
        eventProps
      }); 

      return {
        [action.target]: value
      }
    })
  }
  return { setState }
}