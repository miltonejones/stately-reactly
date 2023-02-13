import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import OpenLink from './OpenLink';
 
afterEach(() => cleanup());
 
describe('<OpenLink/>', () => {
 it('OpenLink mounts without failing', () => {
   render(<OpenLink />);
   expect(screen.getAllByTestId("test-for-OpenLink").length).toBeGreaterThan(0);
 });
});

