import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ScriptDrawer from './ScriptDrawer';
 
afterEach(() => cleanup());
 
describe('<ScriptDrawer/>', () => {
 it('ScriptDrawer mounts without failing', () => {
   render(<ScriptDrawer />);
   expect(screen.getAllByTestId("test-for-ScriptDrawer").length).toBeGreaterThan(0);
 });
});

