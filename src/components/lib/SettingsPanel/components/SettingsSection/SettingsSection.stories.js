import React from 'react';
import SettingsSection from './SettingsSection';
 
export default {
 title: 'SettingsSection',
 component: SettingsSection
};
 
const Template = (args) => <SettingsSection {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
