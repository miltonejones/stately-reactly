
import React from 'react';
import { styled, Chip, Box } from '@mui/material';
import { findMatches } from '../util/findMatches';
import { TextIcon, Spacer } from '../styled';

const Chipbox = styled('fieldset')(({ theme }) => ({
  gap: theme.spacing(0.5),
  alignItems: 'center',
  display: 'flex',
  border: `solid 1px ${theme.palette.grey[400]}`,
  height: `1.4375em`,
  padding: theme.spacing(1.5, 4, 2.5, 1),
  paddingRight: 0,
  borderRadius: theme.spacing(0.5)
}));

const Label = styled('legend')(({ theme }) => ({
  fontSize: '0.8rem'
}));

const ChipTextField = ({ value, endIcon, onChange }) => {
  const [bs, setBS] = React.useState(value); 
  const [focus, setFocus] = React.useState(false);
  const bracketTest = /\{([^}]+)\}/g;
  const parms = findMatches(bracketTest, value);
  const parts = value?.split(bracketTest);

  const fixed = parts.map((f) => {
    const match = parms.find((e) => e[1] === f);
    if (match) {
      return (
        <Chip size="small" variant="outlined" color="primary"
          onDelete={console.log}
          deleteIcon={<TextIcon icon="Close" />}
          label={f}>
          {f}
        </Chip>
      );
    }
    return <Box>{f}</Box>;
  });

  return (
    <>
      <Chipbox
        contentEditable
        onFocus={() => setFocus(true)}
        onBlur={() => {
          onChange({target: {value: bs}})
          setFocus(false);
          setBS("");
        }}
        onKeyUp={(e) => setBS(e.target.innerText)}
      >
        <Label>Label</Label>
        {focus ? value : fixed}
        <Spacer />
        <Box sx={{mr: 3}}>{endIcon}</Box>
      </Chipbox>
      {/* {!!parms && <pre>{JSON.stringify(parms, 0, 2)}</pre>}
      {!!parts && <pre>{JSON.stringify(parts, 0, 2)}</pre>} */}
    </>
  );
};


export default ChipTextField;
