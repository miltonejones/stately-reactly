import React from 'react';
import ScriptSelect from './ScriptSelect';
 
export default {
 title: 'ScriptSelect',
 component: ScriptSelect
};
 
const Template = (args) => <ScriptSelect {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
