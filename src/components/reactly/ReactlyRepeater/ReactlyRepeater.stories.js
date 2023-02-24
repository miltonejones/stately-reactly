import React from 'react';
import ReactlyRepeater from './ReactlyRepeater';
 
export default {
 title: 'ReactlyRepeater',
 component: ReactlyRepeater
};
 
const Template = (args) => <ReactlyRepeater {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
