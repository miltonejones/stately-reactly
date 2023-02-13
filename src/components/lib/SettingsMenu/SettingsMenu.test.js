import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SettingsMenu from './SettingsMenu';
 
afterEach(() => cleanup());
 
describe('<SettingsMenu/>', () => {
 it('SettingsMenu mounts without failing', () => {
   render(<SettingsMenu />);
   expect(screen.getAllByTestId("test-for-SettingsMenu").length).toBeGreaterThan(0);
 });
});

