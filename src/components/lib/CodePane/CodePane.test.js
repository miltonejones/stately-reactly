import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CodePane from './CodePane';
 
afterEach(() => cleanup());
 
describe('<CodePane/>', () => {
 it('CodePane mounts without failing', () => {
   render(<CodePane />);
   expect(screen.getAllByTestId("test-for-CodePane").length).toBeGreaterThan(0);
 });
});

