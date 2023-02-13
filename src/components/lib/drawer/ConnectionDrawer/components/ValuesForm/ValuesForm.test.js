import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ValuesForm from './ValuesForm';
 
afterEach(() => cleanup());
 
describe('<ValuesForm/>', () => {
 it('ValuesForm mounts without failing', () => {
   render(<ValuesForm />);
   expect(screen.getAllByTestId("test-for-ValuesForm").length).toBeGreaterThan(0);
 });
});

