import React from 'react';
import SettingsMenu from './SettingsMenu';
 
export default {
 title: 'SettingsMenu',
 component: SettingsMenu
};
 
const Template = (args) => <SettingsMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
