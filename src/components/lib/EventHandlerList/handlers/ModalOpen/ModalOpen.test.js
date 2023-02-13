import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ModalOpen from './ModalOpen';
 
afterEach(() => cleanup());
 
describe('<ModalOpen/>', () => {
 it('ModalOpen mounts without failing', () => {
   render(<ModalOpen />);
   expect(screen.getAllByTestId("test-for-ModalOpen").length).toBeGreaterThan(0);
 });
});

