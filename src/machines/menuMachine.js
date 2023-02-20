import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";


export const menuMachine = createMachine({
  id: 'settings_menu',
  initial: 'closed',
  states: {
    closed: {
      on: {
        open: {
          target: 'opening',
          actions: assign((context, event) => ({
            open: true,
            anchorEl: event.anchorEl,
            prompt: event.prompt
          })),
        },
      },
    },
    opening: {
      invoke: {
        src: 'readClipboard',
        onDone: [
          {
            target: 'opened',
            actions: assign({
              clipboard: (context, event) => event.data
            })
          }
        ],
        onError: [
          {
            target: 'opened'
          }
        ]
      }
    },
    closing: {
      invoke: {
        src: 'menuClicked',
        onDone: [
          {
            target: 'closed',
            actions: assign({
              prompt: null
            })
          },
        ],
      },
    },
    opened: {
      on: {
        close: {
          target: 'closing',
          actions: assign({
            anchorEl: null,
            open: false,
            value: (context, event) => event.value,
          }),
        },
        CHANGE: { 
          actions: assign({
            prompt: (context, event) => event.value
          }),
        },
      },
    },
  },
});


export const useMenu = (onChange) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      },
      readClipboard: async () => false
    },
  });
  const { anchorEl, open } = state.context;
  const handleClose = (value) => () => { 
    send({
      type: "close",
      value,
    })
  };
  const handleClick = (event) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
    });
  };

  const diagnosticProps = {
    ...menuMachine,
    state, 
    send, 
  };

  return {
    state,
    send,
    open,
    anchorEl,
    handleClick,
    handleClose,
    diagnosticProps,
  };
};
