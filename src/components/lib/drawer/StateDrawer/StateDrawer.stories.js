import React from 'react';
import StateDrawer from './StateDrawer';
 
export default {
 title: 'StateDrawer',
 component: StateDrawer
};
 
const Template = (args) => <StateDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
