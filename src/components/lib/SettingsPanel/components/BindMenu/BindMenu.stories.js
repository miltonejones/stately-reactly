import React from 'react';
import BindMenu from './BindMenu';
 
export default {
 title: 'BindMenu',
 component: BindMenu
};
 
const Template = (args) => <BindMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
