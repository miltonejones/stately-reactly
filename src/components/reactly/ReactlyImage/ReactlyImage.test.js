import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyImage from './ReactlyImage';
 
afterEach(() => cleanup());
 
describe('<ReactlyImage/>', () => {
 it('ReactlyImage mounts without failing', () => {
   render(<ReactlyImage />);
   expect(screen.getAllByTestId("test-for-ReactlyImage").length).toBeGreaterThan(0);
 });
});

