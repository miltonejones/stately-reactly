import React from 'react'; 
 
const ReactlyImage = (props) => {
 return (
  // eslint-disable-next-line
  <img src="about:blank" alt="reactly image" {...props} /> 
 );
}
ReactlyImage.defaultProps = {};
export default ReactlyImage;
