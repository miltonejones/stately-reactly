import React from 'react';
import AppSettings from './AppSettings';
 
export default {
 title: 'AppSettings',
 component: AppSettings
};
 
const Template = (args) => <AppSettings {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
