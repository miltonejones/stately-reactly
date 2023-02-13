import React from 'react';
import OpenLink from './OpenLink';
 
export default {
 title: 'OpenLink',
 component: OpenLink
};
 
const Template = (args) => <OpenLink {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
