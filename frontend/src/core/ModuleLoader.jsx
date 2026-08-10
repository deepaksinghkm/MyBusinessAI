import { Typography } from "@mui/material";

import CompanyPage from "../components/Company/CompanyPage";

export default function ModuleLoader({
  module,
}) {
  switch (module) {
    case "company":
      return <CompanyPage />;

    case "dashboard":
      return (
        <Typography variant="h4">
          Dashboard
        </Typography>
      );

    case "brand":
      return (
        <Typography variant="h4">
          Brand Master
        </Typography>
      );

    case "category":
      return (
        <Typography variant="h4">
          Category Master
        </Typography>
      );

    case "color":
      return (
        <Typography variant="h4">
          Color Master
        </Typography>
      );

    case "size":
      return (
        <Typography variant="h4">
          Size Master
        </Typography>
      );

    case "unit":
      return (
        <Typography variant="h4">
          Unit Master
        </Typography>
      );

    case "product":
      return (
        <Typography variant="h4">
          Product Master
        </Typography>
      );

    case "purchase":
      return (
        <Typography variant="h4">
          Purchase
        </Typography>
      );

    case "sales":
      return (
        <Typography variant="h4">
          Sales
        </Typography>
      );

    case "inventory":
      return (
        <Typography variant="h4">
          Inventory
        </Typography>
      );

    case "reports":
      return (
        <Typography variant="h4">
          Reports
        </Typography>
      );

    case "settings":
      return (
        <Typography variant="h4">
          Settings
        </Typography>
      );

    default:
      return (
        <Typography>
          Module Not Found
        </Typography>
      );
  }
}