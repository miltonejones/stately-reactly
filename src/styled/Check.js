
import React from 'react'; 
import TinyButton from './TinyButton';

const Check = ({ on })  => <TinyButton icon={on ? "CheckCircle" : "CheckCircleOutline"}/>

export default Check;
