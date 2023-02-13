import React from 'react';
import ScriptModal from './ScriptModal';
 
export default {
 title: 'ScriptModal',
 component: ScriptModal
};
 
const Template = (args) => <ScriptModal {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
