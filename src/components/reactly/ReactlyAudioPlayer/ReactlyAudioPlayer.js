import React from 'react';
import { styled, Box } from '@mui/material';
import { useAudio } from '../../../machines/audioMachine';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const ReactlyAudioPlayer = (props) => {
  const audio = useAudio(props)
  return (
    <Layout data-testid="test-for-ReactlyAudioPlayer">
      {JSON.stringify(audio.state.value)}
      <pre>
      {JSON.stringify(props)}
      </pre>
    </Layout>
  );
}
ReactlyAudioPlayer.defaultProps = {};
export default ReactlyAudioPlayer;
