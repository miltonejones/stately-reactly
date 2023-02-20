import React from 'react';
import ColumnTree from './ColumnTree';
 
export default {
 title: 'ColumnTree',
 component: ColumnTree
};
 
const Template = (args) => <ColumnTree {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
