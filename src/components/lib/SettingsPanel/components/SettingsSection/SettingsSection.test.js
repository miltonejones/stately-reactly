import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SettingsSection from './SettingsSection';
 
afterEach(() => cleanup());
 
describe('<SettingsSection/>', () => {
 it('SettingsSection mounts without failing', () => {
   render(<SettingsSection />);
   expect(screen.getAllByTestId("test-for-SettingsSection").length).toBeGreaterThan(0);
 });
});

