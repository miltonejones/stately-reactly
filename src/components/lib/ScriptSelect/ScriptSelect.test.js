import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ScriptSelect from './ScriptSelect';
 
afterEach(() => cleanup());
 
describe('<ScriptSelect/>', () => {
 it('ScriptSelect mounts without failing', () => {
   render(<ScriptSelect />);
   expect(screen.getAllByTestId("test-for-ScriptSelect").length).toBeGreaterThan(0);
 });
});

