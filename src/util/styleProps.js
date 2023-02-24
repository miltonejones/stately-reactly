import { objectReduce } from "./objectReduce"

const gridTransform = (value) => {
  const fr = [];
  for (let e = 0; e < value; e++) {
    fr.push('1fr');
  }
  return fr.join(' ')
};
 

export const styleProps = (object = {}) => {
  const css = objectReduce(object);
  return Object.keys(css).reduce((out, key) => {
    if (typeof css[key] === 'string' && css[key].indexOf('/') > 0) {
      out[key] = `var(--${css[key].replace(/[/.]/g, '-').toLowerCase()})`
    } else if (key === 'grid-template-columns') {
      out[key] = gridTransform(css[key])
    } else {
      out[key] = css[key]
    }

    return out;
  }, {})
}  


