import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ComponentInfoChip from './ComponentInfoChip';
 
afterEach(() => cleanup());
 
describe('<ComponentInfoChip/>', () => {
 it('ComponentInfoChip mounts without failing', () => {
   render(<ComponentInfoChip />);
   expect(screen.getAllByTestId("test-for-ComponentInfoChip").length).toBeGreaterThan(0);
 });
});

