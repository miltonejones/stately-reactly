import React from 'react';
import ReactlyAudioPlayer from './ReactlyAudioPlayer';
 
export default {
 title: 'ReactlyAudioPlayer',
 component: ReactlyAudioPlayer
};
 
const Template = (args) => <ReactlyAudioPlayer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
