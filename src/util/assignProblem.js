import { assign } from 'xstate';

export const assignProblem = assign((context, event) => {
  return {
    error: event.data.message,
    stack: event.data.stack,
  };
});