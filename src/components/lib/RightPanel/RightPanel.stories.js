import React from 'react';
import RightPanel from './RightPanel';
 
export default {
 title: 'RightPanel',
 component: RightPanel
};
 
const Template = (args) => <RightPanel {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
