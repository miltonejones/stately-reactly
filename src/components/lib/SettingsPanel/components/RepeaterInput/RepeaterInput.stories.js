import React from 'react';
import RepeaterInput from './RepeaterInput';
 
export default {
 title: 'RepeaterInput',
 component: RepeaterInput
};
 
const Template = (args) => <RepeaterInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
