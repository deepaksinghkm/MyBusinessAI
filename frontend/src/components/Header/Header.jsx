import { useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";

import BusinessIcon from "@mui/icons-material/Business";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import PaletteIcon from "@mui/icons-material/Palette";
import StraightenIcon from "@mui/icons-material/Straighten";
import ScaleIcon from "@mui/icons-material/Scale";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import TuneIcon from "@mui/icons-material/Tune";

import HelpIcon from "@mui/icons-material/Help";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useWindowManager } from "../../context/WindowManager";

export default function Header() {
  const { openWindow } = useWindowManager();

  // =========================================================
  // MENU ANCHORS
  // =========================================================

  const [administrationAnchor, setAdministrationAnchor] =
    useState(null);

  const [transactionsAnchor, setTransactionsAnchor] =
    useState(null);

  const [reportsAnchor, setReportsAnchor] =
    useState(null);

  const [printingAnchor, setPrintingAnchor] =
    useState(null);

  // =========================================================
  // OPEN / CLOSE MENUS
  // =========================================================

  const handleAdministrationOpen = (event) => {
    setAdministrationAnchor(event.currentTarget);
  };

  const handleAdministrationClose = () => {
    setAdministrationAnchor(null);
  };

  const handleTransactionsOpen = (event) => {
    setTransactionsAnchor(event.currentTarget);
  };

  const handleTransactionsClose = () => {
    setTransactionsAnchor(null);
  };

  const handleReportsOpen = (event) => {
    setReportsAnchor(event.currentTarget);
  };

  const handleReportsClose = () => {
    setReportsAnchor(null);
  };

  const handlePrintingOpen = (event) => {
    setPrintingAnchor(event.currentTarget);
  };

  const handlePrintingClose = () => {
    setPrintingAnchor(null);
  };

  // =========================================================
  // OPEN MODULE
  // =========================================================

  const openModule = (moduleId) => {
    handleAdministrationClose();
    handleTransactionsClose();
    handleReportsClose();
    handlePrintingClose();

    openWindow(moduleId);
  };

  return (
    <>
      {/* =====================================================
          TOP ERP HEADER
      ====================================================== */}

      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          height: 64,
          bgcolor: "#ffffff",
          color: "#0f172a",
          zIndex: 3000,
          borderBottom:
            "1px solid #dbe3ef",
        }}
      >
        <Toolbar
          sx={{
            minHeight:
              "64px !important",
            px: 1.5,
            gap: 0.5,
          }}
        >
          {/* =================================================
              LOGO / ERP NAME
          ================================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 190,
              mr: 1,
              userSelect: "none",
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1976d2",
                letterSpacing: "-0.3px",
              }}
            >
              MyBusinessAI
            </Typography>

            <Typography
              sx={{
                ml: 0.7,
                fontSize: 11,
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: 1,
              }}
            >
              ERP
            </Typography>
          </Box>

          {/* =================================================
              DASHBOARD
          ================================================== */}

          <Button
            startIcon={
              <DashboardIcon />
            }
            onClick={() =>
              openModule("dashboard")
            }
            sx={topMenuStyle}
          >
            Dashboard
          </Button>

          {/* =================================================
              ADMINISTRATION
          ================================================== */}

          <Button
            startIcon={
              <AdminPanelSettingsIcon />
            }
            onClick={
              handleAdministrationOpen
            }
            sx={topMenuStyle}
          >
            Administration
          </Button>

          <Menu
            anchorEl={
              administrationAnchor
            }
            open={Boolean(
              administrationAnchor
            )}
            onClose={
              handleAdministrationClose
            }
            MenuListProps={{
              dense: true,
            }}
            PaperProps={{
              sx: menuPaperStyle,
            }}
          >
            <MenuSection title="MASTERS" />

            <MenuItem
              onClick={() =>
                openModule("company")
              }
            >
              <BusinessIcon
                sx={menuIconStyle}
              />
              Company Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("supplier")
              }
            >
              <LocalShippingIcon
                sx={menuIconStyle}
              />
              Supplier Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("customer")
              }
            >
              <PeopleIcon
                sx={menuIconStyle}
              />
              Customer Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("brand")
              }
            >
              <BrandingWatermarkIcon
                sx={menuIconStyle}
              />
              Brand Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("category")
              }
            >
              <CategoryIcon
                sx={menuIconStyle}
              />
              Category Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("color")
              }
            >
              <PaletteIcon
                sx={menuIconStyle}
              />
              Colour Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("size")
              }
            >
              <StraightenIcon
                sx={menuIconStyle}
              />
              Size Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("unit")
              }
            >
              <ScaleIcon
                sx={menuIconStyle}
              />
              Unit Master
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("product")
              }
            >
              <Inventory2Icon
                sx={menuIconStyle}
              />
              Product Master
            </MenuItem>
          </Menu>

          {/* =================================================
              TRANSACTIONS
          ================================================== */}

          <Button
            startIcon={
              <ShoppingCartIcon />
            }
            onClick={
              handleTransactionsOpen
            }
            sx={topMenuStyle}
          >
            Transactions
          </Button>

          <Menu
            anchorEl={
              transactionsAnchor
            }
            open={Boolean(
              transactionsAnchor
            )}
            onClose={
              handleTransactionsClose
            }
            MenuListProps={{
              dense: true,
            }}
            PaperProps={{
              sx: menuPaperStyle,
            }}
          >
            <MenuSection title="TRANSACTIONS" />

            <MenuItem
              onClick={() =>
                openModule("purchase")
              }
            >
              <ShoppingBasketIcon
                sx={menuIconStyle}
              />
              Purchase
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("sales")
              }
            >
              <PointOfSaleIcon
                sx={menuIconStyle}
              />
              Sales
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("stock-ledger")
              }
            >
              <AccountBalanceWalletIcon
                sx={menuIconStyle}
              />
              Stock Ledger
            </MenuItem>
          </Menu>

          {/* =================================================
              REPORTS
          ================================================== */}

          <Button
            startIcon={
              <AssessmentIcon />
            }
            onClick={
              handleReportsOpen
            }
            sx={topMenuStyle}
          >
            Reports
          </Button>

          <Menu
            anchorEl={reportsAnchor}
            open={Boolean(
              reportsAnchor
            )}
            onClose={
              handleReportsClose
            }
            MenuListProps={{
              dense: true,
            }}
            PaperProps={{
              sx: {
                ...menuPaperStyle,
                minWidth: 270,
              },
            }}
          >
            <MenuSection title="REPORTS" />

            <MenuItem
              onClick={() =>
                openModule("sales-register")
              }
            >
              <ReceiptLongIcon
                sx={menuIconStyle}
              />
              Sales Register
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("reports")
              }
            >
              <AssessmentIcon
                sx={menuIconStyle}
              />
              Reports Dashboard
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("customer")
              }
            >
              <PeopleAltIcon
                sx={menuIconStyle}
              />
              Customer Report
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("supplier")
              }
            >
              <LocalShippingOutlinedIcon
                sx={menuIconStyle}
              />
              Supplier Report
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("product")
              }
            >
              <InventoryIcon
                sx={menuIconStyle}
              />
              Product Report
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("purchase")
              }
            >
              <ShoppingBagIcon
                sx={menuIconStyle}
              />
              Purchase Report
            </MenuItem>
          </Menu>

          {/* =================================================
              PRINTING
          ================================================== */}

          <Button
            startIcon={
              <PrintIcon />
            }
            onClick={
              handlePrintingOpen
            }
            sx={topMenuStyle}
          >
            Printing
          </Button>

          <Menu
            anchorEl={printingAnchor}
            open={Boolean(
              printingAnchor
            )}
            onClose={
              handlePrintingClose
            }
            MenuListProps={{
              dense: true,
            }}
            PaperProps={{
              sx: menuPaperStyle,
            }}
          >
            <MenuSection title="PRINTING" />

            <MenuItem
              onClick={() =>
                openModule("sales-register")
              }
            >
              <ReceiptLongIcon
                sx={menuIconStyle}
              />
              Sales Register
            </MenuItem>

            <MenuItem
              onClick={() =>
                openModule("reports")
              }
            >
              <AssessmentIcon
                sx={menuIconStyle}
              />
              Reports
            </MenuItem>
          </Menu>

          {/* =================================================
              SETTINGS
          ================================================== */}

          <Button
            startIcon={
              <SettingsIcon />
            }
            onClick={() =>
              openModule("settings")
            }
            sx={topMenuStyle}
          >
            Settings
          </Button>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <Box
            sx={{
              flexGrow: 1,
            }}
          />

          <Tooltip title="Help">
            <Button
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                color: "#475569",
              }}
            >
              <HelpIcon />
            </Button>
          </Tooltip>

          <Tooltip title="Account">
            <Button
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                color: "#475569",
              }}
            >
              <AccountCircleIcon />
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </>
  );
}

