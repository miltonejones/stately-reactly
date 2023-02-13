import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import StateSelect from './StateSelect';
 
afterEach(() => cleanup());
 
describe('<StateSelect/>', () => {
 it('StateSelect mounts without failing', () => {
   render(<StateSelect />);
   expect(screen.getAllByTestId("test-for-StateSelect").length).toBeGreaterThan(0);
 });
});

