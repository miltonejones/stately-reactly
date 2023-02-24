import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyRepeater from './ReactlyRepeater';
 
afterEach(() => cleanup());
 
describe('<ReactlyRepeater/>', () => {
 it('ReactlyRepeater mounts without failing', () => {
   render(<ReactlyRepeater />);
   expect(screen.getAllByTestId("test-for-ReactlyRepeater").length).toBeGreaterThan(0);
 });
});

