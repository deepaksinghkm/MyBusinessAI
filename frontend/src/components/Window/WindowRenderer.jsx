import { Typography } from "@mui/material";

import DashboardPage from "../Dashboard/DashboardPage";
import CompanyPage from "../Company/CompanyPage";

import SupplierPage from "../../pages/Supplier/SupplierPage";
import CustomerPage from "../../pages/Customer/CustomerPage";

import BrandPage from "../../pages/Brand/BrandPage";
import CategoryPage from "../../pages/Category/CategoryPage";
import ColorPage from "../../pages/Color/ColorPage";
import SizePage from "../../pages/Size/SizePage";
import UnitPage from "../../pages/Unit/UnitPage";

import ProductPage from "../../pages/Product/ProductPage";
import ProductVariantPage from "../../pages/ProductVariant";
import StockLedgerPage from "../../pages/StockLedger";
import PurchasePage from "../../pages/Purchase/PurchasePage";
import SalesPage from "../../pages/Sales/SalesPage";

import ReportsPage from "../../pages/Reports/ReportsPage";
import SalesRegisterPage from "../../pages/Reports/SalesRegisterPage";
import MastersPage from "../../pages/Masters/MastersPage";

export default function WindowRenderer({ window }) {
  switch (window.id) {
    case "dashboard":
      return <DashboardPage />;

    case "company":
      return <CompanyPage />;

    case "supplier":
      return <SupplierPage />;

    case "customer":
      return <CustomerPage />;

    case "masters":
      return <MastersPage />;

    case "brand":
      return <BrandPage />;

    case "category":
      return <CategoryPage />;

    case "color":
      return <ColorPage />;

    case "size":
      return <SizePage />;

    case "unit":
      return <UnitPage />;

    case "product":
      return <ProductPage />;

    case "product-variant":
      return <ProductVariantPage />;

    case "stock-ledger":
      return <StockLedgerPage />;

    case "purchase":
      return <PurchasePage />;

    case "sales":
      return <SalesPage />;

    case "reports":
      return <ReportsPage />;

    case "sales-register":
      return <SalesRegisterPage />;

    case "settings":
      return (
        <Typography variant="h5">
          Settings Window Working
        </Typography>
      );

    default:
      return (
        <Typography variant="h5">
          Module Not Found
        </Typography>
      );
  }
}