import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyAudioPlayer from './ReactlyAudioPlayer';
 
afterEach(() => cleanup());
 
describe('<ReactlyAudioPlayer/>', () => {
 it('ReactlyAudioPlayer mounts without failing', () => {
   render(<ReactlyAudioPlayer />);
   expect(screen.getAllByTestId("test-for-ReactlyAudioPlayer").length).toBeGreaterThan(0);
 });
});

