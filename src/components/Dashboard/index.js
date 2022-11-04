import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import "./index.css";
import { TabContext, TabPanel } from "@mui/lab";
const Dashboard = () => {
  const [value, setValue] = React.useState("All");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box className="notification_section ">
        <Box className="notification_tabs_root d-block">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value="Dashboard1" label="Dashboard1" />
            <Tab value="Dashboard2" label="Dashboard1" />
          </Tabs>
        </Box>
        <Box className="">
          <div className="bg-body p-4"></div>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
