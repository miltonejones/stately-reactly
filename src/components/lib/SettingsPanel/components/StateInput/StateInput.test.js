import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import StateInput from './StateInput';
 
afterEach(() => cleanup());
 
describe('<StateInput/>', () => {
 it('StateInput mounts without failing', () => {
   render(<StateInput />);
   expect(screen.getAllByTestId("test-for-StateInput").length).toBeGreaterThan(0);
 });
});

