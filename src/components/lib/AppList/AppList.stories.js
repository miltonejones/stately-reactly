import React from 'react';
import AppList from './AppList';
 
export default {
 title: 'AppList',
 component: AppList
};
 
const Template = (args) => <AppList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
