import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ComponentTreeView from './ComponentTreeView';
 
afterEach(() => cleanup());
 
describe('<ComponentTreeView/>', () => {
 it('ComponentTreeView mounts without failing', () => {
   render(<ComponentTreeView />);
   expect(screen.getAllByTestId("test-for-ComponentTreeView").length).toBeGreaterThan(0);
 });
});

