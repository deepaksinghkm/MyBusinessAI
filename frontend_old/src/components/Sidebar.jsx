import { Link, useLocation } from "react-router-dom";

import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BrandingWatermarkRoundedIcon from "@mui/icons-material/BrandingWatermarkRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

const drawerWidth = 240;

const menus = [
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
    text: "Unit",
    icon: <SquareFootRoundedIcon />,
    path: "/units",
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
        {menus.map((menu) => (
          <ListItemButton
            key={menu.path}
            component={Link}
            to={menu.path}
            selected={location.pathname === menu.path}
          >
            <ListItemIcon>
              {menu.icon}
            </ListItemIcon>

            <ListItemText
              primary={menu.text}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}