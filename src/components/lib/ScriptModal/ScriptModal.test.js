import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ScriptModal from './ScriptModal';
 
afterEach(() => cleanup());
 
describe('<ScriptModal/>', () => {
 it('ScriptModal mounts without failing', () => {
   render(<ScriptModal />);
   expect(screen.getAllByTestId("test-for-ScriptModal").length).toBeGreaterThan(0);
 });
});

