import React from 'react';
import PageTreeView from './PageTreeView';
 
export default {
 title: 'PageTreeView',
 component: PageTreeView
};
 
const Template = (args) => <PageTreeView {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
