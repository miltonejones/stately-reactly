import React from 'react';
import CodePane from './CodePane';
 
export default {
 title: 'CodePane',
 component: CodePane
};
 
const Template = (args) => <CodePane {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
