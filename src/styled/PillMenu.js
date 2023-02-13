
import React from 'react';
import { Tooltip } from '@mui/material';
import { Flex, Pill } from '.'; 

const PillMenu = ({ options, value, image, onChange }) => {
  if (!options) {
    return <i />
  }
  const compare = (src, dest) => {
    if (typeof src === 'string') {
      return !!dest && dest === src
    }
    return dest === src;
  }
  return <Flex sx={{m: t => t.spacing(.25, 0)}}>
    {options.map(option => <Pill 
      onClick={() => onChange && onChange(option.hasOwnProperty("value") ? option.value : option)} 
      bold={ compare(value, option.value)  || compare(value, option) }
      >
      {image 
        ? <Tooltip title={option}><img alt={option} src={`/icon/${option}.png`} /></Tooltip>
        : <>{option.label || option}</>}

        
      </Pill>)}
  </Flex>
}

export default PillMenu;
