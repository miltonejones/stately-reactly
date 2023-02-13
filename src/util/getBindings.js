export const getBindings = (key, appProps, stateProps) => {
  const [scope, label] = key.split('.');
  if (!!appProps && scope === 'application') {
    return appProps[label]
  }

  if (!stateProps) return ""

  return stateProps[label];

}