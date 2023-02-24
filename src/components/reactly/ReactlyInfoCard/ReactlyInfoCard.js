import React from 'react';
import { Card, Typography, CardMedia } from '@mui/material';
import { RepeaterContext } from '../../../context';
import { truncate } from '../../../util/truncate';
  
 
const ReactlyInfoCard = ({ID, onCardClick, ...props}) => {
  const context = React.useContext(RepeaterContext);

  const args = !context.columnNames 
    ? {}
    : Object.keys(context.columnNames)
      .reduce((out, key) => {
        const { componentID, SettingName } = context.columnNames[key];
        if (ID === componentID) {
          out[SettingName] = context[key]
        }

        return out;
      }, {})

 return (
   <Card data-testid="test-for-ReactlyInfoCard">
     {/* ReactlyInfoCard Component */}
     {/* <pre>{JSON.stringify(props,0,2)}</pre> */}

     {(!!args.image || props.use_image) && <CardMedia 
      onClick={e => {
        onCardClick && onCardClick(e, context)
      }}
        component="img"
        height={props.image_height || 200}
        image={args.image} 
        alt={args.label}
      />}


<Typography variant="body2">
     {truncate(args.label, props.truncate)}
</Typography>
   </Card>
 );
}
ReactlyInfoCard.defaultProps = {};
export default ReactlyInfoCard;
