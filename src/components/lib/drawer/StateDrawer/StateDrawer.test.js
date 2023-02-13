import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import StateDrawer from './StateDrawer';
 
afterEach(() => cleanup());
 
describe('<StateDrawer/>', () => {
 it('StateDrawer mounts without failing', () => {
   render(<StateDrawer />);
   expect(screen.getAllByTestId("test-for-StateDrawer").length).toBeGreaterThan(0);
 });
});

