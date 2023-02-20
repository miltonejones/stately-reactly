import React from 'react';
import ReactlyCarousel from './ReactlyCarousel';
 
export default {
 title: 'ReactlyCarousel',
 component: ReactlyCarousel
};
 
const Template = (args) => <ReactlyCarousel {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
