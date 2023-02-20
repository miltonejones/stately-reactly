import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyButton from './ReactlyButton';
 
afterEach(() => cleanup());
 
describe('<ReactlyButton/>', () => {
 it('ReactlyButton mounts without failing', () => {
   render(<ReactlyButton />);
   expect(screen.getAllByTestId("test-for-ReactlyButton").length).toBeGreaterThan(0);
 });
});

