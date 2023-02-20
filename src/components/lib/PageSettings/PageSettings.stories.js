import React from 'react';
import PageSettings from './PageSettings';
 
export default {
 title: 'PageSettings',
 component: PageSettings
};
 
const Template = (args) => <PageSettings {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
