import { createMachine, assign } from "xstate";
import React from 'react';
import { useMachine } from "@xstate/react";
import { AppStateContext } from '../context';
import moment from "moment";

export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

export const audioMachine = createMachine(
  {
    id: "audio_player",
    initial: "begin",
    context: {
      image:
        "https://is5-ssl.mzstatic.com/image/thumb/Podcasts116/v4/e4/a3/c6/e4a3c61d-7195-9431-f6a9-cf192f9c803e/mza_4615863570753709983.jpg/100x100bb.jpg",
      title: "This is the selected podcast title",
      scrolling: false,
      eq: true,
      src: `https://pdst.fm/e/chrt.fm/track/479722/arttrk.com/p/CRMDA/claritaspod.com/measure/pscrb.fm/rss/p/stitcher.simplecastaudio.com/9aa1e238-cbed-4305-9808-c9228fc6dd4f/episodes/d2a175f2-db09-480b-992d-d54b71c4c972/audio/128/default.mp3?aid=rss_feed&awCollectionId=9aa1e238-cbed-4305-9808-c9228fc6dd4f&awEpisodeId=d2a175f2-db09-480b-992d-d54b71c4c972&feed=dxZsm5kX`,
    },
    states: {
      begin: {
        invoke: {
          src: "loadAudio",
          onDone: [
            {
              target: "#audio_player.equip",
              actions: "assignResultsToContext",
            },
          ],
        },
      },

      equip: {
        invoke: {
          src: 'loadMethods',
          onDone: [
            {
              target: "#audio_player.idle.loaded",
              actions: assign((_, event) => event.data),
            },
          ],
        }
      },

      idle: {
        initial: "loaded",
        states: {
          loaded: {
            on: {
              PLAY: {
                target: "#audio_player.reading", 
              },
              OPEN: {
                target: "#audio_player.opened",
                actions: "assignSourceToContext",
              },
              QUEUE: {
                target: "#audio_player.opened",
                actions: "initQueue",
              },
              CHANGE: {
                target: "#audio_player.idle.loaded",
                actions: "assignSourceToContext",
              },
            },
          },
        },
      },

      ended: {
        invoke: {
          src: "audioEnded",
        },
      },

      replay: {
        invoke: {
          src: "clearAudio",
          onDone: [
            {
              target: "opened",
            },
          ],
        },
      },

      reading: {
        invoke: {
          src: 'readSource',
          onDone: [
            {
              target: "#audio_player.opened",
              actions: assign((_, event) => ({
                src: event.data
              }))
            }
          ]
        }

      },

      opened: {
        initial: "reset",

        on: {
          CLOSE: {
            target: "idle",
            actions: "clearPlayer",
          },
        },
        states: {
          reset: {
            invoke: {
              src: 'audioStarted',
              onDone: [
                { 
                  target: "start",
                  actions: assign({
                    retries: 1,
                  }),
                }
              ]
            } 
          },
          start: {
            invoke: {
              src: "startAudio",
              onDone: [
                {
                  target: "playing",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: assign({
                    retries: (context, event) => context.retries + 1,
                  }),
                },
              ],
            },
          },
          error: {
            initial: "retry",
            states: {
              retry: {
                invoke: {
                  src: "loadAudio",
                  onDone: [
                    {
                      target: "#audio_player.opened.start",
                      actions: "assignResultsToContext",
                      cond: (context) => context.retries < 4,
                    },
                    {
                      target: "#audio_player.opened.error.fatal",
                    },
                  ],
                },
              },
              fatal: {
                on: {
                  RECOVER: {
                    target: "#audio_player.idle",
                  },
                },
              },
            },
          },
          playing: {
            on: {
              PAUSE: {
                target: "paused",
                actions: "pausePlayer",
              },
              COORDS: {
                target: "playing",
                actions: "assignCoordsToContext",
              },
              PROGRESS: {
                target: "playing",
                actions: "assignProgressToContext",
              },
              SEEK: {
                target: "playing",
                actions: "seekPlayer",
              },
              ERROR: {
                target: "error",
                actions: "turnEqOff",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              END: [
                {
                  target: "#audio_player.replay",
                  cond: context => !!context.trackList,
                  actions: "assignNextTrackToContext",
                },
                {

                  target: "#audio_player.idle",
                  actions: ["invokeEnded", "clearPlayer"],
                }
              ],
              QUEUE: {
                actions: "addToQueue",
              },
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              }, 
              SOUND: {
                actions: "assignVolume",
              }, 
            },
          }, 
          paused: {
            on: {
              PAUSE: {
                target: "playing",
                actions: "playPlayer",
              },
              OPEN: {
                target: "#audio_player.replay",
                actions: ["assignSourceToContext"],
              },
              QUEUE: {
                actions: "addToQueue",
              },
              TOGGLE: {
                actions: assign((context, event) => ({
                  [event.key]: !context[event.key],
                })),
              }, 
            },
          },
        },
      },
    },
  },
  {
    actions: { 
      initQueue: assign((context, event) => { 
        const { track } = event ;
        persistTrack(track); 
        return {
          ...track, 
          trackList: [track],
          src: playerUrl(track.FileKey),
          scrolling: track.Title?.length > 35,
        }; 
      }),
      
      addToQueue: assign((context, event) => { 
        const index = context.trackList
          .map(t => t.ID)
          .indexOf(context.ID) + 1; 
        const trackList = context.trackList
          .slice(0, index)
          .concat([{ ...event.track, inserted: !0 }])
          .concat(context.trackList.slice(index));

        return {
          trackList 
        };
      }),
      invokeEnded: assign((context) => {
        const { onPlayerEnded, player } = context;  
        console.log ('%cENDED', 'color:red')
        onPlayerEnded && onPlayerEnded(player);
      }),
      clearPlayer: assign((context, event) => {
        context.player.pause();
        return {
          src: null,
          progress: null,
          currentTime: 0,
          duration: 0,
          current_time_formatted: "0:00",
        };
      }),
      assignVolume: assign((context, event) => {
        context.player.volume = event.value;
        return {
          volume: event.value,
        }
      }),
      pausePlayer: assign((context, event) => {
        context.player.pause();
      }),
      playPlayer: assign((context, event) => {
        context.player.play();
      }),
      seekPlayer: assign((context, event) => {
        context.player.currentTime = event.value;
      }),
      assignProgressToContext: assign((context, event) => {
        const { currentTime, duration } = event;
        const { onProgress, player } = context;

        const current_time_formatted = !currentTime
          ? "0:00"
          : moment.utc(currentTime * 1000).format("mm:ss");

        const duration_formatted = !duration
          ? "0:00"
          : moment.utc(duration * 1000).format("mm:ss");

        const message = {
          currentTime,
          current_time_formatted,
          duration_formatted,
          duration,
          progress: (currentTime / duration) * 100,
        };
        


        onProgress && onProgress(player, message);
          
        // console.log('%ctimeupdate', `color: ${!!onProgress?"yellow":"red"};text-transform: capitalize`, message);


        return message;
      }),
      assignCoordsToContext: assign((context, event) => {
        return {
          coords: event.coords,
        };
      }),
      turnEqOff: assign((context, event) => {
        context.player.pause();
        return {
          eq: false,
          player: null,
          retries: context.retries + 1,
        };
      }),
      turnEqOn: assign((context, event) => {
        context.player.pause();
        return {
          eq: true,
          player: null,
        };
      }),
      assignResultsToContext: assign((context, event) => {
        return {
          player: event.data,
          volume: event.data.volume,
          memory: getPersistedTracks()
        };
      }),
      assignNextTrackToContext: assign((context, event) => {
        const index =
          context.trackList.map((f) => f.FileKey).indexOf(context.FileKey) + 1;
        const track = context.trackList[index];
        persistTrack(track);
        return {
          ...track,
          FileKey: track.FileKey,
          src: playerUrl(track.FileKey),
          scrolling: track.Title?.length > 35,
        };
      }),
      assignSourceToContext: assign((context, event) => {
        const { value, options, trackList, ...rest} = event;
        persistTrack(rest); 
        return {
          ...event,
          FileKey: event.value,
          trackList,
          src: value, //playerUrl(value),
          scrolling: event.Title?.length > 35,
        };
      }),
    },
  }
);



