import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyTextbox from './ReactlyTextbox';
 
afterEach(() => cleanup());
 
describe('<ReactlyTextbox/>', () => {
 it('ReactlyTextbox mounts without failing', () => {
   render(<ReactlyTextbox />);
   expect(screen.getAllByTestId("test-for-ReactlyTextbox").length).toBeGreaterThan(0);
 });
});

