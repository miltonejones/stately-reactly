import React from 'react';
import { styled, Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import {a11yDark, atomDark, base16AteliersulphurpoolLight, cb, coldarkCold, coldarkDark, coyWithoutShadows, coy, 
//   darcula, dark, dracula, duotoneDark, duotoneEarth, duotoneForest, duotoneLight, duotoneSea, duotoneSpace, funky, ghcolors, gruvboxDark, 
//   gruvboxLight, holiTheme, hopscotch, lucario, materialDark, materialLight, materialOceanic, nightOwl, nord, okaidia, oneDark, oneLight, 
//   pojoaque, prism, shadesOfPurple, solarizedDarkAtom, solarizedlight, synthwave84, tomorrow, twilight, vs, vscDarkPlus, xonokai, zTouch} from 'react-syntax-highlighter/dist/esm/styles/prism'

  import { coyWithoutShadows } from 'react-syntax-highlighter/dist/esm/styles/prism'
  
  

const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const CodePane = ({ value, onChange, maxwidth="fit-content", minHeight = 400, maxHeight = 400, ...props}) => {
  const [bs, setBS] = React.useState(value); 
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const theme = coyWithoutShadows;
  const handleChange = event => {
    setShowLineNumbers(true) 
    if (!bs || value === bs) return; 
    onChange('');  
    setTimeout(() => onChange(bs), 9) 
  }
 return (
   <Layout data-testid="test-for-CodePane">
  
  {!!value && ( 
    <SyntaxHighlighter 
      {...props} 
      contentEditable 
      language="javascript"  
      onKeyUp={e => setBS(e.target.innerText)} 
      style={theme}
      onFocus={() =>setShowLineNumbers(false)}
      onBlur={handleChange}
      showLineNumbers={showLineNumbers}  
      customStyle={{  minHeight, maxHeight, maxwidth, overflow: 'auto', fontSize: '0.95em'  }}> 
      {value}
    </SyntaxHighlighter>)}


   </Layout>
 );
}
CodePane.defaultProps = {};
export default CodePane;
