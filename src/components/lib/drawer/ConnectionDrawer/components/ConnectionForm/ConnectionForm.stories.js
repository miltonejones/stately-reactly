import React from 'react';
import ConnectionForm from './ConnectionForm';
 
export default {
 title: 'ConnectionForm',
 component: ConnectionForm
};
 
const Template = (args) => <ConnectionForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
