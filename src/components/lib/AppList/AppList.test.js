import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppList from './AppList';
 
afterEach(() => cleanup());
 
describe('<AppList/>', () => {
 it('AppList mounts without failing', () => {
   render(<AppList />);
   expect(screen.getAllByTestId("test-for-AppList").length).toBeGreaterThan(0);
 });
});

