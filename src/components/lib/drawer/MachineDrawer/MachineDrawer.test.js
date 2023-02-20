import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import MachineDrawer from './MachineDrawer';
 
afterEach(() => cleanup());
 
describe('<MachineDrawer/>', () => {
 it('MachineDrawer mounts without failing', () => {
   render(<MachineDrawer />);
   expect(screen.getAllByTestId("test-for-MachineDrawer").length).toBeGreaterThan(0);
 });
});

