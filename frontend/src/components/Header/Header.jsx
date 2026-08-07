import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import PaletteIcon from "@mui/icons-material/Palette";
import StraightenIcon from "@mui/icons-material/Straighten";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useWindowManager } from "../../context/WindowManager";

export default function Header() {
  const { openWindow } = useWindowManager();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={2}
      sx={{
        height: 60,
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mr: 4,
          }}
        >
          MyBusinessAI ERP
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexGrow: 1,
          }}
        >

          <Tooltip title="Dashboard">
            <IconButton
              onClick={() => openWindow("dashboard")}
            >
              <DashboardIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Company">
            <IconButton
              onClick={() => openWindow("company")}
            >
              <BusinessIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Brand">
            <IconButton
              onClick={() => openWindow("brand")}
            >
              <BrandingWatermarkIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Category">
            <IconButton
              onClick={() => openWindow("category")}
            >
              <CategoryIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Color">
            <IconButton
              onClick={() => openWindow("color")}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Size">
            <IconButton
              onClick={() => openWindow("size")}
            >
              <StraightenIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Products">
            <IconButton
              onClick={() => openWindow("product")}
            >
              <Inventory2Icon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Purchase">
            <IconButton
              onClick={() => openWindow("purchase")}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sales">
            <IconButton
              onClick={() => openWindow("sales")}
            >
              <PointOfSaleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reports">
            <IconButton
              onClick={() => openWindow("reports")}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              onClick={() => openWindow("settings")}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

        </Box>

        <IconButton>
          <AccountCircleIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}