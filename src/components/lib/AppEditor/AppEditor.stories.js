import React from 'react';
import AppEditor from './AppEditor';
 
export default {
 title: 'AppEditor',
 component: AppEditor
};
 
const Template = (args) => <AppEditor {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
