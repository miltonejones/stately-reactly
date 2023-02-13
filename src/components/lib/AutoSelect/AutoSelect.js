import React from 'react';
import { styled, Autocomplete, TextField, Box } from '@mui/material';
import throttle from 'lodash/throttle'; 
import { useAutoselect } from '../../../machines';
 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const AutoSelect = (props) => {
  const { onValueSelected, valueChanged, type } = props;
  const auto = useAutoselect(
    {
      valueChanged, 
      valueSelected: onValueSelected
    } 
  );
 
  const [inputValue, setInputValue] = React.useState(); 
  const { options = [] } =  auto;

  const renderOption = (props, option) => { 
    const Icon = option.icon; 
    return <Box {...props}>{!!Icon && <Icon />}{option.name}</Box> 
  }

  const getOptionLabel = (option) => {  
    return option.name || "--none--";
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        auto.send({
          type: 'CHANGE',
          ...request
        }) 
      }, 1000),
    [auto],
  );
 
  React.useEffect(() => { 
    // let active = true;
    if (!inputValue || inputValue === '' || auto.state.context.change === inputValue) { 
      return undefined;
    } 

    if(auto.state.value !== 'idle') return;

    console.log(auto.state.context.change, inputValue)

    fetch({ value: inputValue }, () => {

    }); 
   

    // return () => {
    //   active = false;
    // };

  }, [fetch, inputValue, auto.state.context.change , auto.state.value ]);
 


//  return JSON.stringify(options);
 return (
   <Layout data-testid="test-for-AutoSelect"> 
   {/* {JSON.stringify(auto.state.value)} */}
   {/* <TextField 
    size="small"
    value={props?.value?.name} 
    /> */}
    {/* [[{JSON.stringify(auto.state.context.change)}]] */}
    <Autocomplete
          sx={{ width: '100%', minWidth: 300  }} 
          isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
          renderOption={renderOption}
          getOptionLabel={getOptionLabel} 
          options={options}
          value={props.value}
          onChange={(event, newValue) => {
            onValueSelected && onValueSelected(newValue);
            // setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => <TextField fullWidth label={`Choose ${type}`} {...params}  size={'small'} />
          }
      />
      {/* <pre>
        {JSON.stringify(options,0,2)}
      </pre> */}
   </Layout>
 );
}
AutoSelect.defaultProps = {};
export default AutoSelect;
