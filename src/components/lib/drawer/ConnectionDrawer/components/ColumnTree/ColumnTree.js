import React from 'react';
import { Divider } from '@mui/material';
import { Check, Nowrap } from '../../../../../../styled';
  

 


const ColumnTree = ({ nodes, resource, onAddProp, indent = 0, path = []}) => {
  if (!nodes || !resource) {
    return <i />
  } 

  const dot = path.join('/');
  const fields = resource.columns;

    if (Array.isArray(nodes)) {
      return <> 
      <ColumnTree resource={resource} fields={fields} onAddProp={onAddProp}  
          path={path} nodes={nodes[0]} indent={indent} /> 
      <Divider />
    </>
    }




  return <>  
      {Object.keys(nodes).map(node => { 

        if (Array.isArray(nodes[node])) {
          return <>
            <Nowrap small hover onClick={() => {
              onAddProp(node, dot);
            }} sx={{ml: indent}} key={node}
            > <Check on={fields?.indexOf(node) > -1 || node === resource.node} /> {node}</Nowrap>
            <ColumnTree resource={resource} fields={fields} onAddProp={onAddProp}  
                path={path.concat(node)} nodes={nodes[node][0]} indent={indent + 4} /> 
            <Divider />
          </>
        }

        return <><Nowrap small hover onClick={() => { 
              onAddProp(node, dot);
            }}  sx={{ml: indent}} key={node}
          > <Check on={fields?.indexOf(node) > -1 || node === resource.node} /> {node} </Nowrap> 

            {typeof nodes[node] === 'object' &&  <ColumnTree resource={resource} fields={fields} onAddProp={onAddProp}  
                path={path.concat(node)} nodes={nodes[node]} indent={indent + 4} /> }

        </>
      })}
  </>

}
 

 
ColumnTree.defaultProps = {};
export default ColumnTree;
