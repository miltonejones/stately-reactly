
import React from 'react';
// import { styled, Box } from '@mui/material';
import { hilite } from '../util/hilite';

const Json = ({ children, css }) =>  <pre>
  <div
  dangerouslySetInnerHTML={{__html: hilite(children, css)}}
/>
</pre>


export default Json;
