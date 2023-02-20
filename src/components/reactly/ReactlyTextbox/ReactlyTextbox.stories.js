import React from 'react';
import ReactlyTextbox from './ReactlyTextbox';
 
export default {
 title: 'ReactlyTextbox',
 component: ReactlyTextbox
};
 
const Template = (args) => <ReactlyTextbox {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
