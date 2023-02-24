import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactlyInfoCard from './ReactlyInfoCard';
 
afterEach(() => cleanup());
 
describe('<ReactlyInfoCard/>', () => {
 it('ReactlyInfoCard mounts without failing', () => {
   render(<ReactlyInfoCard />);
   expect(screen.getAllByTestId("test-for-ReactlyInfoCard").length).toBeGreaterThan(0);
 });
});

