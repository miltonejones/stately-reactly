export const map = async (list, fn, index = 0, out = []) => {
  if (index < list.length) {

    const trigger  = list[index];
    const res = await fn(trigger, index);
    out.push(res)
    return await map (list, fn, ++index, out );
  }
  return out;
}