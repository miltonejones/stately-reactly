import React from 'react';
import { Card, Typography, styled } from '@mui/material';
import { useCarousel } from '../../../machines';
  
 
const ReactlyCarousel = ({ images }) => {
  const context = useCarousel(images);
  // const { send } = context;

  const { running, first, second } = context;
  if (!first) return <>No images to display [{JSON.stringify(context.images.length)}]</>;
  return (
    <Carousel>
    <Slide onClick={first.onClick} first src={first.src} moving={running} />
    <Slide src={second.src} moving={running} />
    <Caption moving={running}>
      <Text variant="h6">{first.text}</Text>
      <Text variant="body2">{first.subtext}</Text>
    </Caption>
  </Carousel>
  );
}



const Text = styled(Typography)(() => ({
  color: 'white',
  mixBlendMode: 'difference',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '30vw',
  width: '100%',
  lineHeight: 1.1,
}));

const Carousel = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '35vh',
  overflow: 'hidden',
  marginTop: theme.spacing(1),
  borderRadius: 15,
  cursor: 'pointer',
}));

const Slide = styled('img')(({ first, moving }) => {
  const transition = moving ? 'left 0.4s linear' : 'none';
  const firstLeft = moving ? '-100%' : 0;
  const secondLeft = moving ? 0 : '100%';
  const obj = {
    width: '100%',
    position: ' absolute',
    top: '-70%',
    transition,
    left: first ? firstLeft : secondLeft,
  };
  return obj;
});

const Caption = styled(Card)(({ theme, moving }) => ({
  position: 'absolute',
  bottom: 40,
  left: 20,
  minWidth: 300,
  opacity: moving ? 0 : 0.7,
  transition: 'opacity 0.4s linear',
  backgroundColor: theme.palette.common.black,
  padding: theme.spacing(1, 2),
}));

ReactlyCarousel.defaultProps = {};
export default ReactlyCarousel;
