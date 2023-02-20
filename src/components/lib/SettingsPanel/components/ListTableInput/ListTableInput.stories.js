import React from 'react';
import ListTableInput from './ListTableInput';
 
export default {
 title: 'ListTableInput',
 component: ListTableInput
};
 
const Template = (args) => <ListTableInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
