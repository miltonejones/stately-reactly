import React from 'react';
import ComponentTree from './ComponentTree';
 
export default {
 title: 'ComponentTree',
 component: ComponentTree
};
 
const Template = (args) => <ComponentTree {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
