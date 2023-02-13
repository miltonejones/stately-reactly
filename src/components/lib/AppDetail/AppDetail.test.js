import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppDetail from './AppDetail';
 
afterEach(() => cleanup());
 
describe('<AppDetail/>', () => {
 it('AppDetail mounts without failing', () => {
   render(<AppDetail />);
   expect(screen.getAllByTestId("test-for-AppDetail").length).toBeGreaterThan(0);
 });
});

