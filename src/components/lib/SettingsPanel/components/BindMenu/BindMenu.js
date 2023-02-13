import React from 'react'; 
import { SimpleMenu } from '../../../..';
import { Edit, MoreVert, AddLink, Code } from "@mui/icons-material"; 
import { EditorStateContext } from '../../../../../context';
  
 
const BindMenu = ({ offset, label }) => {
  const { handleAdd, handleBind } = React.useContext(EditorStateContext);
  const menuItems = [
    {
      id: 'none',
      label: "Text",
      icon: <Edit />
    },
    {
      id: 'script',
      label: "Client script",
      icon: <Code />,
      action: (ok) =>  handleAdd(label)
    },
    {
      id: 'state',
      label: "State Variable",
      icon: <AddLink />,
      action: () =>  handleBind(label)
    },
    ];

  const onChange = value => {
    if (!value) return;
    const { action } = menuItems.find(f => f.id === value);
    !!action && action();
  }
  return <SimpleMenu onChange={onChange} options={menuItems}>
    <MoreVert sx={{mr: offset ? 3 : 0}} /> 
  </SimpleMenu>
}


BindMenu.defaultProps = {};
export default BindMenu;
