import React from 'react';
import ReactlyButton from './ReactlyButton';
 
export default {
 title: 'ReactlyButton',
 component: ReactlyButton
};
 
const Template = (args) => <ReactlyButton {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
