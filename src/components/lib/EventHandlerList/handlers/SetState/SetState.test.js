import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SetState from './SetState';
 
afterEach(() => cleanup());
 
describe('<SetState/>', () => {
 it('SetState mounts without failing', () => {
   render(<SetState />);
   expect(screen.getAllByTestId("test-for-SetState").length).toBeGreaterThan(0);
 });
});

