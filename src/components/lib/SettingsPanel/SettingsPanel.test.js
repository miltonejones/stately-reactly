import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SettingsPanel from './SettingsPanel';
 
afterEach(() => cleanup());
 
describe('<SettingsPanel/>', () => {
 it('SettingsPanel mounts without failing', () => {
   render(<SettingsPanel />);
   expect(screen.getAllByTestId("test-for-SettingsPanel").length).toBeGreaterThan(0);
 });
});

