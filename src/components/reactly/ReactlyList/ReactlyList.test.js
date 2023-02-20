import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyList from './ReactlyList';
 
afterEach(() => cleanup());
 
describe('<ReactlyList/>', () => {
 it('ReactlyList mounts without failing', () => {
   render(<ReactlyList />);
   expect(screen.getAllByTestId("test-for-ReactlyList").length).toBeGreaterThan(0);
 });
});

