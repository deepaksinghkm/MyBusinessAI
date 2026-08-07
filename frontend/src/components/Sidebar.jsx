import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BrandingWatermarkRoundedIcon from "@mui/icons-material/BrandingWatermarkRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardRoundedIcon />,
    path: "/",
  },
  {
    text: "Company",
    icon: <BusinessRoundedIcon />,
    path: "/company",
  },
  {
    text: "Brand",
    icon: <BrandingWatermarkRoundedIcon />,
    path: "/brands",
  },
  {
    text: "Category",
    icon: <CategoryRoundedIcon />,
    path: "/categories",
  },
  {
    text: "Color",
    icon: <PaletteRoundedIcon />,
    path: "/colors",
  },
  {
    text: "Size",
    icon: <StraightenRoundedIcon />,
    path: "/sizes",
  },
  {
    text: "Products",
    icon: <Inventory2RoundedIcon />,
    path: "/products",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}