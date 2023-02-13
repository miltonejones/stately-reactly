import { assign } from 'xstate';
import { uniqueId } from './uniqueId';

export const assignProps = (type, field) => assign((context, event) => {
  const {ID, Key, Value, unlink } = event;
  const prop = context[type].find(d => d.ID === ID);
  const changed = {
    ...prop,
    ID: ID || uniqueId(),
    [Key]: Value,
    unlink
  } 
  
  return {
    [field]: changed
  }
})
