import React from 'react';
import ModalOpen from './ModalOpen';
 
export default {
 title: 'ModalOpen',
 component: ModalOpen
};
 
const Template = (args) => <ModalOpen {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
