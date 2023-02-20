import React from 'react';
import MachineDrawer from './MachineDrawer';
 
export default {
 title: 'MachineDrawer',
 component: MachineDrawer
};
 
const Template = (args) => <MachineDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
