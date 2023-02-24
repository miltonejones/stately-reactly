import React from 'react';
import ReactlyInfoCard from './ReactlyInfoCard';
 
export default {
 title: 'ReactlyInfoCard',
 component: ReactlyInfoCard
};
 
const Template = (args) => <ReactlyInfoCard {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