const COOKIE_NAME = 'track-memory';
const persistTrack = track => {
  const memory = JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]");
  const update = memory.find(f => f.ID === track.ID)
    ? memory 
    : memory.concat(track);
  localStorage.setItem(COOKIE_NAME, JSON.stringify(update));
}

const getPersistedTracks = () => JSON.parse(localStorage.getItem(COOKIE_NAME) || "[]")

export const useAudio = ({ 
  ID, 
  ComponentName,
  ...props
}) => {
  const {
    onPlayerStart,
    onPlayerStop,
    onProgress, 
    onPlayerEnded,
  } = props;
  const reactly = React.useContext(AppStateContext);
  const services = {
    readSource: async () => props.src,
    clearAudio: async (context) => {
      context.player.pause();
      context.player.src = null;
      await new Promise((go) => setTimeout(go, 999));
    },

    startAudio: async (context) => {
      try {
        context.player.src = context.src;
        context.player.play();
        return context.player;
      } catch (e) {
        throw new Error(e);
      }
    },

    loadMethods: async () => ({
      onPlayerStart,
      onPlayerStop,
      onProgress, 
      onPlayerEnded,
    }),

    audioStarted: async (context) => true, //onPlayerStart && onPlayerStart(context.artistFk),

    loadAudio: async (context) => {
      const audio = new Audio();

      audio.addEventListener("play", () => {
        console.log('%cPLAY', 'color: yellow;text-transform: capitalize');
        onPlayerStart && onPlayerStart(audio);
      });

      audio.addEventListener("pause", () => {
        console.log('%cpause', 'color: yellow;text-transform: capitalize');
        onPlayerStop && onPlayerStop(audio);
      });

      audio.addEventListener("ended", () => {
        console.log('%cended', 'color: yellow;text-transform: capitalize');
        send("END");
      });

      audio.addEventListener("error", () => {
        console.log('%cerror', 'color: yellow;text-transform: capitalize');
        send("ERROR");
      });

      audio.addEventListener("timeupdate", () => { 
      //  handleTimeUpdate(audio, onProgress);
        send({
          type: "PROGRESS",
          currentTime: audio.currentTime,
          duration: audio.duration, 
        });
      });

      reactly.send({
        type: 'REFER',
        ID,
        ComponentName,
        controller:  {
          play: () => send('PLAY'),
          pause: () => send('PAUSE'),
          paused: !1, //context.player.paused
        }
      });

      return audio;
    },
  };
  
  const [state, send] = useMachine(audioMachine, { services }); 

  return {
    state,
    send, 
    ...state.context
  };
}


// const handleTimeUpdate = (aux, onProgress) => {
//   if (!aux) return;
//   // if (aux.currentTime !== parseInt(aux.currentTime)) return;
//    const ms = (aux.currentTime / aux.duration) ;
//    const progress = ms * 100;
//   const duration_formatted = moment
//     .utc(aux.duration * 1000)
//     .format("mm:ss");
//   const current_time_formatted = moment
//     .utc(aux.currentTime * 1000)
//     .format("mm:ss");


//   onProgress &&
//     onProgress(aux, {
//       currentTime: aux.currentTime,
//       duration: aux.duration,
//       progress,
//       duration_formatted,
//       current_time_formatted,
//     });
// };
