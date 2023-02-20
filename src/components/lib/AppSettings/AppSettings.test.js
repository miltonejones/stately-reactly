import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppSettings from './AppSettings';
 
afterEach(() => cleanup());
 
describe('<AppSettings/>', () => {
 it('AppSettings mounts without failing', () => {
   render(<AppSettings />);
   expect(screen.getAllByTestId("test-for-AppSettings").length).toBeGreaterThan(0);
 });
});

