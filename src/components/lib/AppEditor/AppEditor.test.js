import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppEditor from './AppEditor';
 
afterEach(() => cleanup());
 
describe('<AppEditor/>', () => {
 it('AppEditor mounts without failing', () => {
   render(<AppEditor />);
   expect(screen.getAllByTestId("test-for-AppEditor").length).toBeGreaterThan(0);
 });
});

