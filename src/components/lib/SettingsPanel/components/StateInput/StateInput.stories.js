import React from 'react';
import StateInput from './StateInput';
 
export default {
 title: 'StateInput',
 component: StateInput
};
 
const Template = (args) => <StateInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
