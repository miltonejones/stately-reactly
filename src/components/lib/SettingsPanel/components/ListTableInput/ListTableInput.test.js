import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ListTableInput from './ListTableInput';
 
afterEach(() => cleanup());
 
describe('<ListTableInput/>', () => {
 it('ListTableInput mounts without failing', () => {
   render(<ListTableInput />);
   expect(screen.getAllByTestId("test-for-ListTableInput").length).toBeGreaterThan(0);
 });
});

