import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Badge } from "@mui/material";
import SearchBar from "./SearchBar";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  nameOne,
  nameTwo,
  listUser,
  createUser,
  badgeCounts,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span>{nameOne}</span>
                {badgeCounts?.news > 0 && (
                  <Badge color="error" badgeContent={badgeCounts.news} />
                )}
              </Box>
            }
            {...a11yProps(0)}
            sx={{ fontSize: "15px" }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span>{nameTwo}</span>
                {badgeCounts?.assign > 0 && (
                  <Badge color="primary" badgeContent={badgeCounts.assign} />
                )}
              </Box>
            }
            {...a11yProps(1)}
            sx={{ fontSize: "15px" }}
          />
        </Tabs>
      </Box>
      {/* <div className="flex justify-between items-center mt-4">
            <p>test</p>
      <SearchBar/>
      </div> */}
      <CustomTabPanel value={value} index={0}>
        {listUser}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {createUser}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
