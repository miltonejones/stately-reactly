import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ComponentTree from './ComponentTree';
 
afterEach(() => cleanup());
 
describe('<ComponentTree/>', () => {
 it('ComponentTree mounts without failing', () => {
   render(<ComponentTree />);
   expect(screen.getAllByTestId("test-for-ComponentTree").length).toBeGreaterThan(0);
 });
});

