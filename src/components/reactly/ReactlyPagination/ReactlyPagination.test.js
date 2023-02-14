import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyPagination from './ReactlyPagination';
 
afterEach(() => cleanup());
 
describe('<ReactlyPagination/>', () => {
 it('ReactlyPagination mounts without failing', () => {
   render(<ReactlyPagination />);
   expect(screen.getAllByTestId("test-for-ReactlyPagination").length).toBeGreaterThan(0);
 });
});

