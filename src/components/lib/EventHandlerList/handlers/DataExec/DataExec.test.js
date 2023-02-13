import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DataExec from './DataExec';
 
afterEach(() => cleanup());
 
describe('<DataExec/>', () => {
 it('DataExec mounts without failing', () => {
   render(<DataExec />);
   expect(screen.getAllByTestId("test-for-DataExec").length).toBeGreaterThan(0);
 });
});

