import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyCarousel from './ReactlyCarousel';
 
afterEach(() => cleanup());
 
describe('<ReactlyCarousel/>', () => {
 it('ReactlyCarousel mounts without failing', () => {
   render(<ReactlyCarousel />);
   expect(screen.getAllByTestId("test-for-ReactlyCarousel").length).toBeGreaterThan(0);
 });
});

