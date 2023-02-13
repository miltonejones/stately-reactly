import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ConnectionForm from './ConnectionForm';
 
afterEach(() => cleanup());
 
describe('<ConnectionForm/>', () => {
 it('ConnectionForm mounts without failing', () => {
   render(<ConnectionForm />);
   expect(screen.getAllByTestId("test-for-ConnectionForm").length).toBeGreaterThan(0);
 });
});

