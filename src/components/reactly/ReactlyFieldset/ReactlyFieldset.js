import React from 'react';
 
const ReactlyFieldset = ({children, ...props}) => {
 return (
  <fieldset {...props}>
    <legend>{props.Label}</legend>
    {children}
  </fieldset>
 );
}
ReactlyFieldset.defaultProps = {};
export default ReactlyFieldset;
