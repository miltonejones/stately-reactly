import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ScriptRun from './ScriptRun';
 
afterEach(() => cleanup());
 
describe('<ScriptRun/>', () => {
 it('ScriptRun mounts without failing', () => {
   render(<ScriptRun />);
   expect(screen.getAllByTestId("test-for-ScriptRun").length).toBeGreaterThan(0);
 });
});

