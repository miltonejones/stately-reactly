import React from 'react';
import DrawerMenu from './DrawerMenu';
 
export default {
 title: 'DrawerMenu',
 component: DrawerMenu
};
 
const Template = (args) => <DrawerMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
