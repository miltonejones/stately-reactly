import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyFieldset from './ReactlyFieldset';
 
afterEach(() => cleanup());
 
describe('<ReactlyFieldset/>', () => {
 it('ReactlyFieldset mounts without failing', () => {
   render(<ReactlyFieldset />);
   expect(screen.getAllByTestId("test-for-ReactlyFieldset").length).toBeGreaterThan(0);
 });
});

