import React from 'react';
import ReactlyList from './ReactlyList';
 
export default {
 title: 'ReactlyList',
 component: ReactlyList
};
 
const Template = (args) => <ReactlyList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
