import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DrawerMenu from './DrawerMenu';
 
afterEach(() => cleanup());
 
describe('<DrawerMenu/>', () => {
 it('DrawerMenu mounts without failing', () => {
   render(<DrawerMenu />);
   expect(screen.getAllByTestId("test-for-DrawerMenu").length).toBeGreaterThan(0);
 });
});

