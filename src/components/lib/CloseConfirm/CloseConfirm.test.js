import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CloseConfirm from './CloseConfirm';
 
afterEach(() => cleanup());
 
describe('<CloseConfirm/>', () => {
 it('CloseConfirm mounts without failing', () => {
   render(<CloseConfirm />);
   expect(screen.getAllByTestId("test-for-CloseConfirm").length).toBeGreaterThan(0);
 });
});

