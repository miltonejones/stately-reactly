import React from 'react';
import ResourceForm from './ResourceForm';
 
export default {
 title: 'ResourceForm',
 component: ResourceForm
};
 
const Template = (args) => <ResourceForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
