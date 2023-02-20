import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ColumnTree from './ColumnTree';
 
afterEach(() => cleanup());
 
describe('<ColumnTree/>', () => {
 it('ColumnTree mounts without failing', () => {
   render(<ColumnTree />);
   expect(screen.getAllByTestId("test-for-ColumnTree").length).toBeGreaterThan(0);
 });
});

