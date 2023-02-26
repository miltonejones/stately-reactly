import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ListBuilderInput from './ListBuilderInput';
 
afterEach(() => cleanup());
 
describe('<ListBuilderInput/>', () => {
 it('ListBuilderInput mounts without failing', () => {
   render(<ListBuilderInput />);
   expect(screen.getAllByTestId("test-for-ListBuilderInput").length).toBeGreaterThan(0);
 });
});

