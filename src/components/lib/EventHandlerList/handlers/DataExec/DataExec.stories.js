import React from 'react';
import DataExec from './DataExec';
 
export default {
 title: 'DataExec',
 component: DataExec
};
 
const Template = (args) => <DataExec {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
