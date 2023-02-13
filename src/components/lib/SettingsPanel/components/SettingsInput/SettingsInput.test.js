import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SettingsInput from './SettingsInput';
 
afterEach(() => cleanup());
 
describe('<SettingsInput/>', () => {
 it('SettingsInput mounts without failing', () => {
   render(<SettingsInput />);
   expect(screen.getAllByTestId("test-for-SettingsInput").length).toBeGreaterThan(0);
 });
});

