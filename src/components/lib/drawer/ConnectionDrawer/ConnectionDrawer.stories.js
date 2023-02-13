import React from 'react';
import ConnectionDrawer from './ConnectionDrawer';
 
export default {
 title: 'ConnectionDrawer',
 component: ConnectionDrawer
};
 
const Template = (args) => <ConnectionDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
