import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ConnectionDrawer from './ConnectionDrawer';
 
afterEach(() => cleanup());
 
describe('<ConnectionDrawer/>', () => {
 it('ConnectionDrawer mounts without failing', () => {
   render(<ConnectionDrawer />);
   expect(screen.getAllByTestId("test-for-ConnectionDrawer").length).toBeGreaterThan(0);
 });
});

