import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";

import DashboardIcon
  from "@mui/icons-material/Dashboard";

import BusinessIcon
  from "@mui/icons-material/Business";

import LocalShippingIcon
  from "@mui/icons-material/LocalShipping";

import PeopleIcon
  from "@mui/icons-material/People";

import BrandingWatermarkIcon
  from "@mui/icons-material/BrandingWatermark";

import CategoryIcon
  from "@mui/icons-material/Category";

import PaletteIcon
  from "@mui/icons-material/Palette";

import StraightenIcon
  from "@mui/icons-material/Straighten";

import Inventory2Icon
  from "@mui/icons-material/Inventory2";

import AccountBalanceWalletIcon
  from "@mui/icons-material/AccountBalanceWallet";

import ShoppingCartIcon
  from "@mui/icons-material/ShoppingCart";

import PointOfSaleIcon
  from "@mui/icons-material/PointOfSale";

import AssessmentIcon
  from "@mui/icons-material/Assessment";

import SettingsIcon
  from "@mui/icons-material/Settings";

import AccountCircleIcon
  from "@mui/icons-material/AccountCircle";

import { useWindowManager }
  from "../../context/WindowManager";


export default function Header() {

  const {
    openWindow,
  } = useWindowManager();


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

      <Toolbar
        sx={{
          minHeight:
            "60px !important",
        }}
      >

        {/* ============================================= */}
        {/* ERP NAME */}
        {/* ============================================= */}

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mr: 3,
            whiteSpace: "nowrap",
          }}
        >
          MyBusinessAI ERP
        </Typography>


        {/* ============================================= */}
        {/* MODULES */}
        {/* ============================================= */}

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexGrow: 1,
            overflowX: "auto",
          }}
        >

          {/* ========================================= */}
          {/* DASHBOARD */}
          {/* ========================================= */}

          <Tooltip title="Dashboard">

            <IconButton
              onClick={() =>
                openWindow(
                  "dashboard"
                )
              }
            >
              <DashboardIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* COMPANY */}
          {/* ========================================= */}

          <Tooltip title="Company">

            <IconButton
              onClick={() =>
                openWindow(
                  "company"
                )
              }
            >
              <BusinessIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* SUPPLIER */}
          {/* ========================================= */}

          <Tooltip title="Supplier">

            <IconButton
              onClick={() =>
                openWindow(
                  "supplier"
                )
              }
            >
              <LocalShippingIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* CUSTOMER */}
          {/* ========================================= */}

          <Tooltip title="Customer">

            <IconButton
              onClick={() =>
                openWindow(
                  "customer"
                )
              }
            >
              <PeopleIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* BRAND */}
          {/* ========================================= */}

          <Tooltip title="Brand">

            <IconButton
              onClick={() =>
                openWindow(
                  "brand"
                )
              }
            >
              <BrandingWatermarkIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* CATEGORY */}
          {/* ========================================= */}

          <Tooltip title="Category">

            <IconButton
              onClick={() =>
                openWindow(
                  "category"
                )
              }
            >
              <CategoryIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* COLOR */}
          {/* ========================================= */}

          <Tooltip title="Color">

            <IconButton
              onClick={() =>
                openWindow(
                  "color"
                )
              }
            >
              <PaletteIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* SIZE */}
          {/* ========================================= */}

          <Tooltip title="Size">

            <IconButton
              onClick={() =>
                openWindow(
                  "size"
                )
              }
            >
              <StraightenIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* UNIT */}
          {/* ========================================= */}

          <Tooltip title="Unit">

            <IconButton
              onClick={() =>
                openWindow(
                  "unit"
                )
              }
            >
              <StraightenIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* PRODUCT */}
          {/* ========================================= */}

          <Tooltip title="Products">

            <IconButton
              onClick={() =>
                openWindow(
                  "product"
                )
              }
            >
              <Inventory2Icon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* STOCK LEDGER */}
          {/* ========================================= */}

          <Tooltip title="Stock Ledger">

            <IconButton
              onClick={() =>
                openWindow(
                  "stock-ledger"
                )
              }
            >
              <AccountBalanceWalletIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* PURCHASE */}
          {/* ========================================= */}

          <Tooltip title="Purchase">

            <IconButton
              onClick={() =>
                openWindow(
                  "purchase"
                )
              }
            >
              <ShoppingCartIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* SALES */}
          {/* ========================================= */}

          <Tooltip title="Sales">

            <IconButton
              onClick={() =>
                openWindow(
                  "sales"
                )
              }
            >
              <PointOfSaleIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* REPORTS */}
          {/* ========================================= */}

          <Tooltip title="Reports">

            <IconButton
              onClick={() =>
                openWindow(
                  "reports"
                )
              }
            >
              <AssessmentIcon />
            </IconButton>

          </Tooltip>


          {/* ========================================= */}
          {/* SETTINGS */}
          {/* ========================================= */}

          <Tooltip title="Settings">

            <IconButton
              onClick={() =>
                openWindow(
                  "settings"
                )
              }
            >
              <SettingsIcon />
            </IconButton>

          </Tooltip>

        </Box>


        {/* ============================================= */}
        {/* USER */}
        {/* ============================================= */}

        <Tooltip title="Account">

          <IconButton>
            <AccountCircleIcon />
          </IconButton>

        </Tooltip>

      </Toolbar>

    </AppBar>

  );
}