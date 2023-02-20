import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyDrawer from './ReactlyDrawer';
 
afterEach(() => cleanup());
 
describe('<ReactlyDrawer/>', () => {
 it('ReactlyDrawer mounts without failing', () => {
   render(<ReactlyDrawer />);
   expect(screen.getAllByTestId("test-for-ReactlyDrawer").length).toBeGreaterThan(0);
 });
});

