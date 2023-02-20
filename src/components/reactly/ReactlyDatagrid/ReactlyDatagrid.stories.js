import React from 'react';
import ReactlyDatagrid from './ReactlyDatagrid';
 
export default {
 title: 'ReactlyDatagrid',
 component: ReactlyDatagrid
};
 
const Template = (args) => <ReactlyDatagrid {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
