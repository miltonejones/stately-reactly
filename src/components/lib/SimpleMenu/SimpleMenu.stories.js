import React from 'react';
import SimpleMenu from './SimpleMenu';
 
export default {
 title: 'SimpleMenu',
 component: SimpleMenu
};
 
const Template = (args) => <SimpleMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
