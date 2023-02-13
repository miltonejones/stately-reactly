import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyIconButton from './ReactlyIconButton';
 
afterEach(() => cleanup());
 
describe('<ReactlyIconButton/>', () => {
 it('ReactlyIconButton mounts without failing', () => {
   render(<ReactlyIconButton />);
   expect(screen.getAllByTestId("test-for-ReactlyIconButton").length).toBeGreaterThan(0);
 });
});

