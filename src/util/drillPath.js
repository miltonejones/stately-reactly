export const drillPath = (object, path) => {
  console.log ({ path })
  // const delimiter = '.';
  const delimiter = '/';
  const arr = path.split(delimiter);
  const first = arr.shift();
  const node = object[first];

  if (arr.length) {
    return drillPath(node, arr.join(delimiter));
  }

  return node;
};