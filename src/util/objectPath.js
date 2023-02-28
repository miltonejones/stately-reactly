export const objectPath = (object, out = []) => {
    
  if (typeof (object) === 'string') { 
    return out.concat(object).join('.');
  }

  const keys = Object.keys(object);
  if (keys) {
    const key = keys[0]; 
    return objectPath(object[key], out.concat(key))
  }

  return out.join('.');
}