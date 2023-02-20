import React from 'react';
import ReactlyDrawer from './ReactlyDrawer';
 
export default {
 title: 'ReactlyDrawer',
 component: ReactlyDrawer
};
 
const Template = (args) => <ReactlyDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
