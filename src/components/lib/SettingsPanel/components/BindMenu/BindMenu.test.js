import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import BindMenu from './BindMenu';
 
afterEach(() => cleanup());
 
describe('<BindMenu/>', () => {
 it('BindMenu mounts without failing', () => {
   render(<BindMenu />);
   expect(screen.getAllByTestId("test-for-BindMenu").length).toBeGreaterThan(0);
 });
});

