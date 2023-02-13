import React from 'react';
import AppDetail from './AppDetail';
 
export default {
 title: 'AppDetail',
 component: AppDetail
};
 
const Template = (args) => <AppDetail {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
