import React from 'react';
import EventHandlerList from './EventHandlerList';
 
export default {
 title: 'EventHandlerList',
 component: EventHandlerList
};
 
const Template = (args) => <EventHandlerList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
