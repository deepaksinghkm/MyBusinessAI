import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

const menuItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, path: "/" },
  { text: "Company", icon: <CategoryRoundedIcon />, path: "/company" },
  { text: "Products", icon: <Inventory2RoundedIcon />, path: "/products" },
  { text: "Inventory", icon: <WarehouseRoundedIcon />, path: "/inventory" },
  { text: "Reports", icon: <AssessmentRoundedIcon />, path: "/reports" },
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "Users", icon: <PeopleRoundedIcon />, path: "/users" },
];

export default function Sidebar() {
  return (
    <Drawer variant="permanent">
      <List sx={{ width: 240 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
