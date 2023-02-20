import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

const carouselMachine = createMachine(
  {
    id: 'carousel',
    initial: 'load',
    context: {images: []},
    states: {
      wait: {
        on: {
          LOAD: {
            target: '#carousel.stop',
            actions: "reassignImages",
          }, 
        }
      },
      load: {
        invoke: {
          src: 'loadImages',
          onDone: [
            {
              target: 'stop',
              actions: 'assignImages',
              cond: (_, event) => !!event.data?.length
            },
            {
              target: '#carousel.wait', 
            },
          ],
        },
      },
      go: {
        LOAD: {
          target: '#carousel.stop',
          actions: "reassignImages",
        }, 
        after: {
          1000: {
            target: 'stop',
            actions: 'nextImage',
          },
        },
      },
      stop: {
        LOAD: { 
          actions: "reassignImages",
        }, 
        after: {
          6000: {
            target: 'go',
            actions: 'assignImage',
          },
        },
      },
    },
  },
  {
    actions: {

      reassignImages: assign((context, event) => {
        const { images } = event;
        if (!images) return;
        return {
          images,
          index: 0,
          first: images[0],
          second: images[1],
        };
      }),

      // load initial images
      assignImages: assign((context, event) => {
        const images = event.data;
        if (!images) return;
        return {
          images,
          index: 0,
          first: images[0],
          second: images[1],
        };
      }),
      // assign first and second image
      assignImage: assign((context) => {
        const { images, index } = context;
        if (!images) return;
        const first = images[index % images.length];
        const second = images[(index + 1) % images.length];
        return {
          first,
          second,
          running: true,
          // increment index here
          index: index + 1,
        };
      }),
      // move second image into first position
      nextImage: assign((context) => {
        const { images, index } = context;
        if (!images) return;
        const first = images[index % images.length];
        return {
          first,
          running: false,
        };
      }),
    },
  }
);


export const useCarousel = (images) => {
  const [state, send] = useMachine(carouselMachine, {
    services: { 
      loadImages: async () => images,
    },
  }); 


  React.useEffect(() => {
    if (!images?.length) return;

    // alert  (images?.length + '--' + JSON.stringify(state.value))
    send({
      type: 'LOAD',
      images
    })
  }, [images, send])


  return {
    state,
    send, 
    ...state.context
  };
}
