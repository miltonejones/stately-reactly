import { assign } from 'xstate';

export const clearProblems = assign((context, event) => {
  return {
    error: null,
    stack: null,
  };
});