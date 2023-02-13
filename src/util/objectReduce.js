export const objectReduce = (object = []) => [...object].reduce((items, res) => {
  items[res.Key] =  res.Value === undefined 
    ? ""
    : res.Value; 
  return items;
}, {});