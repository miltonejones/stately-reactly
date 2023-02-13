import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PageTreeView from './PageTreeView';
 
afterEach(() => cleanup());
 
describe('<PageTreeView/>', () => {
 it('PageTreeView mounts without failing', () => {
   render(<PageTreeView />);
   expect(screen.getAllByTestId("test-for-PageTreeView").length).toBeGreaterThan(0);
 });
});

