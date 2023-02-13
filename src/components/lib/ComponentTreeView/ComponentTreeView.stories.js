import React from 'react';
import ComponentTreeView from './ComponentTreeView';
 
export default {
 title: 'ComponentTreeView',
 component: ComponentTreeView
};
 
const Template = (args) => <ComponentTreeView {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
