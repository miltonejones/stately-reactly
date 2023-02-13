import React from 'react';
import StateSelect from './StateSelect';
 
export default {
 title: 'StateSelect',
 component: StateSelect
};
 
const Template = (args) => <StateSelect {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
