import React from 'react';
import SettingsInput from './SettingsInput';
 
export default {
 title: 'SettingsInput',
 component: SettingsInput
};
 
const Template = (args) => <SettingsInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
