import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RepeaterInput from './RepeaterInput';
 
afterEach(() => cleanup());
 
describe('<RepeaterInput/>', () => {
 it('RepeaterInput mounts without failing', () => {
   render(<RepeaterInput />);
   expect(screen.getAllByTestId("test-for-RepeaterInput").length).toBeGreaterThan(0);
 });
});