/* =========================================================
   MENU SECTION TITLE
========================================================= */

function MenuSection({ title }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 0.8,
        color: "#94a3b8",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 1,
        userSelect: "none",
      }}
    >
      {title}
    </Box>
  );
}

/* =========================================================
   TOP MENU STYLE
========================================================= */

const topMenuStyle = {
  minHeight: 42,
  px: 1.1,
  borderRadius: 1,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 13,
  color: "#334155",
  whiteSpace: "nowrap",

  "&:hover": {
    bgcolor: "#eaf2ff",
    color: "#1976d2",
  },

  "& .MuiButton-startIcon": {
    marginRight: 0.5,
  },
};

/* =========================================================
   DROPDOWN ICON
========================================================= */

const menuIconStyle = {
  mr: 1.5,
  fontSize: 20,
  color: "#1976d2",
};

/* =========================================================
   DROPDOWN PAPER
========================================================= */

const menuPaperStyle = {
  mt: 0.8,
  minWidth: 250,
  borderRadius: 1.5,
  border:
    "1px solid #e2e8f0",
  boxShadow:
    "0 10px 35px rgba(15,23,42,0.18)",

  "& .MuiMenuItem-root": {
    minHeight: 42,
    fontSize: 14,
    borderRadius: 0.8,
    mx: 0.5,
    mb: 0.2,

    "&:hover": {
      bgcolor: "#eff6ff",
      color: "#1976d2",
    },
  },
};
