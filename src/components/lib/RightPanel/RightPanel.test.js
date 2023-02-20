import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RightPanel from './RightPanel';
 
afterEach(() => cleanup());
 
describe('<RightPanel/>', () => {
 it('RightPanel mounts without failing', () => {
   render(<RightPanel />);
   expect(screen.getAllByTestId("test-for-RightPanel").length).toBeGreaterThan(0);
 });
});

