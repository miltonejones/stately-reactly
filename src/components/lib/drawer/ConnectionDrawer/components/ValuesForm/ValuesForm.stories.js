import React from 'react';
import ValuesForm from './ValuesForm';
 
export default {
 title: 'ValuesForm',
 component: ValuesForm
};
 
const Template = (args) => <ValuesForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
