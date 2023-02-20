import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyDatagrid from './ReactlyDatagrid';
 
afterEach(() => cleanup());
 
describe('<ReactlyDatagrid/>', () => {
 it('ReactlyDatagrid mounts without failing', () => {
   render(<ReactlyDatagrid />);
   expect(screen.getAllByTestId("test-for-ReactlyDatagrid").length).toBeGreaterThan(0);
 });
});

