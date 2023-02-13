import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ResourceForm from './ResourceForm';
 
afterEach(() => cleanup());
 
describe('<ResourceForm/>', () => {
 it('ResourceForm mounts without failing', () => {
   render(<ResourceForm />);
   expect(screen.getAllByTestId("test-for-ResourceForm").length).toBeGreaterThan(0);
 });
});

