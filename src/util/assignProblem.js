import { assign } from 'xstate';

export const assignProblem = assign((context, event) => {
  const issue = {
    error: event.data.message,
    stack: event.data.stack,
  };
  console.log ({ issue , context})
  return issue;
});