import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ColumnList from './ColumnList';
 
afterEach(() => cleanup());
 
describe('<ColumnList/>', () => {
 it('ColumnList mounts without failing', () => {
   render(<ColumnList />);
   expect(screen.getAllByTestId("test-for-ColumnList").length).toBeGreaterThan(0);
 });
});

