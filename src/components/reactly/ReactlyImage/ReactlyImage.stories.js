import React from 'react';
import ReactlyImage from './ReactlyImage';
 
export default {
 title: 'ReactlyImage',
 component: ReactlyImage
};
 
const Template = (args) => <ReactlyImage {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
