import React from 'react';
import SettingsPanel from './SettingsPanel';
 
export default {
 title: 'SettingsPanel',
 component: SettingsPanel
};
 
const Template = (args) => <SettingsPanel {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
