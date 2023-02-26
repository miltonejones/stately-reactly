import React from 'react';
import { Table, TableHead, TableRow, TableCell, 
  TableBody, Box, styled, Link, Typography } from '@mui/material';   
import { Flex, TextIcon } from '../../../styled';
import { truncate } from '../../../util/truncate';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
 
const ReactlyDatagrid = (props) => {
  const { onHeadClick, onCellClick, dataRows, resource, onRowClick, columnNames, columnMap, typeMap } = props;

  const selectionCompare = (source, comparedTo) => {
    if (props.multiple && Array.isArray(source)) {
      return source?.indexOf(comparedTo) > -1
    }
    return source?.toString() === comparedTo?.toString()
  }

  const isSelected = (row, i) => {
    try {
      if (props.use_id) {
        return selectionCompare(resource.records[i][props.selectedColumn], props.selectedID)
      }
      return selectionCompare(props.selectedIndex, i);
    } catch (e) {
      return false;
    }
  }

  const selected_indicator_col = props.selected_indicator_col || 0;

  const getRow = index => {
    const source = resource.records || resource;
    return source[index]
  }

  const getRowProp = (index, prop) => {
    const row = getRow(index);
    if (row) {
      return row[prop];
    }
    return index + '?'
  }

  return (
    <Layout data-testid="test-for-ReactlyDatagrid">
<Table {...props}>
    {!!columnMap && <TableHead>
        <TableRow>
          {columnMap.map( (t, i) => <TableCell 
            onClick={e => {

              onHeadClick && onHeadClick(e, { 
                value: t,
                cell: i,  
              });

            }}
            key={t}><Typography active link={!!onHeadClick}>{columnNames[t]}</Typography></TableCell>)} 
        </TableRow>
      </TableHead>
    }


   {!!dataRows &&   (
      <TableBody>
        {props.dataRows.map((row, i) => (
          <TableRow key={i}  >
            {Object.values(row).map((cell, k) => <Cell 
              columnMap={columnMap} 
              typeMap={typeMap}
              displayKey={columnMap?.[k]}
              color={props['row-color']}
              selected={isSelected(row, i)}
              onClick={e => {
                
                onCellClick && onCellClick(e, {
                  ID: !props.selectedColumn ? i : getRowProp(i, props.selectedColumn),
                  row: i,
                  cell: k,
                  column: columnMap[k],
                  // ...resource,
                  ...getRow(i)
                });


                onRowClick && onRowClick(e, {
                  ID: !props.selectedColumn ? i : getRowProp(i, props.selectedColumn),
                  row: i, 
                  // ...resource,
                  ...getRow(i)
                })

              }}
              key={k} component="th" scope="row">
              <Flex wrap={props.nowrap ? "nowrap" : "wrap"}>


                {k === selected_indicator_col && !!props.rowIcon && !isSelected(row, i) && <TextIcon icon={props.rowIcon} />}
                {k === selected_indicator_col && !!props.selectedRowIcon && isSelected(row, i) && <TextIcon icon={props.selectedRowIcon} />}

                <CellContent value={cell} 
                   color={props['row-color']}
                   selected={isSelected(row, i)}
                   columnMap={columnMap} 
                   typeMap={typeMap}
                   displayKey={columnMap?.[k]}
                   >
                   {truncate(cell, props.truncate)}
                </CellContent>
             
                
                </Flex>
            </Cell> )}
            
          </TableRow>
        ))}
      </TableBody>)}

        </Table>


      ReactlyDatagrid Component
      <pre>
      {JSON.stringify(props,0,2)}
      </pre>
    </Layout>
  );
}


const CellContent = ({ columnMap, typeMap, displayKey, value, selected,  children, ...props}) => {


  // const [content] = React.useState(children)

  const displayType = typeMap?.[displayKey];
  // const transformer = displayType?.settings?.transform;

  // const { executeScript } = useRunScript();

  // React.useEffect(() => {
  //   if (!transformer) return;

  //   (async() => {
  //     const res = await executeScript(transformer, children);
  //     !!res && setContent(res);
  //   })()

  // }, [transformer])

  // const content = children; //!transformer ? children : executeScript(transformer, { data: children });

  // !!transformer && console.log ({ content: executeScript(transformer, { data: children })   });


  // const { image } = useImageLoader(value, displayType?.settings?.default_image)

  


  if (!(!!typeMap && !!columnMap && !!typeMap[ displayKey ])) {
    return <>{children}</>
  } 

  if (displayType?.type === 'Text') {
    return <Typography variant={displayType.settings.Variant || 'body2'}>{children}</Typography> 
  }
 
  if (displayType?.type === 'Link') {
    return <Linked { ...props} selected={selected} sx={{ cursor: 'pointer'}} {...displayType.settings}>
      <Typography variant={displayType.settings.Variant || 'body2'}>{children}</Typography>
    </Linked>
  }
 

  if (displayType?.type === 'Image') {
    return <img src={value} alt={value} style={{
      width: displayType.settings.Width,
      height: displayType.settings.Height,
      borderRadius: displayType.settings.Radius
    }}/>
  }

  if (displayType?.type === 'Icon') {
    return <TextIcon icon={children} /> 
  }

  return <>{children}</>
}

const colorize = ({ selected, theme, color = 'primary', columnMap, typeMap, displayKey }) => {
  const displayType = typeMap?.[displayKey];

  const obj =  {
    fontWeight: selected ? 500 : 400,
    color: selected ? 'white' :'#222',
    backgroundColor: !selected ? 'white' : (theme.palette[color]||theme.palette.primary).main
  }


  if (displayType?.type === 'Image') {
    Object.assign(obj, {
      width: displayType.settings.Width
    }) 
  }


  return obj;

};



const Linked = styled(Link)(colorize)
const Cell = styled(TableCell)(colorize)
 


ReactlyDatagrid.defaultProps = {};
export default ReactlyDatagrid;
