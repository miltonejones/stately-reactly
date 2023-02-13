
import React from 'react';
import { Box } from '@mui/material';
import { AutoSelect } from '../components';
 import * as Icons from "@mui/icons-material";

const IconSelect =  ({ onChange, value }) => {
  return <Box>

     <AutoSelect 
        type="icon"
        value={value}
        onValueSelected={value => onChange && onChange(value)}

        valueChanged={ async(context, event) => {

          const prop = context.change || value;

          const matches = !(prop && prop.length > 2) ? [] : Object.keys(Icons)
            .filter(key => key.toLowerCase().indexOf(prop.toString().toLowerCase()) > -1) 
          return matches.map(name => ({
            name,
            icon: Icons[name],
            ID: name
          })) ;

      }}
     />
  </Box>
}

export default IconSelect;
