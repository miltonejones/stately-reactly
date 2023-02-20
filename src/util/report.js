export const report = (object, title) => {
  if (!object) {
    return console.log("%c%s is not defined", "color:cyan", title)
  }
  const reported = Object.keys(object).reduce((out, key) => {
    if (['string', 'boolean', 'number'].some(f => typeof object[key] === f)) {
      out[key] = object[key]
    }
    return out;
  }, {});
  console.log("%c%s", "color:lime;font-weight:600", title)
  console.table (reported);
}