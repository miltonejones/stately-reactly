import React from 'react';
import ColumnList from './ColumnList';
 
export default {
 title: 'ColumnList',
 component: ColumnList
};
 
const Template = (args) => <ColumnList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
