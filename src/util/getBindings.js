import { executeScript } from "./executeScript";

export const getBindings = (key, appProps, stateProps, scriptOptions) => {
  const [scope, label] = key.split('.');
  if (!!scriptOptions && scope === 'scripts') {
    return executeScript(label, scriptOptions)
  }

  if (!!appProps && scope === 'application') {
    return appProps[label]
  }

  if (!stateProps) return ""

  return stateProps[label];

}