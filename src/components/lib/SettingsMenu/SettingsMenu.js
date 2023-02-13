import React from "react";
import { Drawer, Box, Typography } from "@mui/material";
import { Diagnostics } from "../..";
import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";

const SettingsMenu = ({ value, onChange }) => {
  const menu = useMenu(onChange);
  const machines = {
    reactly_machine: "Application",
    settings_menu: "This Menu",
  };

  return (
    <>
      <i onClick={menu.handleClick} className="fa-solid fa-gear"></i>

      <Drawer
        anchor="right"
        open={menu.state.matches("opened")}
        onClose={menu.handleClose()}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Select a state machine to view its status.</Typography>

          {Object.keys(machines).map((mac) => (
            <Flex
              key={mac}
              onClick={menu.handleClose(mac)}
              sx={{ width: 300, p: 1 }}
            >
              <Nowrap bold={value === mac}> {machines[mac]} </Nowrap>
            </Flex>
          ))}
        </Box>
      </Drawer>
      <Diagnostics {...menu.diagnosticProps} />
    </>
  );
};

SettingsMenu.defaultProps = {};
export default SettingsMenu;
