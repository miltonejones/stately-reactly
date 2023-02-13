import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SimpleMenu from './SimpleMenu';
 
afterEach(() => cleanup());
 
describe('<SimpleMenu/>', () => {
 it('SimpleMenu mounts without failing', () => {
   render(<SimpleMenu />);
   expect(screen.getAllByTestId("test-for-SimpleMenu").length).toBeGreaterThan(0);
 });
});

