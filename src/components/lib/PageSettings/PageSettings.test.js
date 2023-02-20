import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PageSettings from './PageSettings';
 
afterEach(() => cleanup());
 
describe('<PageSettings/>', () => {
 it('PageSettings mounts without failing', () => {
   render(<PageSettings />);
   expect(screen.getAllByTestId("test-for-PageSettings").length).toBeGreaterThan(0);
 });
});

