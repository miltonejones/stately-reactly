import React from 'react';
import { styled, Box, Avatar, List, ListItemButton ,
  // ListSubheader,
  ListItemText,
  Stack,
  ListItemSecondaryAction, ListItemIcon } from '@mui/material'; 
  import TextIcon from '../../../styled/TextIcon';
 
// const Layout = styled(Box)(({ theme }) => ({
//  margin: theme.spacing(0)
// }));

const ListItem = styled(ListItemButton)(( {active, theme, selectedColor = 'primary' } ) => ({
  fontWeight: active ? 500 : 400,
  color: active ? 'white' :'#222',
  backgroundColor: !active ? 'white' : (theme.palette[selectedColor]||theme.palette.primary).main
}))

const createRows = items => {
  try {
    return !!items  && typeof items  === 'string' 
    ? JSON.parse(items )
    : items ;
  } catch (ex) {
    return false;
  }
}

const ReactlyList = (props) => {
  const { onItemClick, onSecondaryClick } = props;

  const dataRows = createRows(props.items)

  const sortRows = dataRows; //!props.autoSort ? dataRows : dataRows.sort((a,b) => a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1);

  // const header = !props.heading ? null : <ListSubheader>{props.heading}</ListSubheader>

  if (!sortRows) {
    return <em>No rows<pre>
    {/* {props.ComponentName} */}
    {JSON.stringify(props, 0, 2)}
  </pre></em>
  }

  if (!Array.isArray(sortRows)) {
    return <pre>
      {/* {props.ComponentName} */}
      {JSON.stringify(props, 0, 2)}
    </pre>
  }

 return (
   <List {...props}>
     {sortRows?.map((item, i) => {

      return <ListItem key={i}  active={i === Number(props.selectedIndex)} >

          
        {!!(item.avatar||props.default_image) && <Avatar sx={{mr: 1}} src={item.avatar || props.default_image} alt={item.text} />}

        {!!item.startIcon &&   <ListItemIcon >
                <TextIcon icon={item.startIcon} />
              </ListItemIcon>}


          <ListItemText  onClick={e => {
            onItemClick && onItemClick(e, {
              ...item,
              row: i
            })
          }} 
          primary={item.text} 
          secondary={!item.tertiary ? <>{item.subtext}</> : <Stack>
            <Box>{item.subtext}</Box>
            <Box>{item.tertiary}</Box>
          </Stack>}
          />

        {!!item.endIcon && <ListItemSecondaryAction  onClick={e => {
            onSecondaryClick && onSecondaryClick(e, {
              ...item,
              row: i
            })
          }} >
          <TextIcon icon={item.endIcon} />
        </ListItemSecondaryAction>}


      </ListItem>

     })}
     {/* ReactlyList Component
     <pre>
      {JSON.stringify(sortRows,0,2)}
     </pre> */}
   </List>
 );
}
ReactlyList.defaultProps = {};
export default ReactlyList;
