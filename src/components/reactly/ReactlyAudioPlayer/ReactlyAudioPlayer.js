import React from 'react';
import { styled, Box } from '@mui/material';
import { useAudio } from '../../../machines/audioMachine';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ReactlyAudioPlayer = ({onProgress, ...props}) => {

  const audio = useAudio({
    ...props,
    onProgress: (event, options) => {
      // console.log ('%cprogress', 'color:red', options);
      onProgress(event, options);
    }
  })
  const { current_time_formatted } =  audio.state.context;
  return (
    <Layout data-testid="test-for-ReactlyAudioPlayer">
      {JSON.stringify(audio.state.value)}
      [{current_time_formatted}]
      {/* {!!props.onPlayerEnded && <pre>
        {props.onPlayerEnded.toString()}
        </pre>} */}
      {/* <pre>
      {JSON.stringify(props,0,2)}
      </pre> */}
    </Layout>
  );
}
ReactlyAudioPlayer.defaultProps = {};
export default ReactlyAudioPlayer;
