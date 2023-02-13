import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, AppBar, 
  Avatar, AvatarGroup, Badge, BottomNavigation, BottomNavigationAction, Box, Breadcrumbs, 
  Button, Card, Checkbox, Chip, CircularProgress, Collapse, Dialog, Divider, 
  Drawer, Fab, ImageList, ImageListItem, ImageListItemBar, 
  LinearProgress, Link, List, Menu, Pagination, Paper, Popover,   Radio, 
  RadioGroup, Rating, Select, Skeleton, Slider, Snackbar, SnackbarContent, SpeedDial, 
  SpeedDialAction, SpeedDialIcon, Switch, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Tooltip, 
  Typography } from "@mui/material"; 
  import Marquee from "react-fast-marquee";
  import { Masonry } from '@mui/lab';   
import ReactlyIconButton from "./ReactlyIconButton/ReactlyIconButton";  
  
const ReactlySpacer = () => <Box sx={{ flexGrow: 1}} />;

 

export const LibraryComponents = {  
  Alert,  AvatarGroup, Badge, BottomNavigation, BottomNavigationAction, 
  Dialog, Divider, Drawer, Fab, 
  
  IconButton: ReactlyIconButton, 
  ImageList, ImageListItem, ImageListItemBar, 
  Switch, Tab, Tabs, Textbox: TextField, ToggleButton, ToggleButtons: ToggleButtonGroup, Tooltip, 
  LinearProgress, Link, List, Marquee, Masonry, Menu, Pagination, Paper, Popover,  Radio, RadioGroup, Rating, 
  Select, Skeleton, Slider, Snackbar, SnackbarContent, Spacer: ReactlySpacer, SpeedDial, SpeedDialAction, SpeedDialIcon, 
  Box, Breadcrumbs, Button, Card, Checkbox, Chip, CircularProgress, Collapse, 
  Accordion, AccordionActions, AccordionDetails, AccordionSummary, 
  AppBar, Avatar,Typography
};