import React from 'react';
import ScriptDrawer from './ScriptDrawer';
 
export default {
 title: 'ScriptDrawer',
 component: ScriptDrawer
};
 
const Template = (args) => <ScriptDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
