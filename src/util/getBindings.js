import { executeScript } from "./executeScript";

export const getBindings = (key, options) => {
  const { appProps, pageProps, eventProps, routeProps } = options;
  const [scope, label] = key.split('.');
  if (!!options && scope === 'scripts') {
    return executeScript(label, options)
  }

  if (!!appProps && scope === 'application') {
    return appProps[label]
  }

  if (!!routeProps && scope === 'parameters') {
    return routeProps[label]
  }

  if (!!eventProps && scope === 'event') {
    return eventProps[label]
  }

  if (!pageProps) return scope

  return pageProps[scope] || scope;

}