import { getBindings } from "../../util/getBindings";

export const useSetState = (stateSetter, registrar) => {
 
  const setState = async (context) => {
    const { action, eventProps } = context;
    const [scope, label] = action.target.split(".");
    const key = label || scope;

    stateSetter(scope, (appProps, pageProps) => {

      const value = typeof action.value !== 'string' ? action.value : getBindings(action.value, {
        appProps,
        pageProps,
        eventProps
      }); 

    !!eventProps &&
    registrar && registrar.log ('state %c%s', 'color:cyan', 
        action.target, action.value, value ,  key
      );


      return {
        [key]: value
      }
    })
  }
  return { setState }
}