import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventHandlerList from './EventHandlerList';
 
afterEach(() => cleanup());
 
describe('<EventHandlerList/>', () => {
 it('EventHandlerList mounts without failing', () => {
   render(<EventHandlerList />);
   expect(screen.getAllByTestId("test-for-EventHandlerList").length).toBeGreaterThan(0);
 });
});

